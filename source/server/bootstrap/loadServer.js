import http from 'http';
import createKoaServer from './createKoaServer';
import { logger } from '../util/logging';
import { createWebsocketServer } from '../util/websocket';

const koaApp = createKoaServer();

const server = http.createServer(koaApp.callback());

createWebsocketServer(server);

server.listen(10000, '0.0.0.0', () => {
  logger.info('Server listening on 0.0.0.0:10000');
});

['SIGTERM', 'SIGINT'].forEach(function (sig) {
  process.once(sig, function () {
    logger.info(`receive ${sig}`);
    server.close(function () {
      logger.info(`server closed on ${sig}`, {}, function () {
        process.exit(0);
      });
    });
  });
});
