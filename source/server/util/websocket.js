import config from 'config';
import socketio from 'socket.io';
import Cookies from 'cookies';
import co from 'co';
import { client as redisClient } from './redis';
import log from './log';
import { enqueueSyncStarsJob } from './JobQueue';
import { SYNC_REPOS } from '../../shared/action-types';
import {
  UPDATE_SOME_REPOS,
  REMOVE_REPOS,
  UPDATE_TAGS
} from '../../client/actions-server/creators';

const KEYS = config.get('cookie.keys');

function authenticate(socket, next) {
  co(function *() {

    const cookies = new Cookies(socket.request, null, KEYS);
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

function handleSyncRepos(socket) {
  return function () {
    enqueueSyncStarsJob(socket.handshake.user.id)
      .subscribe(
        (event) => {
          switch (event.type) {
          case 'PROGRESS':
            const {tags, repos} = event.data;
            socket.emit(UPDATE_TAGS, tags);
            socket.emit(UPDATE_SOME_REPOS, repos);
            break;
          case 'DELETE':
            socket.emit(REMOVE_REPOS, event.data);
            break;
          default:
            // No additional case
          }
        },
        (error) => log.error('sync-stars-error', { error })
      );
  };
}

function handleConnection(socket) {
  socket.on(SYNC_REPOS, handleSyncRepos(socket));
}

export function createWebsocketServer(server) {
  const io = socketio(server, { serveClient: false });
  io.use(authenticate);
  io.on('connection', handleConnection);
}
