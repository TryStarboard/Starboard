import React, { PropTypes, Component } from 'react';
import { Provider } from 'react-redux';
import { fromPairs } from 'ramda';
import { noop } from 'lodash/fp';
import createStore from '../../../universal/store/createStore';
import { ConnectedRouter } from '../../../universal/routes';
import { creators } from '../../../universal/actions';

const actionCreatorContextMap = {
  ...(fromPairs(Object.keys(creators).map((key) => [key, PropTypes.func.isRequired]))),
  syncRepos: PropTypes.func.isRequired,
};

class App extends Component {
  static childContextTypes = actionCreatorContextMap;
  getChildContext() {
    return fromPairs(Object.keys(actionCreatorContextMap).map((key) => [key, noop]));
  }
  render() {
    return (
      <Provider store={this.props.store}>
        <ConnectedRouter/>
      </Provider>
    );
  }
}

export default function (state) {
  return <App store={createStore(state)}/>;
}
