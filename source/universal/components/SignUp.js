import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormField, FormSwitch, Button } from './Form';
import { collect } from '../utils/form';
import { signup } from '../actions';

export default class SignUp extends Component {
  render() {
    return (
      <div className="form-container">
        <FormSwitch pathname={this.props.location.pathname}/>
        <form className='form' onSubmit={this._onSubmit.bind(this)}>
          <p>{this.props.form.err_code}</p>
          <FormField label='Email' type='email' name='email'/>
          <FormField label='Password' type='password' name='password'/>
          <Button>Submit</Button>
        </form>
      </div>
    );
  }

  _onSubmit(event) {
    event.preventDefault();
    this.props.dispatch(signup(collect(event.target)));
  }
}

export default connect((s) => s)(SignUp);
