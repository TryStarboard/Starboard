import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import routes from '../universal/routes';
import { logout, openAddTagModal, closeAddTagModal, addTag } from '../universal/actions';
import { createSyncRepos } from '../universal/actionFactory';

export default class App extends Component {

  static childContextTypes = {
    logout: PropTypes.func.isRequired,
    syncRepos: PropTypes.func.isRequired,
    openAddTagModal: PropTypes.func.isRequired,
    closeAddTagModal: PropTypes.func.isRequired,
    addTag: PropTypes.func.isRequired,
  };

  getChildContext() {
    return {
      logout,
      syncRepos: createSyncRepos(this.props.socket, this.props.store),
      openAddTagModal,
      closeAddTagModal,
      addTag,
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
