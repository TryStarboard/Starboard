'use strict';

module.exports = {
  ui: false,
  files: [
    './template/**',
    './source-node5/**',
    './config/**',
    './public/**'
  ],
  proxy: {
    target: 'http://localhost:10000',
  },
  port: 10010,
  snippetOptions: {
    rule: {
      match: /$/
    }
  },
  reloadDebounce: 1000,
  reloadDelay: 1000
};
