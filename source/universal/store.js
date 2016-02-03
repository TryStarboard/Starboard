import { combineReducers, createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';
import { browserHistory } from 'react-router';
import defaults from 'lodash/fp/defaults';
import {
  LOGOUT,
  SYNC_REPOS
} from './actions';

const DEFAULT_TAG_COLORS = {
  apacheconf: {bg: '#CCCCCC', fg: 'black'},
  c: {bg: '#555555', fg: 'white'},
  clojure: {bg: '#DB5855', fg: 'white'},
  coffeescript: {bg: '#244776', fg: 'white'},
  css: {bg: '#563D7C', fg: 'white'},
  'emacs lisp': {bg: '#CCCCCC', fg: 'black'},
  go: {bg: '#375EAB', fg: 'white'},
  html: {bg: '#E44B23', fg: 'white'},
  java: {bg: '#B07219', fg: 'white'},
  javascript: {bg: '#F1E05A', fg: 'black'},
  livescript: {bg: '#499886', fg: 'white'},
  'objective-c': {bg: '#438EFF', fg: 'white'},
  'objective-j': {bg: '#FF0C5A', fg: 'white'},
  python: {bg: '#3572A5', fg: 'white'},
  ruby: {bg: '#701516', fg: 'white'},
  shell: {bg: '#89E051', fg: 'white'},
  swift: {bg: '#FFAC45', fg: 'white'},
  typescript: {bg: '#2B7489', fg: 'white'},
};

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware(),
  createLogger({logger: console})
)(createStore);

const reducers = combineReducers({
  user(state = null, { type, payload }) {
    switch (type) {
    case `${LOGOUT}_FULFILLED`:
      browserHistory.push('/login');
      return null;
    default:
      return state;
    }
  },
  stars(state = [], { type, payload }) {
    switch (type) {
    default:
      return state;
    }
  },
  tags(state = [], { type, payload }) {
    switch (type) {
    default:
      return state.map((tag) => {
        const colors = DEFAULT_TAG_COLORS[tag.text.toLowerCase()];
        if (!colors) {
          return tag;
        }
        return defaults(tag, {
          background_color: colors.bg,
          foreground_color: colors.fg,
        });
      });
    }
  },
});

export default function (state) {
  return createStoreWithMiddleware(reducers, state);
}
