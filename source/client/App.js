import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import routes from '../universal/routes';
import { logout, syncRepos } from '../universal/actions';

export default class App extends Component {

  static childContextTypes = {
    logout: PropTypes.func.isRequired,
    syncRepos: PropTypes.func.isRequired,
  };

  getChildContext() {
    return {
      logout,
      syncRepos
    };
  }

  render() {
    return (
      <Provider store={this.props.store}>
        {routes}
      </Provider>
    );
  }
}
