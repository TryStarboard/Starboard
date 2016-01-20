import React from 'react';
import { Router, Route, Redirect, browserHistory } from 'react-router';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';

export default (
  <Router history={browserHistory}>
    <Redirect from='/' to='/login'/>
    <Route path='/login' component={Login}/>
    <Route path='/signup' component={SignUp}/>
    <Route path='/dashboard' component={Dashboard}/>
  </Router>
);
