import React, {Component} from 'react';
import DashboardContent   from './DashboardContent';

export default class Dashboard extends Component {
  render() {
    return (
      <div className='dashboard'>
        <DashboardContent/>
      </div>
    );
  }
}
