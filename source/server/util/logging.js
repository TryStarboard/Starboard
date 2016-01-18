import winston from 'winston';
import expressWinston from 'express-winston';

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
  json: true,
  colorize: true,
  timestamp: true,
  prettyPrint: true,
  humanReadableUnhandledException: true,
});

export const logger = winston;

export const loggingMiddleware = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      colorize: true
    })
  ],
  meta: false,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorStatus: true,
});
