import socketio from 'socket.io';

let socket;

export function configWebsocket(server) {
  const io = socketio(server, {
    serveClient: false
  });

  io.on('connection', (_socket) => {
    socket = _socket;
    console.log('a user connected');
  });
}

export function getClient() {
  return socket;
}
