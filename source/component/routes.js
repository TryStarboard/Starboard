import React from 'react';
import { Router, Route, Redirect, browserHistory } from 'react-router';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import Container from './Container';
import Login from './Login';
import SignUp from './SignUp';

const reducers = combineReducers({
  user(state = null, action) {
    return state;
  }
});

export const store = createStore(reducers, {
  user: null
});

const App = connect()(Container);

export const routes = (
  <Router history={browserHistory}>
    <Redirect from='/' to='/login'/>
    <Route path='/' component={App}>
      <Route path='login' component={Login}/>
      <Route path='signup' component={SignUp}/>
    </Route>
  </Router>
);

export default (
  <Provider store={store}>
    {routes}
  </Provider>
);
