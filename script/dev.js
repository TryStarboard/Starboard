'use strict';

const join = require('path').join;
const webpack = require('webpack');
const nodemon = require('nodemon');
const browserSync = require('browser-sync');

const serverConf = require('../webpack.config.server');
const browserConf = require('../webpack.config.browser');
const delayedJobConf = require('../webpack.config.delayed-job');

class NodemonManager {
  constructor(opts) {
    this.opts = opts;
    this.hasStarted = false;
  }

  start() {
    if (this.hasStarted) {
      return;
    }
    this.nodemonInstance = nodemon(this.opts);
  }
}

class BrowserSyncManager {
  constructor(opts) {
    this.opts = opts;
    this.browserSync = browserSync;
    this.serverReady = false;
    this.clientReady = false;
    this.hasStarted = false;
  }

  start({server = false, client = false}) {
    if (this.hasStarted) {
      return;
    }
    this.serverReady = this.serverReady || server;
    this.clientReady = this.clientReady || client;
    if (this.serverReady && this.clientReady) {
      this.hasStarted = true;
      this.browserSync(this.opts);
    }
  }

  reload(changed) {
    if (this.hasStarted) {
      this.browserSync.reload(changed);
    }
  }
}

const serverNodemonManager = new NodemonManager({
  script: join(__dirname, '../build/server.js'),
  watch: [
    join(__dirname, '../config/*'),
    join(__dirname, '../build/server.js'),
  ],
  ext: 'js',
});

const delayedJobNodemonManager = new NodemonManager({
  script: join(__dirname, '../build/delayed-job.js'),
  watch: [
    join(__dirname, '../config/*'),
    join(__dirname, '../build/delayed-job.js'),
  ],
  ext: 'js',
});

const browserSyncManager = new BrowserSyncManager({
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
});

createWebpackWatcher(serverConf, (err, stats) => {
  console.log(stats.toString({chunkModules: false, colors: true}));
  serverNodemonManager.start();
  browserSyncManager.start({server: true});
});

createWebpackWatcher(delayedJobConf, (err, stats) => {
  console.log(stats.toString({chunkModules: false, colors: true}));
  delayedJobNodemonManager.start();
});

createWebpackWatcher(browserConf, (err, stats) => {
  console.log(stats.toString({chunkModules: false, colors: true}));
  browserSyncManager.start({client: true});
});

function createWebpackWatcher(config, onChangeHook) {
  return webpack(config).watch({aggregateTimeout: 300}, onChangeHook);
}
