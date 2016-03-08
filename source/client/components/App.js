import React, { Component } from 'react';
import observeStore from '../higher-order-components/observeStore';
import { Router } from '../routes';

const connect = observeStore(() => ({ routes: ['routes'] }));

export default connect(
  class App extends Component {
    render() {
      return <Router routes={this.props.routes} />;
    }
  }
);
