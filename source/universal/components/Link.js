import React, { PropTypes } from 'react';

const Link = (props, context) => {
  return (
    <a className={props.className} href={props.to} onClick={() => context.navTo(props.to)}>
      {props.children}
    </a>
  );
};

Link.contextTypes = {
  navTo: PropTypes.func.isRequired,
};

export { Link as default };
