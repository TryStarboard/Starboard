import { createStore, IReducer } from 'redux';

interface CounterState {
  counter: number
}

const reducer: IReducer<CounterState> = function (state: CounterState = { counter: 0 }, action) {
  switch (action.type) {
  case 'INCREMENT':
    return { counter: state.counter + 1 };
  default:
    return state;
  }
};

export default createStore(reducer);
