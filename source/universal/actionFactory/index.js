export const SYNC_REPOS = 'SYNC_REPOS';

export function createSyncRepos(socket, store) {
  return function syncRepos() {
    socket.emit(SYNC_REPOS, {id: store.getState().user.id});
    return {
      type: SYNC_REPOS,
    };
  };
}
