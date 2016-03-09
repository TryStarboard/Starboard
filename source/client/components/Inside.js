import * as React from 'react';
import { Component } from 'react';
import Sidebar from './Sidebar';

export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <Sidebar />
        { this.props.children }
      </div>
    );
  }
}
