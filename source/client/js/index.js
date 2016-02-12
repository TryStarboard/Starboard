import React from 'react';
import { render } from 'react-dom';
import io from 'socket.io-client';
import App from './app';
import {
  UPDATE_SOME_REPOS,
  REMOVE_REPOS,
  updateSomeRepos,
  removeRepos
} from '../../universal/actions/serverActions';

const socket = io();

socket.on(UPDATE_SOME_REPOS, function (repos) {
  updateSomeRepos(repos);
});

socket.on(REMOVE_REPOS, function (data) {
  console.log(JSON.stringify(data, null, 4));
});

render(<App/>, document.getElementById('app'));
