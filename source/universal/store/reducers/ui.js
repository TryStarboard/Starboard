import assign from 'lodash/fp/assign';
import {
  OPEN_ADD_TAG_MODAL,
  CLOSE_ADD_TAG_MODAL,
  ADD_TAG_INVALID_INPUT
} from '../../actions/index';

const DEFAULT_UI = {
  isAddTagModalOpen: false,
  addTagModalErrorMsg: null,
};

export default function (state = DEFAULT_UI, { type, payload }) {
  switch (type) {
  case OPEN_ADD_TAG_MODAL:
    return assign(state, {isAddTagModalOpen: true});
  case CLOSE_ADD_TAG_MODAL:
    return assign(state, {isAddTagModalOpen: false, addTagModalErrorMsg: null});
  case ADD_TAG_INVALID_INPUT:
    return assign(state, {addTagModalErrorMsg: payload});
  default:
    return state;
  }
}
