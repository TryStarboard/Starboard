import React from 'react';
import {path} from 'ramda';
import classnames from 'classnames';
import LogoutIcon from 'svg/logout-icon.svg';
import UserIcon from 'svg/user-icon.svg';
import DashboardIcon from 'svg/dashboard-icon.svg';
import RefreshIcon from 'svg/refresh-icon.svg';
import observeStore from '../higher-order-components/observeStore';
import {logout, syncRepos} from '../actions';
import Link from './Link';

const createObserveComponent = observeStore(
  () => ({routes: ['routes']})
);

const Sidebar = ({routes}) => (
  <nav className='nav'>
    <div className='nav__top'>
      <Link to='/user-profile' className={
        classnames('nav__btn', {'nav__btn--active': path(['root', 'user_profile'], routes)})
      }>
        <UserIcon />
      </Link>
      <Link to='/dashboard' className={
        classnames('nav__btn', {'nav__btn--active': path(['root', 'dashboard'], routes)})
      }>
        <DashboardIcon />
      </Link>
      <button className='nav__btn' onClick={ syncRepos }>
        <RefreshIcon />
      </button>
    </div>
    <div className='nav__bottom'>
      <button className='nav__btn' onClick={ logout }><LogoutIcon /></button>
    </div>
  </nav>
);

export default createObserveComponent(Sidebar);
