import assign from 'lodash/fp/assign';
import { OPEN_ADD_TAG_MODAL, CLOSE_ADD_TAG_MODAL } from '../../actions/index';

const DEFAULT_UI = {
  isAddTagModalOpen: false,
};

export default function (state = DEFAULT_UI, { type }) {
  switch (type) {
  case OPEN_ADD_TAG_MODAL:
    return assign(state, {isAddTagModalOpen: true});
  case CLOSE_ADD_TAG_MODAL:
    return assign(state, {isAddTagModalOpen: false});
  default:
    return state;
  }
}
