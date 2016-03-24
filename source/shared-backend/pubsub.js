import config                    from 'config';
import Redis                     from 'ioredis';
import log                       from './log';

export const subClient = new Redis(config.get('redis'));

const subCounters = new Map();

export function subscribe(channelName) {
  const current = subCounters.get(channelName);
  if (!current) {
    subCounters.set(channelName, 1);
    subClient.subscribe(channelName, (err) => {
      if (err) {
        log.error(err, 'SUBSCRIBE_SYNC_STARS_CHANNEL_ERROR');
      }
    });
  } else {
    subCounters.set(channelName, current + 1);
  }
}

export function unsubscribe(channelName) {
  const current = subCounters.get(channelName);

  if (!current) {
    throw new Error(`subCounters key "${channelName}" cannot be "${current}"`);
  }

  if (current > 1) {
    subCounters.set(channelName, current - 1);
    return;
  }

  subCounters.set(channelName, 0);
  subClient.unsubscribe(channelName, (err) => {
    if (err) {
      log.error(err, 'UNSUBSCRIBE_SYNC_STARS_CHANNEL_ERROR');
    }
  });
}
