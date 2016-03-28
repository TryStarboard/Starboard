import {merge, path}     from 'ramda';
import {UPDATE_PROGRESS} from '../../shared/action-types';
import {
  CHNAGE_ADD_TAG_INPUT,
  ADD_TAG_INVALID_INPUT,
  ADD_TAG_RESET_MESSAGE,
  ADD_TAG,
  BEGIN_DRAG_TAG,
  END_DRAG_TAG
} from '../actions/creators';

const INITIAL_UI = {
  addTagErrorMsg: null,
  isDraggingTag: false,
  syncProgress: 1,
  tagInputValue: '',
};

export default function (state = INITIAL_UI, {type, payload}) {
  switch (type) {
  case CHNAGE_ADD_TAG_INPUT:
    return merge(state, {tagInputValue: payload});
  case ADD_TAG_INVALID_INPUT:
    return merge(state, {addTagErrorMsg: payload});
  case ADD_TAG_RESET_MESSAGE:
    return merge(state, {addTagErrorMsg: null});
  case `${ADD_TAG}_FULFILLED`:
    return merge(state, {tagInputValue: ''});
  case `${ADD_TAG}_REJECTED`:
    return merge(state, {addTagErrorMsg: path(['data', 'error'], payload)});
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
