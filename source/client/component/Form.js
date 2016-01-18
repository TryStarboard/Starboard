import React, { Component } from 'react';

export class FormField extends Component {
  render() {
    return (
      <div className='form-field'>
        <label className='form-field__helper'>{this.props.label}</label>
        <input className='form-field__input' type={this.props.type}/>
      </div>
    );
  }
}
