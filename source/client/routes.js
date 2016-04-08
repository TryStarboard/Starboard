import {r, redirect, start} from 'routility';
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
  (state) => store.dispatch({type: 'NEW_ROUTE', data: state}),
  {browserHistory: true});
