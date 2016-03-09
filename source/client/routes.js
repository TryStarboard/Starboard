import React from 'react';
import { r, redirect, start } from 'routility';
import { Switch, Case, Default } from 'react-switch-path';
import Login from './components/Login';
import Inside from './components/Inside';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import store from './store';

const routes = (
  r('/', 'root', [
    redirect('/', '/login'),
    r('/login', 'login'),
    r('/dashboard', 'dashboard'),
    r('/user-profile', 'user_profile'),
  ])
);

export const navTo = start(
  routes,
  (state) => store.dispatch({ type: 'NEW_ROUTE', data: state }),
  { browserHistory: true });

export const Router = (props) => {
  return (
    <Switch object={ props.routes.root }>
      <Case path='login' component={ Login }/>
      <Default component={ Inside }>
        <Case path='dashboard' component={ Dashboard }/>
        <Case path='user_profile' component={ UserProfile }/>
      </Default>
    </Switch>
  );
};
