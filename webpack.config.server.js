'use strict';

const fs = require('fs');
const join = require('path').join;
const node_modules = fs.readdirSync('node_modules')
  .filter((x) => x !== '.bin' )
  .map((x) => new RegExp(`^${x}`));

module.exports = {
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

  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015-node5'],
          plugins: [
            'transform-function-bind',
            'transform-class-properties',
            'transform-object-rest-spread',
            'transform-react-constant-elements',
            'transform-react-inline-elements',
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
  },

};
