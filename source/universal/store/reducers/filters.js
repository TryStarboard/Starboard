import u from 'updeep';
import { contains } from 'ramda';
import { SELECT_TAG } from '../../actions/index';

export default function (state = [], { type, payload }) {
  switch (type) {
  case SELECT_TAG:
    return u(
      u.ifElse(
        contains(payload.id),
        u.constant([]),
        u.constant([payload.id])
      ),
      state);
  default:
    return state;
  }
}
