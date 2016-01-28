'use strict';

const fs = require('fs');
const join = require('path').join;
const node_modules = fs.readdirSync('node_modules').filter((x) => x !== '.bin' );

module.exports = {
  target: 'node',

  entry: './source/server/index.js',

  externals: node_modules,

  node: {
    console: false,
    process: false,
    global: false,
    Buffer: false,
    __filename: true,
    __dirname: true,
    setImmediate: false,
  },

  output: {
    filename: 'index.js',
    path: join(__dirname, 'source-node5/server'),
    libraryTarget: 'commonjs2',
  },

  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015-node5'],
        }
      },
      {
        test: /\.jpg$/,
        loader: 'file',
      },
    ]
  },

};
