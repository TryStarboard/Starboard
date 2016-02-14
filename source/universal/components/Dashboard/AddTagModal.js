import React from 'react';
import Modal from 'react-modal';
import MODAL_STYLES from '../../const/MODAL_STYLES';

const AddTagModal = ({ui: {isAddTagModalOpen}, closeAddTagModal, addTag}) => (
  <Modal
    isOpen={isAddTagModalOpen}
    onRequestClose={closeAddTagModal}
    style={MODAL_STYLES}>
    <form onSubmit={addTag} className='add-tag-modal__form'>
      <input className="u-full-width" type="text" name="tag_text" placeholder="Tag text here..." required/>
      <button className="button-primary" type="submit">Create</button>
    </form>
  </Modal>
);

export { AddTagModal as default };
