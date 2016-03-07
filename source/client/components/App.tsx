import * as React from 'react';
import { Component } from 'react';
import observeStore from '../higher-order-components/observeStore';
import { Router } from '../routes';

export default observeStore(() => ({ routes: ['routes'] }))
(class App extends Component<any, void> {
  render() {
    return <Router routes={this.props.routes} />;
  }
});
