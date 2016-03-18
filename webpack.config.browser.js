/*eslint no-process-env:0*/

'use strict';

const join = require('path').join;
const webpack = require('webpack');
const configModule = require('config');
const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';

const config = {
  entry: './source/client/index.js',

  output: {
    filename: 'bundle.js',
    path: join(__dirname, 'public'),
  },

  devtool: 'source-map',

  resolve: {
    alias: {
      img: join(__dirname, 'source/client/img'),
      svg: join(__dirname, 'source/client/svg'),
    }
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel?presets[]=es2015&presets[]=react'
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'file',
      },
      {
        test: /\.svg$/,
        loader: 'babel?presets[]=es2015&presets[]=react!svg-react',
      },
    ]
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      'MIXPANEL_TOKEN': JSON.stringify(configModule.get('mixpanel.token')),
    })
  ]
};

if (isProd) {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false
      }
    })
  );
}

module.exports = config;
