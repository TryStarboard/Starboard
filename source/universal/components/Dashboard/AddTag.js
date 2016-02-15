import React from 'react';
import PlusIcon from '../../../client/img/add-tag-icon.svg';
import TrashCanIcon from '../../../client/img/trash-can-icon.svg';

const AddTag = ({onClick, ui: {isDraggingTag}}) => {
  return (
    <button className="tag tag--btn" onClick={onClick}>
      {isDraggingTag ? <TrashCanIcon/> : <PlusIcon/>}
    </button>
  );
};

export { AddTag as default };
