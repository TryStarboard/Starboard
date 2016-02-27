import React, { PropTypes } from 'react';
import Link from '../Link';
import LogoutIcon from '../../../client/img/logout-icon.svg';
import UserIcon from '../../../client/img/user-icon.svg';
import DashboardIcon from '../../../client/img/dashboard-icon.svg';
import RefreshIcon from '../../../client/img/refresh-icon.svg';

const Sidebar = (props, {logout, syncRepos}) => (
  <nav className='nav'>
    <div className="nav__top">
      <Link to="/userprofile" className='nav__btn'><UserIcon/></Link>
      <Link to="/dashboard" className='nav__btn'><DashboardIcon/></Link>
      <button className='nav__btn' onClick={syncRepos}><RefreshIcon/></button>
    </div>
    <div className="nav__bottom">
      <button className='nav__btn' onClick={logout}><LogoutIcon/></button>
    </div>
  </nav>
);

Sidebar.contextTypes = {
  logout: PropTypes.func.isRequired,
  syncRepos: PropTypes.func.isRequired,
};

export { Sidebar as default };
