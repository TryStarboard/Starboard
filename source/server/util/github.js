import config from 'config';
import github from 'octonode';

github.auth.config({
  id: config.get('github.clientID'),
  secret: config.get('github.clientSecret'),
});

export { github as default };
