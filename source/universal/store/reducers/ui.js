import assign from 'lodash/fp/assign';
import u from 'updeep';
import { contains, not, pipe } from 'ramda';
import {
  OPEN_ADD_TAG_MODAL,
  CLOSE_ADD_TAG_MODAL,
  ADD_TAG_INVALID_INPUT,
  BEGIN_DRAG_TAG,
  END_DRAG_TAG,
  SELECT_TAG
} from '../../actions/index';

const DEFAULT_UI = {
  isAddTagModalOpen: false,
  addTagModalErrorMsg: null,
  isDraggingTag: false,
  selectedTags: [],
};

export default function (state = DEFAULT_UI, { type, payload }) {
  switch (type) {
  case OPEN_ADD_TAG_MODAL:
    return assign(state, {isAddTagModalOpen: true});
  case CLOSE_ADD_TAG_MODAL:
    return assign(state, {isAddTagModalOpen: false, addTagModalErrorMsg: null});
  case ADD_TAG_INVALID_INPUT:
    return assign(state, {addTagModalErrorMsg: payload});
  case BEGIN_DRAG_TAG:
    return assign(state, {isDraggingTag: true});
  case END_DRAG_TAG:
    return assign(state, {isDraggingTag: false});
  case SELECT_TAG:
    return u({
      selectedTags: u.if(pipe(contains(payload.id), not), u.constant([payload.id]))
    }, state);
  default:
    return state;
  }
}
