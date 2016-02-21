/*eslint no-process-exit:0*/

import http from 'http';
import createKoaServer from './createKoaServer';
import log from '../util/log';
import { createWebsocketServer } from '../util/websocket';

const koaApp = createKoaServer();

const server = http.createServer(koaApp.callback());

createWebsocketServer(server);

server.listen(10000, '0.0.0.0', () => {
  log.info({tags: {b: 123123}}, 'Server listening on 0.0.0.0:10000');
});

['SIGTERM', 'SIGINT'].forEach(function (sig) {
  process.once(sig, function () {
    log.info(`receive ${sig}`);
    server.close(function () {
      log.info(`server closed on ${sig}`);
      process.exit(0);
    });
  });
});
