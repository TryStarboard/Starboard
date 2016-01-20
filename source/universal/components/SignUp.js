import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormField, FormSwitch, Button } from './Form';

export default class SignUp extends Component {
  render() {
    return (
      <div className="form-container">
        <FormSwitch pathname={this.props.location.pathname}/>
        <form className='form'>
          <FormField label='Email' type='email'/>
          <FormField label='Password' type='password'/>
          <Button>Submit</Button>
        </form>
      </div>
    );
  }
}

export default connect((s) => s)(SignUp);
