import 'le_node';
import config from 'config';
import winston from 'winston';
import raven from 'raven';
import R, { omit } from 'ramda';

const ENV = config.get('currentEnv');

winston.remove(winston.transports.Console);

class Sentry extends winston.Transport {
  constructor(opts) {
    super();
    this.name = 'Sentry';
    this.level = 'error';
    this.sentry = new raven.Client(opts.dsn, {
      release: opts.release,
    });
  }

  log(level, msg, meta, callback) {
    this.sentry.captureException(meta.error, {
      level,
      tags: meta.tags,
      extra: omit(['error', 'tags'], meta),
    }, function () {
      callback(null, true);
    });
  }
}

winston.transports.Sentry = Sentry;

const loggingConfig = config.get('logging');

for (const key of Object.keys(loggingConfig)) {
  winston.add(winston.transports[key], loggingConfig[key]);
}

const _log = winston.log;

winston.log = function (level, msg, meta = {}, cb = null) {
  const _meta = R.over(R.lensPath(['tags', 'env']), R.defaultTo(ENV), meta);
  _log.call(this, level, msg, _meta, null);
};

export const logger = winston;
