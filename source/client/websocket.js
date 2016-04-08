import io from 'socket.io-client';
import {
  UPDATE_SOME_REPOS,
  REMOVE_REPOS,
  UPDATE_TAGS,
  UPDATE_PROGRESS
} from '../shared/action-types';
import {
  updateSomeRepos,
  removeRepos,
  updateTags,
  updateProgress
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

socket.on(UPDATE_PROGRESS, function (progress) {
  updateProgress(progress);
});

export {socket as default};
