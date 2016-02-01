import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout, getStars } from '../actions';
import LogoutIcon from '../../client/img/logout-icon.svg';
import UserIcon from '../../client/img/user-icon.svg';
import DashboardIcon from '../../client/img/dashboard-icon.svg';

const Sidebar = ({dispatch}) => (
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

class Dashboard extends Component {
  render() {
    return (
      <div>
        <Sidebar {...this.props}></Sidebar>
      </div>
    );
  }
}

export default connect(({stars, user}) => ({stars, user}))(Dashboard);
