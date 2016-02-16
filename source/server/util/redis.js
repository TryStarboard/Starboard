import config from 'config';
import Redis from 'ioredis';
import { logger } from './logging';

const client = new Redis(config.get('redis'));

client.on('error', (err) => {
  logger.error(err);
});

export {
  client,
};
