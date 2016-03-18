import axios from 'axios';
import { tap } from 'ramda';
import mixpanel from '../mixpanel';
import {
  SYNC_REPOS,
  LOGOUT,
  DELETE_ACCOUNT
} from '../../shared/action-types';

export function createSyncRepos(socket, store) {
  return function syncRepos() {
    mixpanel.track(SYNC_REPOS);
    socket.emit(SYNC_REPOS, {id: store.getState().user.id});
    return {
      type: SYNC_REPOS,
    };
  };
}

export function createLogout(navTo) {
  return function logout() {
    return {
      type: LOGOUT,
      payload: {
        promise: axios.get('/api/v1/logout').then(tap(() => navTo('/login'))),
      }
    };
  };
}

export function createDeleteAccount(navTo) {
  return function deleteAccount() {
    return {
      type: DELETE_ACCOUNT,
      payload: {
        promise: axios.delete('/api/v1/account').then(tap(() => navTo('/login'))),
      }
    };
  };
}
