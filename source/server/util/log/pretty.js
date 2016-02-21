import es from 'event-stream';
import { transformLogData } from './util';

const pretty = es.map((data, cb) => {
  cb(null, `${JSON.stringify(transformLogData(data), null, 4)}\n`);
});

pretty.pipe(process.stdout);

export default {
  type: 'raw',
  stream: pretty,
};
