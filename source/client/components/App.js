import * as React from 'react';
import { Component } from 'react';
import observeStore from '../higher-order-components/observeStore.tsx';
import { Router } from '../routes.tsx';

const connect = observeStore(() => ({ routes: ['routes'] }));

export default connect(class App extends Component<any, void> {
  render() {
    return <Router routes={this.props.routes} />;
  }
});
