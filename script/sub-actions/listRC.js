'use strict';

const co = require('co');
const R = require('ramda');

const exec = require('../util/ShellUtil').exec;

module.exports = co.wrap(function *() {
  const rcoutput = yield exec('kubectl get rc -o=json', {wantReturns: true});
  console.log(R.pipe(
    JSON.parse,
    R.prop('items'),
    R.map(R.path(['metadata', 'labels'])),
    R.partialRight(JSON.stringify, [null, 4])
  )(rcoutput));
});
