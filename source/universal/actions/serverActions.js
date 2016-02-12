export const UPDATE_SOME_REPOS = 'UPDATE_SOME_REPOS';
export const REMOVE_REPOS = 'REMOVE_REPOS';

export function updateSomeRepos(repos) {
  return {
    type: UPDATE_SOME_REPOS,
    data: repos,
  };
}

export function removeRepos(repos) {
  return {
    type: REMOVE_REPOS,
    data: repos,
  };
}
