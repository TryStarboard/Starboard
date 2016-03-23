import config                    from 'config';
import socketio                  from 'socket.io';
import Cookies                   from 'cookies';
import co                        from 'co';
import { curry                 } from 'ramda';
import { props                 } from 'bluebird';
import Redis                     from 'ioredis';
import log                       from '../../shared-backend/log';
import { client as redisClient } from '../../shared-backend/redis';
import { getReposWithIds       } from '../../shared-backend/model/Repos';
import { getAll as getAllTags  } from '../../shared-backend/model/Tags';
import { SYNC_REPOS            } from '../../shared/action-types';
import { enqueueSyncStarsJob   } from './JobQueue';
import {
  UPDATE_SOME_REPOS,
  REMOVE_REPOS,
  UPDATE_TAGS
} from '../../client/actions-server/creators';

const COOKIE_KEYS = config.get('cookie.keys');

const sub = new Redis(config.get('redis'));
const subCounters = new Map();

function subscribeRedis(channelName) {
  const current = subCounters.get(channelName);
  if (!current) {
    subCounters.set(channelName, 1);
  } else {
    subCounters.set(channelName, current + 1);
  }
}

function unsubscribeRedis(channelName) {
  const current = subCounters.get(channelName);

  if (!current) {
    throw new Error(`subCounters key "${channelName}" cannot be "${current}"`);
  }

  if (current > 1) {
    subCounters.set(channelName, current - 1);
    return;
  }

  subCounters.set(channelName, 0);
  sub.unsubscribe(channelName, (err) => {
    if (err) {
      log.error(err, 'UNSUBSCRIBE_SYNC_STARS_CHANNEL_ERROR');
    }
  });
}

function authenticate(socket, next) {
  co(function *() {

    const cookies = new Cookies(socket.request, null, COOKIE_KEYS);
    const sid = cookies.get('koa.sid', {signed: true});

    const str = yield redisClient.get(`koa:sess:${sid}`);

    const obj = JSON.parse(str);

    if (!obj || obj.passport.user == null) {
      next(new Error('session not found, cannot auth websocket'));
    } else {
      socket.handshake.user = { id: obj.passport.user };
      next();
    }

  }).catch(next);
}

const handleChannelMessage = curry((socket, user_id, channelName, channel, message) => {
  if (channel !== channelName) {
    return;
  }

  const event = JSON.parse(message);

  switch (event.type) {
  case 'UPDATED_ITEM':
    props({
      repos: getReposWithIds(event.repo_ids),
      tags: getAllTags(user_id),
    })
    .then(({tags, repos}) => {
      socket.emit(UPDATE_TAGS, tags);
      socket.emit(UPDATE_SOME_REPOS, repos);
    });
    break;
  case 'DELETED_ITEM':
    socket.emit(REMOVE_REPOS, event.deleted_repo_ids);
    break;
  default:
    // No additional case
  }
});

function handleConnection(socket) {
  const user_id = socket.handshake.user.id;
  const channelName = `sync-stars:user_id:${user_id}`;
  const messageHandler = handleChannelMessage(socket, user_id, channelName);

  sub.on('message', messageHandler);
  subscribeRedis(channelName);
  socket.on(SYNC_REPOS, () => enqueueSyncStarsJob(user_id));

  // Clean up
  socket.on('disconnect', () => {
    unsubscribeRedis(channelName);
    sub.removeListener('message', messageHandler);
  });
}

export function createWebsocketServer(server) {
  const io = socketio(server, { serveClient: false });
  io.use(authenticate);
  io.on('connection', handleConnection);
}
