import React, { Component } from 'react';
import { FormField } from './Form';

export default class SignUp extends Component {
  render() {
    return (
      <form>
        <h2>Sign Up</h2>
        <FormField label='email' type='email'/>
        <FormField label='password' type='password'/>
      </form>
    );
  }
}
