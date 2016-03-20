'use strict';

const join = require('path').join;
const merge = require('ramda').merge;
const base = require('./webpack.config.backend-base');

module.exports = merge({
  entry: './source/server/index.js',
  output: {
    filename: 'server.js',
    path: join(__dirname, 'build'),
    libraryTarget: 'commonjs2',
  },
}, base);
