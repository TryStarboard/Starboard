'use strict';

const fs = require('fs');
const join = require('path').join;

module.exports = {
  target: 'node',
  entry: './source/delayed-job/index.js',
  externals: fs.readdirSync(join(__dirname, 'node_modules'))
    .filter((x) => x !== '.bin')
    .map((x) => new RegExp(`^${x}`)),
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
    filename: 'delayed-job.js',
    path: join(__dirname, 'build'),
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
          presets: ['es2015-node5'],
          plugins: ['transform-function-bind'],
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
  },
};
