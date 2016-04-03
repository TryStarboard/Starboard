'use strict';

const Maxcon = require('maxcon');

const join = require('path').join;
const webpack = require('webpack');
const browserSync = require('browser-sync');
const childProcess = require('child_process');
const Rx = require('rx');

const serverConf = require('../webpack.config.server');
const delayedJobConf = require('../webpack.config.delayed-job');
const browserConf = require('../webpack.config.browser');

const browserSyncOpts = {
  ui: false,
  files: [
    join(__dirname, '../template/**'),
    join(__dirname, '../public/**'),
  ],
  proxy: {
    target: 'http://localhost:10000',
    ws: true,
  },
  port: 10010,
  reloadDebounce: 1000,
  reloadDelay: 1000,
  notify: false,
  ghostMode: false,
};

function spawn(cmd) {
  return Rx.Observable.create((observer) => {
    console.log(`---> Spawning ${cmd}`)
    const args = cmd.split(' ');
    const child = childProcess.spawn(args[0], args.slice(1), {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    child.stdout.on('data', (buffer) => {
      process.stdout.write(buffer);
      observer.onNext(buffer.toString());
    });
    child.stderr.on('data', (buffer) => {
      process.stderr.write(buffer);
      observer.onNext(buffer.toString());
    });
    return () => {
      console.log(`---> Stopping "${cmd}"`);
      child.kill('SIGINT');
    };
  });
}

function createWebpackWatcher(config) {
  return Rx.Observable.create((observer) => {
    const watcher = webpack(config).watch({aggregateTimeout: 300}, (err, stats) => {
      console.log(stats.toString({chunkModules: false, colors: true}));
      observer.onNext({type: 'BUILT'});
    });
    return () => {
      console.log('---> Closing webpack watcher');
      watcher.close();
    };
  });
}

const maxcon = new Maxcon({
  startDatabase: {
    process() {
      return Rx.Observable.create(() => {
        const sub = spawn('docker-compose up').publish().connect();
        return () => {
          // Give it sometime so node server won't freak out on Redis connection lost
          setTimeout(() => {
            sub.dispose();
          }, 1000);
        };
      });
    }
  },
  buildHttpServer: {
    process() {
      return createWebpackWatcher(serverConf);
    }
  },
  buildJobServer: {
    process() {
      return createWebpackWatcher(delayedJobConf);
    }
  },
  buildClientJs: {
    process() {
      return createWebpackWatcher(browserConf);
    }
  },
  buildClientCss: {
    process: () => spawn('npm run watch:build:client:css')
  },
  // TODO: watch config dir
  startHttpServer: {
    dependsOn: ['buildHttpServer'],
    process({buildHttpServer: a}) {
      return a.flatMapLatest(() => {
        return spawn('env NODE_ENV=development node build/server.js')
          .filter((str) => str.indexOf('Server listening') > -1);
      });
    }
  },
  // TODO: watch config dir
  startJobServer: {
    dependsOn: ['buildJobServer'],
    process({buildJobServer: a}) {
      return a.flatMapLatest(() => spawn('env NODE_ENV=development node build/delayed-job.js'));
    }
  },
  startBrowserSync: {
    dependsOn: ['buildClientJs', 'startHttpServer'],
    process({buildClientJs: a, startHttpServer: b}) {
      return Rx.Observable.create((observer) => {
        const s1 = Rx.Observable.zip(a.take(1), b.take(1))
          .doOnNext(() => browserSync(browserSyncOpts));

        // TODO: more robust change detection
        const s2 = Rx.Observable.merge(
          a.skip(1).map(() => join(__dirname, '../public/bundle.js')),
          b.skip(1).map(() => null)
        )
          .doOnNext((change) => browserSync.reload(change));

        const sub = Rx.Observable.merge(s1, s2).subscribe(observer);

        return () => {
          console.log('---> Exiting BrowserSync');
          sub.dispose();
          browserSync.exit();
        };
      });
    }
  },
});

maxcon.connect((err) => {
  console.error(err);
  console.error(err.stack);
});

process.once('SIGINT', () => {
  console.log('\n---> Recieved SIGINT, disposing\n');
  maxcon.dispose();
  setTimeout(() => {
    process.exit(1);
  }, 3000);
});
