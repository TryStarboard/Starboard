import { UPDATE_TAGS } from '../../actions/serverActions';
import { ADD_TAG } from '../../actions';

export default function (state = [], { type, payload }) {
  switch (type) {
  case `${ADD_TAG}_FULFILLED`:
    return [payload.data].concat(state);
  case UPDATE_TAGS:
    return payload;
  default:
    return state;
  }
}
