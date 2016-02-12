import React from 'react';
import LogoutIcon from '../../../client/img/logout-icon.svg';
import UserIcon from '../../../client/img/user-icon.svg';
import DashboardIcon from '../../../client/img/dashboard-icon.svg';
import RefreshIcon from '../../../client/img/refresh-icon.svg';

export default ({logout, syncRepos}) => (
  <nav className='nav'>
    <div className="nav__top">
      <button className='nav__btn'><UserIcon/></button>
      <button className='nav__btn'><DashboardIcon/></button>
      <button className='nav__btn' onClick={syncRepos}><RefreshIcon/></button>
    </div>
    <div className="nav__bottom">
      <button className='nav__btn' onClick={logout}><LogoutIcon/></button>
    </div>
  </nav>
);
