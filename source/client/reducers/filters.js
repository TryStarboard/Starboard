import u from 'updeep';
import { contains, append, without } from 'ramda';
import { SELECT_TAG } from '../actions/creators';

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
  default:
    return state;
  }
}
