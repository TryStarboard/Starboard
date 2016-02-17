import { logger } from '../util/logging';

process.on('unhandledRejection', (reason, promise) => {
  // reason might be an instance of Error
  logger.error(reason);
});

process.on('uncaughtException', (err) => {
  logger.error(err);
});
