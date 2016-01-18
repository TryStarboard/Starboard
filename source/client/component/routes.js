import React from 'react';
import { Router, Route, Redirect, browserHistory } from 'react-router';
import App from './App';
import Login from './Login';
import SignUp from './SignUp';

export default (
  <Router history={browserHistory}>
    <Redirect from='/' to='/login'/>
    <Route path='/' component={App}>
      <Route path='login' component={Login}/>
      <Route path='signup' component={SignUp}/>
    </Route>
  </Router>
);
