import { combineReducers } from 'redux';
import { browserHistory } from 'react-router';
import { LOGOUT } from '../../actions';
import tags from './tags';
import stars from './stars';

function user(state = null, { type, payload }) {
  switch (type) {
  case `${LOGOUT}_FULFILLED`:
    browserHistory.push('/login');
    return null;
  default:
    return state;
  }
}

export default combineReducers({
  user,
  stars,
  tags,
});
