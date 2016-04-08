import config from 'config';
import es from 'event-stream';
import raven from 'raven';
import {omit, merge} from 'ramda';
import {LEVELS} from './util';

const client = new raven.Client(
  config.get('logging.Sentry.dsn'),
  config.get('logging.Sentry.options')
);

const stream = es.through(function (data) {
  if (data.err == null) {
    return;
  }

  const defaultTags = {
    env: data.env,
    name: data.name,
  };

  client.captureException(data.err, {
    tags: data.tags ? merge(defaultTags, data.tags) : defaultTags,
    level: LEVELS[data.level],
    extra: omit(['name', 'tags', 'env', 'level', 'err', 'v'], data),
  });
});

export default {
  type: 'raw',
  stream,
};
