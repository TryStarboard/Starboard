const config   = require('config');
const Redis    = require('ioredis');
const throttle = require('lodash/throttle');
const log      = require('./log');

const throttleLog = throttle((err) => log.error(err), 1000, {trailing: false});

const client = new Redis(config.get('redis'));

client.on('error', throttleLog);

module.exports = {
  client,
};
