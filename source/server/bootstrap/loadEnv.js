import dotenv from 'dotenv';
import config from 'config';

dotenv.config({
  path: '/etc/secret-volume/env-var',
  silent: config.get('isDev'),
});
