const config = require('config');
const es = require('event-stream');
const Logger = require('le_node');
const {transformLogData} = require('./util');

const definition = Logger.bunyanStream({
  token: config.get('logging.Logentries.token')
});

const transformStream = es.map((data, cb) => {
  cb(null, transformLogData(data));
});

// Replace stream
transformStream.pipe(definition.stream);
definition.stream = transformStream;

module.exports = definition;
