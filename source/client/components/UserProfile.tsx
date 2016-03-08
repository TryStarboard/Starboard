import * as React from 'react';
import { Component, PropTypes } from 'react';
// import { createSelector } from 'reselect';
// import { userSelector } from './mapStateToProps';

export default class UserProfile extends Component<any, any> {

  render() {
    // const {
    //   avatar,
    //   email,
    //   displayname
    // } = this.props.user;
    // const { deleteAccount } = this.context;
    return (
      <div className="userprofile">
        <img className="userprofile__avatar" src={'avatar'}></img>
        <h3 className="userprofile__displayname">{'displayname'}</h3>
        <h6 className="userprofile__email">Email: {'email'}</h6>
        <button className="userprofile__delete-button" onClick={() => null}>Delete Account</button>
      </div>
    );
  }

}
