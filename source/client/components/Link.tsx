import * as React from 'react';
import { StatelessComponent } from 'react';
import { navTo } from '../store.ts';

const Link: StatelessComponent<{className: string, to: string, children?: any}> = (props) => {
  const onClick = (event: Event) => {
    event.preventDefault();
    navTo(props.to);
  };

  return (
    <a className={props.className} href={props.to} onClick={onClick}>
      {props.children}
    </a>
  );
};

export { Link as default };
