import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from './Form';
import { collect } from '../utils/form';
import { login } from '../actions';
import octocatImg from '../../client/img/octocat.jpg';

class Login extends Component {
  render() {
    return (
      <div className="login">
        <img className="login__github-logo" src={octocatImg}></img>
        <Button>Login with Github</Button>
      </div>
    );
  }

  _onSubmit(event) {
    event.preventDefault();
    this.props.dispatch(login(collect(event.target)));
  }
}

export default connect((s) => s)(Login);
