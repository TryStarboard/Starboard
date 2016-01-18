'use strict';

module.exports = {
  ui: false,
  files: [
    './template/**',
    './source/**',
    './config/**',
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
  reloadDebounce: 1000
};
