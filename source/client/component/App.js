import React, { Component } from 'react';
import { Link } from 'react-router';

export default class extends Component {
  render() {
    return (
      <div>
        <h1>Hello World!</h1>
        <br/>
        <Link to='/login'>login</Link>
        <br/>
        <Link to='/signup'>signup</Link>
        {this.props.children}
      </div>
    );
  }
}
