import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fromPairs } from 'ramda';
import routes from '../universal/routes';
import { creators } from '../universal/actions';
import { createSyncRepos } from '../universal/actionFactory';

export default class App extends Component {

  static childContextTypes = {
    ...(fromPairs(Object.keys(creators).map((key) => [key, PropTypes.func.isRequired]))),
    syncRepos: PropTypes.func.isRequired,
  };

  getChildContext() {
    return bindActionCreators(
      {
        ...creators,
        syncRepos: createSyncRepos(this.props.socket, this.props.store)
      },
      this.props.store.dispatch);
  }

  render() {
    return (
      <Provider store={this.props.store}>
        {routes}
      </Provider>
    );
  }
}
