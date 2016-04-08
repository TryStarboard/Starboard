import {bindActionCreators} from 'redux';
import {toPairs, pipe, filter, fromPairs, merge} from 'ramda';
import store from '../store';
import socket from '../websocket';
import {navTo} from '../routes';
import * as creatorsAndTypes from './creators';
import {createSyncRepos, createLogout, createDeleteAccount} from './factory';

// Filter out actions types, which all start with upper case
//
const creators = pipe(
  toPairs,
  filter(([ name ]) => !/^[A-Z]/.test(name)),
  fromPairs,
  // Merge in actions creator factories
  merge({
    syncRepos: createSyncRepos(socket, store),
    logout: createLogout(navTo),
    deleteAccount: createDeleteAccount(navTo),
  })
)(creatorsAndTypes);

// Work around ES2015 static export
//
module.exports = bindActionCreators(creators, store.dispatch.bind(store));
