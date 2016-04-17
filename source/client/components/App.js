import React, {Component} from 'react';
import {Switch, Case, Default} from 'react-switch-path';
import observeStore from '../higher-order-components/observeStore';
import Inside from './Inside';
import Dashboard from './Dashboard';
import UserProfile from './UserProfile';

const createObserveComponent = observeStore(
  () => ({routes: ['routes']})
);

export default createObserveComponent(
  class App extends Component {
    render() {
      return (
        <Switch object={ this.props.routes.root }>
          <Default component={ Inside }>
            <Case path='dashboard' component={ Dashboard }/>
            <Case path='user_profile' component={ UserProfile }/>
          </Default>
        </Switch>
      );
    }
  }
);
