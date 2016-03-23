import config                    from 'config';
import socketio                  from 'socket.io';
import Cookies                   from 'cookies';
import co                        from 'co';
import { curry                 } from 'ramda';
import { props                 } from 'bluebird';
import Redis                     from 'ioredis';
import log                       from '../../shared-backend/log';
import { getReposWithIds       } from '../../shared-backend/model/Repos';
import { getAll as getAllTags  } from '../../shared-backend/model/Tags';
import { SYNC_REPOS            } from '../../shared/action-types';
import { client as redisClient } from './redis';
import { enqueueSyncStarsJob   } from './JobQueue';
import {
  UPDATE_SOME_REPOS,
  REMOVE_REPOS,
  UPDATE_TAGS
} from '../../client/actions-server/creators';

const COOKIE_KEYS = config.get('cookie.keys');

const sub = new Redis(config.get('redis'));

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

const handleChannelMessage = curry((socket, user_id, channel, message) => {
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

  sub.subscribe(`sync-stars:user_id:${user_id}`, (err) => {
    if (err) {
      log.error('SUBSCRIBE_SYNC_STARS_CHANNEL_ERROR', err);
    }
  });

  sub.on('message', handleChannelMessage(socket, user_id));

  socket.on(SYNC_REPOS, () => enqueueSyncStarsJob(user_id));

  // TODO: cleanup
  // sub.unsubscribe(channelName, (err, count) => {});
  // sub.removeEventListener('message', console.log);
}

export function createWebsocketServer(server) {
  const io = socketio(server, { serveClient: false });
  io.use(authenticate);
  io.on('connection', handleConnection);
}
