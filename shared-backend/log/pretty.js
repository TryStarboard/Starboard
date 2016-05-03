'use strict';

const {render} = require('prettyjson');
const {map} = require('event-stream');
const {transformLogData} = require('./util');

const pretty = map((data, cb) => {
  const transformed = transformLogData(data);
  cb(null, `${render(transformed)}\n---------------------------------------\n`);
});

pretty.pipe(process.stdout);

module.exports = {
  type: 'raw',
  stream: pretty,
};
