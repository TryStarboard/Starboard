import * as React from 'react';
import { StatelessComponent } from 'react';
import { r, redirect } from 'routility';
import { Switch, Case, Default } from 'react-switch-path';
import Login from './components/Login';
import Inside from './components/Inside';
// import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';

export const routes = (
  r('/', 'root', [
    redirect('/', '/login'),
    r('/login', 'login'),
    r('/dashboard', 'dashboard'),
    r('/user-profile', 'user_profile'),
  ])
);

interface RouterProps {
  routes: any
}

export const Router: StatelessComponent<RouterProps> = (props) => {
        // <Case path='dashboard' component={Dashboard}/>
  return (
    <Switch object={props.routes.root}>
      <Case path='login' component={Login}/>
      <Default component={Inside}>
        <Case path='user_profile' component={UserProfile}/>
      </Default>
    </Switch>
  );
};
