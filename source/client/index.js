import React from 'react';
import { render } from 'react-dom';
import { start } from 'routility';
import App from './App';
import { connectSocket, getClient } from './websocket';
import createStore from '../universal/store/createStore';
import { routes } from '../universal/routes';

const store = createStore(window.__data__);

start(
  routes,
  (state) => store.dispatch({ type: 'NEW_ROUTE', payload: state }),
  { browserHistory: true });

connectSocket(store);

render(<App store={store} socket={getClient()}/>, document.getElementById('app'));
