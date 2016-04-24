'use strict';

const es = require('event-stream');
const {transformLogData} = require('./util');

const pretty = es.map((data, cb) => {
  const transformed = transformLogData(data);
  const {req, err, msg} = transformed;

  if (req && !err) {
    cb(null, `${msg}:${req.url}\n`);
  } else {
    cb(null, `${JSON.stringify(transformed, null, 4)}\n`);
  }
});

pretty.pipe(process.stdout);

module.exports = {
  type: 'raw',
  stream: pretty,
};
