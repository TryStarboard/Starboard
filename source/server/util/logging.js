import winston from 'winston';
import koaLogger from 'koa-logger';

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
  json: true,
  colorize: true,
  timestamp: true,
  prettyPrint: true,
  humanReadableUnhandledException: true,
});

export const logger = winston;
export const middleware = koaLogger();
