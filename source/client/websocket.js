import io from 'socket.io-client';
import {
  UPDATE_SOME_REPOS,
  REMOVE_REPOS,
  UPDATE_TAGS,
  updateSomeRepos,
  removeRepos,
  updateTags
} from '../universal/actions/serverActions';

let socket;

export function connectSocket(store) {

  socket = io();

  // TODO: handle event emitting when connection is not ready yet

  socket.on(UPDATE_SOME_REPOS, function (repos) {
    store.dispatch(updateSomeRepos(repos));
  });

  // TODO: bacause "repos" is using "tags" to get color data,
  // when they arrive in different order, rendering "repos" can throw error due
  // to new "tags" is not pushed to store yet

  socket.on(REMOVE_REPOS, function (repoFullNames) {
    store.dispatch(removeRepos(repoFullNames));
  });

  socket.on(UPDATE_TAGS, function (tags) {
    store.dispatch(updateTags(tags));
  });
}

export function getClient() {
  return socket;
}
