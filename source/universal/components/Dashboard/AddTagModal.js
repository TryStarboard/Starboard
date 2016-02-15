import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import classnames from 'classnames';
import { uiSelector } from './mapStateToProps';
import MODAL_STYLES from '../../const/MODAL_STYLES';

const AddTagModal = ({isAddTagModalOpen, addTagModalErrorMsg}, {closeAddTagModal, addTag}) => (
  <Modal
    isOpen={isAddTagModalOpen}
    onRequestClose={closeAddTagModal}
    style={MODAL_STYLES}>
    <form onSubmit={addTag} className='add-tag-modal__form'>
      <div className="row">
        <label
          htmlFor="tag_text"
          className={classnames('add-tag-modal__label', {'add-tag-modal__label--has-error': !!addTagModalErrorMsg})}>
          {addTagModalErrorMsg ? addTagModalErrorMsg.tag_text[0] : 'Tag text'}
        </label>
        <input className="u-full-width" id="tag_text" type="text" name="tag_text" placeholder="Tag text here..."/>
      </div>
      <button className="button-primary" type="submit">Create</button>
    </form>
  </Modal>
);

AddTagModal.contextTypes = {
  closeAddTagModal: PropTypes.func.isRequired,
  addTag: PropTypes.func.isRequired,
};

export default connect(uiSelector, null, null, {pure: true})(AddTagModal);
