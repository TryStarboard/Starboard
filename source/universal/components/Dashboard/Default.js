import React, { Component } from 'react';
import DashboardContent from './DashboardContent';
import AddTagModal from './AddTagModal';

class Default extends Component {
  render() {
    return (
      <div className='dashboard'>
        <DashboardContent />
        <AddTagModal />
      </div>
    );
  }
}

export { Default as default };
