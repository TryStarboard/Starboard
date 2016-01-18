'use strict';

module.exports = {
  entry: './source/client/js/index.js',

  output: {
    filename: './public/bundle.js'
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
          plugins: ['transform-runtime']
        }
      },
    ]
  }
};
