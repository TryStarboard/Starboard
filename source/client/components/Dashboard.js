import React, {Component} from 'react';
import DashboardContent   from './DashboardContent';

export default class Dashboard extends Component<any, any> {
  render() {
    return (
      <div className='dashboard'>
        <DashboardContent/>
      </div>
    );
  }
}
