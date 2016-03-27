import {merge}           from 'ramda';
import {UPDATE_PROGRESS} from '../../shared/action-types';
import {
  ADD_TAG_INVALID_INPUT,
  ADD_TAG_RESET_MESSAGE,
  BEGIN_DRAG_TAG,
  END_DRAG_TAG
} from '../actions/creators';

const INITIAL_UI = {
  addTagErrorMsg: null,
  isDraggingTag: false,
  syncProgress: 1,
};

export default function (state = INITIAL_UI, {type, payload}) {
  switch (type) {
  case ADD_TAG_INVALID_INPUT:
    return merge(state, {addTagErrorMsg: payload});
  case BEGIN_DRAG_TAG:
    return merge(state, {isDraggingTag: true});
  case END_DRAG_TAG:
    return merge(state, {isDraggingTag: false});
  case UPDATE_PROGRESS:
    return merge(state, {syncProgress: payload.progress});
  default:
    return state;
  }
}
