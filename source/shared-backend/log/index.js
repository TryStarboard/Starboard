import bunyan from 'bunyan';
import config from 'config';
import {identity} from 'ramda';

const opts = {
  name: 'starboard',
  env: config.get('currentEnv'),
  serializers: {
    // Don't serialize error here, since Sentry needs the original error object
    err: identity
  }
};

if (config.get('isDev')) {
  opts.streams = [
    require('./pretty').default, // Babel compiled ES2015 module
  ];
} else {
  opts.streams = [
    require('./sentry').default, // Babel compiled ES2015 module
    require('./logentries').default, // Babel compiled ES2015 module
  ];
}

const log = bunyan.createLogger(opts);

export {
  log as default
};
