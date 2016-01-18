import React, { Component } from 'react';

export default class extends Component {
  render() {
    return <h1>{`Hello World ${this.props.count}!`}</h1>;
  }
}
