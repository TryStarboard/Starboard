import 'source-map-support/register';
import './loadEnv';
import http from 'http';
import createKoaServer from './createKoaServer';
import { logger } from './util/logging';
import { createWebsocketServer } from './util/websocket';

const koaApp = createKoaServer();

const server = http.createServer(koaApp.callback());

createWebsocketServer(server);

server.listen(10000, '0.0.0.0', () => {
  logger.info('Server start listening on 0.0.0.0:10000');
});
