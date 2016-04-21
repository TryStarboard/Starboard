import React from 'react';
import {path} from 'ramda';
import classnames from 'classnames';
import LogoutIcon from 'svg/logout-icon.svg';
import UserIcon from 'svg/user-icon.svg';
import DashboardIcon from 'svg/dashboard-icon.svg';
import RefreshIcon from 'svg/refresh-icon.svg';
import EmailIcon from 'svg/email-icon.svg';
import TwitterIcon from 'svg/twitter-icon.svg';
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
        <UserIcon/>
      </Link>
      <Link to='/dashboard' className={
        classnames('nav__btn', {'nav__btn--active': path(['root', 'dashboard'], routes)})
      }>
        <DashboardIcon/>
      </Link>
      <button className='nav__btn' onClick={syncRepos}>
        <RefreshIcon/>
      </button>
    </div>
    <div className='nav__bottom'>
      <a className='nav__btn' href='http://twitter.com/home/?status=www.getstarboard.xyz is an awesome free webapp to manage Github starred repos. And it is open sourced on Github!' target='_blank'><TwitterIcon/></a>
      <a className='nav__btn' href='https://github.com/TryStarboard/Starboard/issues/new?title=I%20have%20some%20feedback%20for%20Starboard' target='_blank'><EmailIcon/></a>
      <button className='nav__btn' onClick={logout}><LogoutIcon /></button>
    </div>
  </nav>
);

export default createObserveComponent(Sidebar);
