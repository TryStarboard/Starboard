import {indexBy, prop, assoc, omit} from 'ramda';
import {UPDATE_TAGS} from '../../shared/action-types';
import {ADD_TAG, DELETE_TAG, GET_ALL_TAGS} from '../actions/creators';

export default function (state = {}, {type, payload}) {
  switch (type) {
  case `${GET_ALL_TAGS}_FULFILLED`:
    return indexBy(prop('id'), payload.data);
  case `${ADD_TAG}_FULFILLED`:
    const newTag = payload.data;
    return assoc(newTag.id, newTag, state);
  case UPDATE_TAGS:
    return indexBy(prop('id'), payload);
  case `${DELETE_TAG}_PENDING`:
    return omit([ payload.tagId.toString() ], state);
  default:
    return state;
  }
}
