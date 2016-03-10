import io from 'socket.io-client';
import {
  UPDATE_SOME_REPOS,
  REMOVE_REPOS,
  UPDATE_TAGS,
} from './actions-server/creators';
import {
  updateSomeRepos,
  removeRepos,
  updateTags
} from './actions-server';

const socket = io();

// TODO: handle event emitting when connection is not ready yet

socket.on(UPDATE_SOME_REPOS, function (repos) {
  updateSomeRepos(repos);
});

// TODO: bacause "repos" is using "tags" to get color data,
// when they arrive in different order, rendering "repos" can throw error due
// to new "tags" is not pushed to store yet

socket.on(REMOVE_REPOS, function (deletedRepoIds) {
  removeRepos(deletedRepoIds);
});

socket.on(UPDATE_TAGS, function (tags) {
  updateTags(tags);
});

export { socket as default };
