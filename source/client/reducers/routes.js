import { NEW_ROUTE } from '../actions';

export default function (state = {}, { type, data }) {
  switch (type) {
  case NEW_ROUTE:
    return data;
  default:
    return state;
  }
}
