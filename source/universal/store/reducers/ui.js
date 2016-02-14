import assign from 'lodash/fp/assign';
import { ADD_TAG } from '../../actions/index';

const DEFAULT_UI = {
  isAddTagModalOpen: false,
};

export default function (state = DEFAULT_UI, { type }) {
  switch (type) {
  case ADD_TAG:
    return assign(state, {isAddTagModalOpen: true});
  default:
    return state;
  }
}
