'use strict';

const DevRunner = require('dev-runner').DevRunner;

const join = require('path').join;
const bs = require('browser-sync').create();

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

const runner = new DevRunner({
  'start-database': {
    start: 'docker-compose up'
  },
  'build-http-server': {
    start: 'npm run watch:build:server'
  },
  'build-job-server': {
    start: 'npm run watch:build:delayed-job'
  },
  'build-client-js': {
    start: 'npm run watch:build:client:js',
    events: [
      {
        regex: /bundle\.js/,
        actionData() {
          return {type: 'ready'};
        }
      }
    ]
  },
  'build-client-css': {
    preStart: 'npm run build:client:css',
    start: 'npm run watch:build:client:css'
  },
  'start-http-server': {
    start: 'env NODE_ENV=development BLUEBIRD_WARNINGS=0 DEBUG="socket.io:server" nodemon -C -w build/server.js -w config build/server.js',
    events: [
      {
        regex: /Server listening/,
        actionData: {type: 'ready', source: 'http-server'},
      }
    ]
  },
  'start-job-server': {
    start: 'env NODE_ENV=development BLUEBIRD_WARNINGS=0 nodemon -C -w build/delayed-job.js -w config build/delayed-job.js'
  },
  'start-browser-sync': {
    dependsOn: ['build-client-js', 'start-http-server'],
    process(input, output) {
      bs.init(browserSyncOpts);

      input.on('action', (data) => {
        if (data.type === 'ready' && data.source === 'http-server') {
          bs.reload();
        }
      });
    }
  },
});

runner.run();

process.once('SIGINT', () => {
  console.log('\n---> Recieved SIGINT, disposing\n');
  runner.stop();
  bs.exit();

  // Stop everything
  setTimeout(() => {
    /*eslint-disable no-process-exit*/
    process.exit(1);
    /*eslint-enable no-process-exit*/
  }, 2000);
});
