import config from 'config';
import es from 'event-stream';
import Logger from 'le_node';
import {transformLogData} from './util';

const definition = Logger.bunyanStream({
  token: config.get('logging.Logentries.token')
});

const transformStream = es.map((data, cb) => {
  cb(null, transformLogData(data));
});

// Replace stream
transformStream.pipe(definition.stream);
definition.stream = transformStream;

export {
  definition as default
};
