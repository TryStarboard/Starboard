import 'le_node';
import config from 'config';
import winston from 'winston';
import koaLogger from 'koa-logger';

winston.remove(winston.transports.Console);

if (config.get('isDev')) {
  winston.add(winston.transports.Console, {
    colorize: true,
    timestamp: true,
    prettyPrint: true,
    humanReadableUnhandledException: true,
  });
} else {
  winston.add(winston.transports.Logentries, {
    token: config.get('logEntries.token'),
    minLevel: 1,
  });
}

export const logger = winston;
export const devLogging = koaLogger();
