'use strict';

const Redis = require('ioredis');

function createClient(opts, log) {
  const client = new Redis({
    host: opts.host,
    port: opts.port,
    password: opts.password,
    retryStrategy: () => 1000,
  });
  client.on('error', (err) => log.error(err));
  return client;
}

module.exports = {
  createClient,
};
