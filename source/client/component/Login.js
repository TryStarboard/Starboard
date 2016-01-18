import React, { Component } from 'react';
import { FormField } from './Form';

export default class Login extends Component {
  render() {
    return (
      <form>
        <h2>Login</h2>
        <FormField label='email' type='email'/>
        <FormField label='password' type='password'/>
      </form>
    );
  }
}
