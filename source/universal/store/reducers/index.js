import { combineReducers } from 'redux';
import tags from './tags';
import repos from './repos';
import user from './user';
import ui from './ui';

export default combineReducers({
  ui,
  user,
  repos,
  tags,
});
