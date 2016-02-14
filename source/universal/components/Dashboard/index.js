import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import pick from 'lodash/fp/pick';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';
import AddTagModal from './AddTagModal';

class Dashboard extends Component {

  static contextTypes = {
    logout: PropTypes.func.isRequired,
    syncRepos: PropTypes.func.isRequired,
    openAddTagModal: PropTypes.func.isRequired,
    closeAddTagModal: PropTypes.func.isRequired,
    addTag: PropTypes.func.isRequired,
  };

  render() {
    const {logout, syncRepos, openAddTagModal, closeAddTagModal, addTag} =
      bindActionCreators(this.context, this.props.dispatch);

    return (
      <div>
        <Sidebar {...{logout, syncRepos}}></Sidebar>
        <DashboardContent
          {...{openAddTagModal}}
          stars={this.props.stars}
          tags={this.props.tags}/>
        <AddTagModal ui={this.props.ui} closeAddTagModal={closeAddTagModal} addTag={addTag}/>
      </div>
    );
  }
}

export default connect(pick(['ui', 'stars', 'tags']))(Dashboard);
