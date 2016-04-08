import config   from 'config';
import Redis    from 'ioredis';
import throttle from 'lodash/throttle';
import log      from './log';

const throttleLog = throttle((err) => log.error(err), 1000, {trailing: false});

const client = new Redis(config.get('redis'));

client.on('error', throttleLog);

export {
  client,
};
