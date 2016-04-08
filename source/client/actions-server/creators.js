import NProgress from 'nprogress';
import {
  UPDATE_SOME_REPOS,
  REMOVE_REPOS,
  UPDATE_TAGS,
  UPDATE_PROGRESS} from '../../shared/action-types';

export function updateSomeRepos(repos) {
  return {
    type: UPDATE_SOME_REPOS,
    payload: repos,
  };
}

export function removeRepos(ids) {
  return {
    type: REMOVE_REPOS,
    payload: ids,
  };
}

export function updateTags(tags) {
  return {
    type: UPDATE_TAGS,
    payload: tags,
  };
}

let progressBarStarted = false;

export function updateProgress(progress) {
  if (0 < progress && progress < 1) {
    if (!progressBarStarted) {
      progressBarStarted = true;
      NProgress.start();
    }
    NProgress.set(progress);
  } else {
    progressBarStarted = false;
    NProgress.done();
  }

  return {
    type: UPDATE_PROGRESS,
    payload: {progress},
  };
}
