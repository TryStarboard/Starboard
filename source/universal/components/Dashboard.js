import React, { Component } from 'react';
import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <Sidebar dispatch={this.props.dispatch}></Sidebar>
        <DashboardContent stars={this.props.stars} />
      </div>
    );
  }
}

export default connect(({stars, user}) => ({stars, user}))(Dashboard);
