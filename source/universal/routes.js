import React from 'react';
import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserProfile from './components/Dashboard/UserProfile';
import Default from './components/Dashboard/Default'

export default (
  <Router history={browserHistory}>
    <Redirect from='/' to='/login'/>
    <Route path='/login' component={Login}/>
    <Route path='/dashboard' component={Dashboard}>
      <IndexRoute component={Default} />
      <Route path="/userprofile" component={UserProfile} />
    </Route>
  </Router>
);
