import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { FormField } from './Form';

export default class Login extends Component {
  render() {
    return (
      <div className="form-container">
        <div className='form-container__switch'>
          <Link className={classnames('form-container__switch-btn', {active: true})} to='/login'>Login</Link>
          <Link className={classnames('form-container__switch-btn', 'right', {active: false})} to='/signup'>Sign Up</Link>
        </div>
        <form className='form'>
          <FormField label='Email' type='email'/>
          <FormField label='Password' type='password'/>
        </form>
      </div>
    );
  }
}
