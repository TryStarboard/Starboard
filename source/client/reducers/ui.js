import { merge } from 'ramda';
import {
  OPEN_ADD_TAG_MODAL,
  CLOSE_ADD_TAG_MODAL,
  ADD_TAG_INVALID_INPUT,
  BEGIN_DRAG_TAG,
  END_DRAG_TAG
} from '../actions/creators';
import {
  UPDATE_PROGRESS
} from '../../shared/action-types';

const DEFAULT_UI = {
  isAddTagModalOpen: false,
  addTagModalErrorMsg: null,
  isDraggingTag: false,
  syncProgress: 1,
};

export default function (state = DEFAULT_UI, { type, payload }) {
  switch (type) {
  case OPEN_ADD_TAG_MODAL:
    return merge(state, {isAddTagModalOpen: true});
  case CLOSE_ADD_TAG_MODAL:
    return merge(state, {isAddTagModalOpen: false, addTagModalErrorMsg: null});
  case ADD_TAG_INVALID_INPUT:
    return merge(state, {addTagModalErrorMsg: payload});
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
