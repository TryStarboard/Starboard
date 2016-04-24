const {evolve} = require('ramda');
const bunyan = require('bunyan');

const LEVELS = {
  '60': 'fetal',
  '50': 'error',
  '40': 'warn',
  '30': 'info',
  '20': 'debug',
  '10': 'trace',
};

const transformLogData = evolve({
  err: bunyan.stdSerializers.err,
  level(val) {
    return LEVELS[val];
  }
});

module.exports = {
  LEVELS,
  transformLogData,
};
