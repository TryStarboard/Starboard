import React from 'react';
import { render } from 'react-dom';
import io from 'socket.io-client';
import App from './app';

const socket = io();

render(<App/>, document.getElementById('app'));
