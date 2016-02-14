import { combineReducers } from 'redux';
import tags from './tags';
import stars from './stars';
import user from './user';
import ui from './ui';

export default combineReducers({
  ui,
  user,
  stars,
  tags,
});
