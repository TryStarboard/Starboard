import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';
import AddTagModal from './AddTagModal';
import mapStateToProps from './mapStateToProps';

class Dashboard extends Component {

  static contextTypes = {
    logout: PropTypes.func.isRequired,
    syncRepos: PropTypes.func.isRequired,
    openAddTagModal: PropTypes.func.isRequired,
    closeAddTagModal: PropTypes.func.isRequired,
    addTag: PropTypes.func.isRequired,
    applyTagToRepo: PropTypes.func.isRequired,
    beginDragTag: PropTypes.func.isRequired,
    endDragTag: PropTypes.func.isRequired,
    deleteTag: PropTypes.func.isRequired,
  };

  render() {
    const {
      logout,
      syncRepos,
      openAddTagModal,
      closeAddTagModal,
      addTag,
      applyTagToRepo,
      beginDragTag,
      endDragTag,
      deleteTag,
    } = bindActionCreators(this.context, this.props.dispatch);

    return (
      <div>
        <Sidebar {...{logout, syncRepos}}></Sidebar>
        <DashboardContent
          {...{openAddTagModal, applyTagToRepo, beginDragTag, endDragTag, deleteTag}}
          ui={this.props.ui}
          stars={this.props.stars}
          tags={this.props.tags}/>
        <AddTagModal
          ui={this.props.ui}
          closeAddTagModal={closeAddTagModal}
          addTag={addTag}/>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Dashboard);
