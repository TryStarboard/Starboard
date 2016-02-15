import React, { Component } from 'react';
import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';
import AddTagModal from './AddTagModal';
import mapStateToProps from './mapStateToProps';

class Dashboard extends Component {

  render() {
    return (
      <div>
        <Sidebar/>
        <DashboardContent
          ui={this.props.ui}
          stars={this.props.stars}
          tags={this.props.tags}/>
        <AddTagModal
          ui={this.props.ui}/>
      </div>
    );
  }
}

export default connect(mapStateToProps, null, null, {pure: true})(Dashboard);
