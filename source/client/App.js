import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fromPairs } from 'ramda';
import { ConnectedRouter } from '../universal/routes';
import { creators } from '../universal/actions';
import {
  createSyncRepos,
  createLogout,
  createDeleteAccount
} from '../universal/actionFactory';

export default class App extends Component {

  static childContextTypes = {
    ...(fromPairs(Object.keys(creators).map((key) => [key, PropTypes.func.isRequired]))),
    syncRepos: PropTypes.func.isRequired,
    navTo: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
  };

  getChildContext() {
    const actionCreators = bindActionCreators(
      {
        ...creators,
        syncRepos: createSyncRepos(this.props.socket, this.props.store),
        logout: createLogout(this.props.navTo),
        deleteAccount: createDeleteAccount(this.props.navTo),
      },
      this.props.store.dispatch);
    return { navTo: this.props.navTo, ...actionCreators };
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <ConnectedRouter/>
      </Provider>
    );
  }
}
