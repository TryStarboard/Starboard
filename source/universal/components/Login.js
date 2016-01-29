import React, { Component } from 'react';
import { connect } from 'react-redux';
import octocatImg from '../../client/img/octocat.jpg';

class Login extends Component {
  render() {
    return (
      <div className="login">
        <img className="login__github-logo" src={octocatImg}></img>
        <a href="/github-login">Login with Github</a>
      </div>
    );
  }
}

export default connect((s) => s)(Login);
