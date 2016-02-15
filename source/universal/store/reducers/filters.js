import u from 'updeep';
import { contains, not, pipe } from 'ramda';
import { SELECT_TAG } from '../../actions/index';

export default function (state = [], { type, payload }) {
  switch (type) {
  case SELECT_TAG:
    return u(u.if(pipe(contains(payload.id), not), u.constant([payload.id])), state);
  default:
    return state;
  }
}
