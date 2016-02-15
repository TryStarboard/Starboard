import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { bindActionCreators } from 'redux';
import routes from '../universal/routes';
import {
  logout,
  getAllRepos,
  openAddTagModal,
  closeAddTagModal,
  addTag,
  applyTagToRepo,
  beginDragTag,
  endDragTag,
  deleteTag,
  removeRepoTag,
  selectTag
} from '../universal/actions';
import { createSyncRepos } from '../universal/actionFactory';

export default class App extends Component {

  static childContextTypes = {
    logout: PropTypes.func.isRequired,
    getAllRepos: PropTypes.func.isRequired,
    syncRepos: PropTypes.func.isRequired,
    openAddTagModal: PropTypes.func.isRequired,
    closeAddTagModal: PropTypes.func.isRequired,
    addTag: PropTypes.func.isRequired,
    applyTagToRepo: PropTypes.func.isRequired,
    beginDragTag: PropTypes.func.isRequired,
    endDragTag: PropTypes.func.isRequired,
    deleteTag: PropTypes.func.isRequired,
    removeRepoTag: PropTypes.func.isRequired,
    selectTag: PropTypes.func.isRequired,
  };

  getChildContext() {
    return bindActionCreators(
      {
        logout,
        getAllRepos,
        syncRepos: createSyncRepos(this.props.socket, this.props.store),
        openAddTagModal,
        closeAddTagModal,
        addTag,
        applyTagToRepo,
        beginDragTag,
        endDragTag,
        deleteTag,
        removeRepoTag,
        selectTag,
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
