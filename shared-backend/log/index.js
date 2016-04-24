'use strict';

const bunyan = require('bunyan');
const {identity} = require('ramda');

const opts = {
  name: 'starboard',
  env: process.env.NODE_ENV,
  serializers: {
    // Don't serialize error here, since Sentry needs the original error object
    err: identity
  }
};

if (process.env.NODE_ENV !== 'production') {
  opts.streams = [require('./pretty')];
} else {
  opts.streams = [require('./sentry'), require('./logentries')];
}

module.exports = bunyan.createLogger(opts);
