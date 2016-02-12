import Router from 'koa-router';
import { getAll as getAllStars } from '../../../util/data/stars';
import syncStarsForUser from '../../../util/data/syncStarsForUser';
import { getClient } from '../../../util/websocket';
import {
  UPDATE_SOME_REPOS,
  REMOVE_REPOS
} from '../../../../universal/actions/serverActions';

function *ensureAuthed(next) {
  if (this.req.isAuthenticated()) {
    yield next;
  } else {
    this.res.status = 401;
  }
}

const authedRoute = new Router();

authedRoute.get('/logout', ensureAuthed, function *() {
  this.req.logout();
  this.status = 200;
});

authedRoute.get('/stars', ensureAuthed, function *() {
  this.body = yield getAllStars(this.req.user.id);
});

authedRoute.get('/stars/sync', ensureAuthed, function *() {

  // TODO: This won't work in multi-process enviornment, because HTTP may come
  // to a different process than WebSocket
  syncStarsForUser(this.req.user.id)
    .subscribe((repos) => {
      getClient().emit(UPDATE_SOME_REPOS, repos);
    });

  this.status = 200;
});

export { authedRoute as default };
