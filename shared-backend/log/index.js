const bunyan = require('bunyan');
const config = require('config');
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
  opts.streams = [
    require('./pretty'), // Babel compiled ES2015 module
  ];
} else {
  opts.streams = [
    require('./sentry'), // Babel compiled ES2015 module
    require('./logentries'), // Babel compiled ES2015 module
  ];
}

module.exports = bunyan.createLogger(opts);
