import * as React from 'react';
import { Component } from 'react';
import Sidebar from './Sidebar';

export default class Dashboard extends Component<any, void> {
  render() {
    return (
      <div>
        <Sidebar />
        {this.props.children}
      </div>
    );
  }
}