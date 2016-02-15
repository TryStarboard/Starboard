import React from 'react';
import { render } from 'react-dom';
import App from './App';
import createStore from '../universal/store/createStore';
import { connectSocket, getClient } from './websocket';
import { getAllRepos } from '../universal/actions';

const store = createStore(window.__data__);

connectSocket(store);

render(<App store={store} socket={getClient()}/>, document.getElementById('app'));

// Initial server rendering only return 100 repos
// this will fetch the rest
store.dispatch(getAllRepos());
