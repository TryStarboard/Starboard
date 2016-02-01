import config from 'config';
import github from 'octonode';
import { promisifyAll } from 'bluebird';

github.auth.config({
  id: config.get('github.clientID'),
  secret: config.get('github.clientSecret'),
});

promisifyAll(Object.getPrototypeOf(github.client()), {multiArgs: true});

export { github as default };
