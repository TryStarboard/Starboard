import log from '../../shared-backend/log';

process.on('unhandledRejection', (reason, promise) => {
  // reason might be an instance of Error
  log.error(reason, 'unhandledRejection');
});

process.on('uncaughtException', (error) => {
  log.error(error, 'uncaughtException');
});
