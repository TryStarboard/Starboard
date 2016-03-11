'use strict';

module.exports = {
  ui: false,
  files: [
    './template/**',
    './config/**',
    './public/**',
    './build/**',
  ],
  proxy: {
    target: 'http://localhost:10000',
    ws: true,
  },
  port: 10010,
  reloadDebounce: 1000,
  reloadDelay: 1000,
  notify: false
};
