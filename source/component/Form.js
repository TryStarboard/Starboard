import React, { Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

export class FormField extends Component {
  render() {
    return (
      <div className='form-field'>
        <label className='form-field__label'>{this.props.label}</label>
        <input className='form-field__input' type={this.props.type} name={this.props.name}/>
      </div>
    );
  }
}

export class FormSwitch extends Component {
  render() {
    return (
      <div className='form-container__switch'>
        <Link className={classnames('form-container__switch-btn', {active: this.props.pathname === '/login'})} to='/login'>Login</Link>
        <Link className={classnames('form-container__switch-btn', 'right', {active: this.props.pathname === '/signup'})} to='/signup'>Sign Up</Link>
      </div>
    );
  }
}

export class Button extends Component {
  render() {
    return (
      <button className='form-button'>{this.props.children}</button>
    );
  }
}
