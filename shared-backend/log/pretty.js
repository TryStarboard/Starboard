'use strict';

const {map} = require('event-stream');
const {transformLogData} = require('./util');

const pretty = map((data, cb) => {
  const transformed = transformLogData(data);
  cb(null, JSON.stringify(transformed));
});

pretty.pipe(process.stdout);

module.exports = {
  type: 'raw',
  stream: pretty,
};
