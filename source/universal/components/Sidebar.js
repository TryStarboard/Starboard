import React from 'react';
import { logout, getStars } from '../actions';
import LogoutIcon from '../../client/img/logout-icon.svg';
import UserIcon from '../../client/img/user-icon.svg';
import DashboardIcon from '../../client/img/dashboard-icon.svg';

export default ({dispatch}) => (
  <nav className='nav'>
    <div className="nav__top">
      <button className='nav__btn'><UserIcon/></button>
      <button className='nav__btn' onClick={() => dispatch(getStars())}><DashboardIcon/></button>
    </div>
    <div className="nav__bottom">
      <button className='nav__btn' onClick={() => dispatch(logout())}><LogoutIcon/></button>
    </div>
  </nav>
);
