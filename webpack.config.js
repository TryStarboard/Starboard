'use strict';

const join = require('path').join;

module.exports = {
  entry: './source/client/index.tsx',

  output: {
    filename: 'bundle.js',
    path: join(__dirname, 'public'),
  },

  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.(tsx|ts)$/,
        exclude: /node_modules/,
        loader: 'ts'
      },
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: 'babel',
      //   query: {
      //     presets: ['react'],
      //     plugins: [
      //       'transform-function-bind',
      //       'transform-class-properties',
      //       'transform-object-rest-spread',
      //     ],
      //   }
      // },
      // {
      //   test: /\.(jpg|png)$/,
      //   loader: 'file',
      // },
      // {
      //   test: /\.svg$/,
      //   loader: 'babel?presets[]=react&presets[]=es2015!svg-react',
      // },
    ]
  }
};
