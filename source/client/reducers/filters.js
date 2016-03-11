import u from 'updeep';
import { contains, append, without, reject, equals } from 'ramda';
import { SELECT_TAG, DELETE_TAG } from '../actions/creators';

export default function (state = [], { type, payload }) {
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
  default:
    return state;
  }
}
