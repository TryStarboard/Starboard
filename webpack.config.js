'use strict';

const join = require('path').join;

module.exports = {
  entry: './source/client/js/index.js',

  output: {
    filename: 'bundle.js',
    path: join(__dirname, 'public'),
  },

  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
          plugins: ['transform-runtime', 'transform-function-bind'],
        }
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'file',
      },
    ]
  }
};
