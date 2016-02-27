export default function (state = {}, { type, payload }) {
  switch (type) {
  case 'NEW_ROUTE':
    return payload;
  default:
    return state;
  }
}
