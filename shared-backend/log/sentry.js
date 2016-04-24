'use strict';

const config = require('config');
const es = require('event-stream');
const raven = require('raven');
const {omit, merge} = require('ramda');
const {LEVELS} = require('./util');

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

module.exports = {
  type: 'raw',
  stream,
};
