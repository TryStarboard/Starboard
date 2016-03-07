import * as React from 'react';
import { Component } from 'react';
import DashboardContent from './DashboardContent';
// import AddTagModal from './AddTagModal';

export default class Default extends Component<any, any> {
        // <AddTagModal />
  render() {
    return (
      <div className='dashboard'>
        <DashboardContent />
      </div>
    );
  }
}
