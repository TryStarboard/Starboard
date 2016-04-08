import React, {Component} from 'react';
import octocatImg from 'img/octocat.jpg';

export default class Login extends Component {
  render() {
    return (
      <div className="login">
        <img className="login__github-logo" src={octocatImg} />
        <a href="/github-login">Login with Github</a>
      </div>
    );
  }
}
