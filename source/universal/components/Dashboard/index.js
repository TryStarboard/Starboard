import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import pick from 'lodash/fp/pick';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';
import MODAL_STYLES from '../../const/MODAL_STYLES';

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
        <Modal
          isOpen={this.props.ui.isAddTagModalOpen}
          onRequestClose={closeAddTagModal}
          style={MODAL_STYLES}>
          <form onSubmit={addTag} className='add-tag-modal__form'>
            <input className="u-full-width" type="text" name="tag_text" placeholder="Tag text here..." required/>
            <button className="button-primary" type="submit">Create</button>
          </form>
        </Modal>
      </div>
    );
  }
}

export default connect(pick(['ui', 'stars', 'tags']))(Dashboard);
