export const UPDATE_SOME_REPOS = 'UPDATE_SOME_REPOS';
export const REMOVE_REPOS = 'REMOVE_REPOS';
export const UPDATE_TAGS = 'UPDATE_TAGS';
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS';

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

export function updateProgress(progress) {
  return {
    type: UPDATE_PROGRESS,
    payload: {progress},
  };
}
