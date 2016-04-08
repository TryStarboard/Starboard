import u from 'updeep';
import {contains, append, without, reject, equals} from 'ramda';
import {SELECT_TAG, DELETE_TAG, REMOVE_FILTER} from '../actions/creators';

export default function (state = [], {type, payload}) {
  switch (type) {
  case SELECT_TAG:
    return u(
      u.ifElse(
        contains(payload.tagId),
        without([payload.tagId]),
        append(payload.tagId)
      ),
      state
    );
  case `${DELETE_TAG}_PENDING`:
    return reject(equals(payload.tagId), state);
  case REMOVE_FILTER:
    return without([payload.tagId], state);
  default:
    return state;
  }
}
