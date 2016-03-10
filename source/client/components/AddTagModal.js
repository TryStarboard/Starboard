import React, { PropTypes } from 'react';
import Modal from 'react-modal';
import classnames from 'classnames';
import observeStore from '../higher-order-components/observeStore';
import MODAL_STYLES from '../const/MODAL_STYLES';
import { closeAddTagModal, addTag } from '../actions';

const connect = observeStore(
  () => ({
    isAddTagModalOpen: ['ui', 'isAddTagModalOpen'],
    addTagModalErrorMsg: ['ui', 'addTagModalErrorMsg'],
  })
);

export default connect(({ isAddTagModalOpen, addTagModalErrorMsg }) => {

  const labelClassname = classnames(
    'add-tag-modal__label',
    { 'add-tag-modal__label--has-error': !!addTagModalErrorMsg }
  );

  return (
    <Modal
      isOpen={ isAddTagModalOpen }
      onRequestClose={ closeAddTagModal }
      style={ MODAL_STYLES }>
      <form onSubmit={ addTag } className='add-tag-modal__form'>
        <div className='row'>
          <label
            htmlFor='tag_text'
            className={ labelClassname }>
            { addTagModalErrorMsg ? addTagModalErrorMsg.tag_text[0] : 'Tag text' }
          </label>
          <input
            id='tag_text'
            className='u-full-width'
            type='text'
            name='tag_text'
            placeholder='Tag text here...'/>
        </div>
        <button className='button-primary' type='submit'>Create</button>
      </form>
    </Modal>
  );
});
