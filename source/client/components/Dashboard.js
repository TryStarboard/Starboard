import React, { Component } from 'react';
import DashboardContent from './DashboardContent';
import AddTagModal from './AddTagModal';

export default class Dashboard extends Component<any, any> {
  render() {
    return (
      <div className='dashboard'>
        <DashboardContent />
        <AddTagModal />
      </div>
    );
  }
}
