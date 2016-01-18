import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { FormField } from './Form';

export default class SignUp extends Component {
  render() {
    return (
      <div className="form-container">
        <div className='form-container__switch'>
          <Link className={classnames('form-container__switch-btn', {active: false})} to='/login'>Login</Link>
          <Link className={classnames('form-container__switch-btn', 'right', {active: true})} to='/signup'>Sign Up</Link>
        </div>
        <form className='form'>
          <FormField label='Email' type='email'/>
          <FormField label='Password' type='password'/>
        </form>
      </div>
    );
  }
}
