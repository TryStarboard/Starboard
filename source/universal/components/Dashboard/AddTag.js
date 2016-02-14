import React from 'react';
import PlusIcon from '../../../client/img/add-tag-icon.svg';

const AddTag = ({onClick}) => {
  return (
    <button className="tag tag--btn" onClick={onClick}>
      <PlusIcon/>
    </button>
  );
};

export { AddTag as default };
