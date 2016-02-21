import React, { Component } from 'react';
import Sidebar from './Sidebar';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <Sidebar/>
        {this.props.children}
      </div>
    );
  }
}

export { Dashboard as default };
