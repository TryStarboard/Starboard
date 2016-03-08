declare module 'react-switch-path' {

  import React = require('react');

  interface CaseProps {
    path: string;
    component: React.ComponentClass<any>;
    children?: CaseElement[] | CaseElement;
  }

  interface DefaultProps {
    component: React.ComponentClass<any>;
    children?: CaseElement[] | CaseElement;
  }

  interface SwitchProps {
    object: Object;
    children?: CaseElement[] | CaseElement;
  }

  type CaseElement = React.ReactElement<CaseProps | DefaultProps>;

  export const Case: React.ComponentClass<CaseProps>;
  export const Default: React.ComponentClass<DefaultProps>;
  export const Switch: React.ComponentClass<SwitchProps>;
}
