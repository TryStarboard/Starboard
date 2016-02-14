import React from 'react';
import PlusIcon from '../../../client/img/add-tag-icon.svg';

const AddTag = ({onClick}) => {
  return (
    <div className="tag" onClick={onClick}>
      <div className="tag__btn"><PlusIcon/></div>
    </div>
  );
};

export { AddTag as default };
