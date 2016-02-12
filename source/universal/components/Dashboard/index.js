import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';

class Dashboard extends Component {

  static contextTypes = {
    logout: PropTypes.func.isRequired,
    syncRepos: PropTypes.func.isRequired,
  };

  render() {
    const {logout, syncRepos} = bindActionCreators(this.context, this.props.dispatch);

    return (
      <div>
        <Sidebar {...{logout, syncRepos}}></Sidebar>
        <DashboardContent stars={this.props.stars} tags={this.props.tags} />
      </div>
    );
  }
}

export default connect(({user, stars, tags}) => ({user, stars, tags}))(Dashboard);
