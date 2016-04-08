import React, {Component} from 'react';
import {getCurrentUser} from '../actions';
import Sidebar from './Sidebar';

export default class Inside extends Component {
  componentDidMount() {
    getCurrentUser();
  }

  render() {
    return (
      <div>
        <Sidebar />
        { this.props.children }
      </div>
    );
  }
}
