'use strict';

module.exports = {
  isDev: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
  currentEnv: process.env.NODE_ENV || 'development',
};
