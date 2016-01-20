import React, { Component } from 'react';
import { connect } from 'react-redux';

class Dashboard extends Component {
  render() {
    return (
      <div className="">Dashboard</div>
    );
  }
}

export default connect((s) => s)(Dashboard);
