import socketio from 'socket.io';
import syncStarsForUser from './data/syncStarsForUser';
import {
  SYNC_REPOS
} from '../../universal/actionFactory';
import {
  UPDATE_SOME_REPOS
} from '../../universal/actions/serverActions';

let socket;

export function configWebsocket(server) {
  const io = socketio(server, {
    serveClient: false
  });

  // TODO: handle authentication

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
