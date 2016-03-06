import * as React from 'react';
import { Component } from 'react';
import observeStore from '../higher-order-components/observeStore';

export default observeStore(() => ({ counter: ['counter'] }))
(class App extends Component<any, void> {
  render() {
    return <div>Hello {this.props.counter}</div>;
  }
});
