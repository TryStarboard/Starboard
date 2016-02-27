import React from 'react';
import { r, redirect } from 'routility';
import { Switch, Case, Default } from 'react-switch-path';
import { connect } from 'react-redux';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { default as DefaultComp } from './components/Dashboard/Default';
import UserProfile from './components/Dashboard/UserProfile';

// export default (
//   <Router history={browserHistory}>
//     <Redirect from='/' to='/login'/>
//     <Route path='/login' component={Login}/>
//     <Route path='/dashboard' component={Dashboard}>
//       <IndexRoute component={Default} />
//       <Route path="/userprofile" component={UserProfile} />
//     </Route>
//   </Router>
// );

export const routes = (
  r('/', 'root', [
    redirect('/', '/login'),
    r('/login', 'login'),
    r('/dashboard', 'dashboard'),
    r('/user-profile', 'user_profile'),
  ])
);

const Router = (props) => {
  return (
    <Switch object={props.root}>
      <Case path='login' component={Login}/>
      <Default component={Dashboard}>
        <Case path='dashboard' component={DefaultComp}/>
        <Case path='user_profile' component={UserProfile}/>
      </Default>
    </Switch>
  );
};

export const ConnectedRouter = connect((state) => state.routes)(Router);
