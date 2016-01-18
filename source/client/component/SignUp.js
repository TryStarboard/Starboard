import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { FormField, FormSwitch } from './Form';

export default class SignUp extends Component {
  render() {
    return (
      <div className="form-container">
        <FormSwitch pathname={this.props.location.pathname}/>
        <form className='form'>
          <FormField label='Email' type='email'/>
          <FormField label='Password' type='password'/>
        </form>
      </div>
    );
  }
}
