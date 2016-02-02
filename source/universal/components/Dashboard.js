import React, { Component } from 'react';
import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <Sidebar dispatch={this.props.dispatch}></Sidebar>
        <DashboardContent stars={this.props.stars} tags={this.props.tags} />
      </div>
    );
  }
}

export default connect(({user, stars, tags}) => ({user, stars, tags}))(Dashboard);
