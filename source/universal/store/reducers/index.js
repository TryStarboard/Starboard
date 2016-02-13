import { combineReducers } from 'redux';
import tags from './tags';
import stars from './stars';
import user from './user';

export default combineReducers({
  user,
  stars,
  tags,
});
