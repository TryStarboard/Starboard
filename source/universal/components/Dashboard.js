import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from '../actions';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <div>Dashboard</div>
        <button onClick={this._logout.bind(this)}>logout</button>
      </div>
    );
  }

  _logout() {
    this.props.dispatch(logout());
  }
}

export default connect((s) => s)(Dashboard);
