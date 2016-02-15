import reject from 'lodash/reject';
import { UPDATE_TAGS } from '../../actions/serverActions';
import { ADD_TAG, DELETE_TAG } from '../../actions';

export default function (state = [], { type, payload }) {
  switch (type) {
  case `${ADD_TAG}_FULFILLED`:
    return [payload.data].concat(state);
  case UPDATE_TAGS:
    return payload;
  case `${DELETE_TAG}_PENDING`:
    return reject(state, ['id', payload.id]);
  default:
    return state;
  }
}
