import * as React from 'react'
import { StatelessComponent } from 'react';
import Link from './Link.tsx';
import LogoutIcon from 'svg/logout-icon.svg';
import UserIcon from 'svg/user-icon.svg';
import DashboardIcon from 'svg/dashboard-icon.svg';
import RefreshIcon from 'svg/refresh-icon.svg';

const Sidebar: StatelessComponent<{}> = () => (
  <nav className='nav'>
    <div className="nav__top">
      <Link to="/user-profile" className='nav__btn'><UserIcon/></Link>
      <Link to="/dashboard" className='nav__btn'><DashboardIcon/></Link>
      <button className='nav__btn' onClick={() => null}><RefreshIcon/></button>
    </div>
    <div className="nav__bottom">
      <button className='nav__btn' onClick={() => null}><LogoutIcon/></button>
    </div>
  </nav>
);

export { Sidebar as default };
