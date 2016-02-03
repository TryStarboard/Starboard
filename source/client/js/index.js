import { render } from 'react-dom';
import io from 'socket.io-client';
import app from './app';

const socket = io();

render(app, document.getElementById('app'));
