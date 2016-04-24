'use strict';

const {pipe, map, evolve, over, lensPath, invoker, fromPairs} = require('ramda');
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
  level: (val) => LEVELS[val],
  err: bunyan.stdSerializers.err,
  req: over(
    lensPath(['headers', 'cookie']),
    pipe(
      invoker(1, 'split')(/; /),
      map(invoker(1, 'split')(/=/)),
      fromPairs
    )
  ),
});

module.exports = {
  LEVELS,
  transformLogData,
};
