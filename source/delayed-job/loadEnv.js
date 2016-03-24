/*eslint no-process-env:0*/

import dotenv from 'dotenv';

dotenv.config({
  path: '/etc/secret-volume/env-var',
  silent: process.env.NODE_ENV === 'development',
});
