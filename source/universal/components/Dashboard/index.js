import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import pick from 'lodash/fp/pick';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';

class Dashboard extends Component {

  static contextTypes = {
    logout: PropTypes.func.isRequired,
    syncRepos: PropTypes.func.isRequired,
    addTag: PropTypes.func.isRequired,
  };

  render() {
    const {logout, syncRepos, addTag} = bindActionCreators(this.context, this.props.dispatch);

    return (
      <div>
        <Sidebar {...{logout, syncRepos}}></Sidebar>
        <DashboardContent {...{addTag}} stars={this.props.stars} tags={this.props.tags} />
        <Modal
          isOpen={this.props.ui.isAddTagModalOpen}
          onRequestClose={this.closeModal}>

          hello
        </Modal>
      </div>
    );
  }
}

export default connect(pick(['ui', 'stars', 'tags']))(Dashboard);
