import React from 'react';
import {navTo} from '../routes';

const Link = (props) => {
  const onClick = (event) => {
    event.preventDefault();
    navTo(props.to);
  };

  return (
    <a className={ props.className } href={ props.to } onClick={ onClick }>
      { props.children }
    </a>
  );
};

export {Link as default};
