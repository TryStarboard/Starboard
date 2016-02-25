'use strict';

const join = require('path').join;

module.exports = {
  entry: './source/client/index.js',

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
          plugins: [
            'transform-function-bind',
            'transform-class-properties',
            'transform-object-rest-spread',
            'transform-runtime',
          ],
        }
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'file',
      },
      {
        test: /\.svg$/,
        loader: 'babel?presets[]=react&presets[]=es2015!svg-react',
      },
    ]
  }
};
