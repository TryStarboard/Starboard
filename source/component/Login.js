import React, { Component } from 'react';
import { FormField, FormSwitch, Button } from './Form';

export default class Login extends Component {
  render() {
    return (
      <div className="form-container">
        <FormSwitch pathname={this.props.location.pathname}/>
        <form className='form' onSubmit={this._onSubmit.bind(this)}>
          <FormField label='Email' type='email'/>
          <FormField label='Password' type='password'/>
          <Button>Submit</Button>
        </form>
      </div>
    );
  }

  _onSubmit(event) {
    event.preventDefault();
    this.props.dispatch();
  }
}
