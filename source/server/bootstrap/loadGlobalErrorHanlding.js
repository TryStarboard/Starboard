import { logger } from '../util/logging';

process.on('unhandledRejection', (reason, promise) => {
  // reason might be an instance of Error
  logger.error('unhandledRejection', {error: reason});
});

process.on('uncaughtException', (error) => {
  logger.error('uncaughtException', { error });
});
