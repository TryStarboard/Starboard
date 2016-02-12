import React from 'react';
import { render } from 'react-dom';
import App from './App';
import createStore from '../universal/store/createStore';
import { connectSocket } from './websocket';

const store = createStore(window.__data__);

connectSocket(store);

render(<App store={store}/>, document.getElementById('app'));
