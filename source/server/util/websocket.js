import config from 'config';
import socketio from 'socket.io';
import Cookies from 'cookies';
import syncStarsForUser from './data/syncStarsForUser';
import { client as redisClient } from './session';
import {
  SYNC_REPOS
} from '../../universal/actionFactory';
import {
  UPDATE_SOME_REPOS
} from '../../universal/actions/serverActions';

const KEYS = config.get('cookie.keys');

let socket;

export function configWebsocket(server) {
  const io = socketio(server, {
    serveClient: false
  });

  io.use(function(_socket, next) {
    const cookies = new Cookies(_socket.request, null, KEYS);
    const sid = cookies.get('koa.sid', {signed: true});

    redisClient.get(`koa:sess:${sid}`)
      .then((str) => {
        const obj = JSON.parse(str);
        if (!obj || obj.passport.user == null) {
          next(new Error('session not found, cannot auth websocket'));
          return;
        }
        next();
      })
      .catch(next);
  });

  io.on('connection', (_socket) => {
    socket = _socket;

    socket.on(SYNC_REPOS, function ({ id }) {
      syncStarsForUser(id)
        .subscribe((repos) => {
          socket.emit(UPDATE_SOME_REPOS, repos);
        });
    });
  });
}

export function getClient() {
  return socket;
}
