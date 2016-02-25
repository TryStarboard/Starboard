'use strict';

const join = require('path').join;
const base = require('./webpack.config.base');

base.module.loaders[0].query.plugins =
  base.module.loaders[0].query.plugins.concat(['transform-runtime']);

base.module.loaders[0].query.presets.push('es2015');

module.exports = Object.assign(base, {
  entry: './source/client/index.js',

  output: {
    filename: 'bundle.js',
    path: join(__dirname, 'public'),
  },

  devtool: 'source-map',
});
