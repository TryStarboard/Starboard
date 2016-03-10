'use strict';

const fs = require('fs');
const join = require('path').join;
const base = require('./webpack.config.base');

const node_modules = fs.readdirSync('node_modules')
  .filter((x) => x !== '.bin' )
  .map((x) => new RegExp(`^${x}`));

base.module.loaders[0].query.plugins =
  base.module.loaders[0].query.plugins.concat([
    'transform-function-bind',
  ]);

base.module.loaders[0].query.presets.push('es2015-node5');

module.exports = Object.assign(base, {
  target: 'node',

  entry: './source/server/index.js',

  externals: node_modules,

  node: {
    console: false,
    process: false,
    global: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false,
  },

  output: {
    filename: 'server.js',
    path: join(__dirname, 'build'),
    libraryTarget: 'commonjs2',
  },
});
