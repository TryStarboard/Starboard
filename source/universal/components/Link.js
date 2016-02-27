import React, { PropTypes } from 'react';

const Link = (props, context) => {
  const onClick = (event) => {
    event.preventDefault();
    context.navTo(props.to);
  };
  return (
    <a className={props.className} href={props.to} onClick={onClick}>
      {props.children}
    </a>
  );
};

Link.contextTypes = {
  navTo: PropTypes.func.isRequired,
};

export { Link as default };
