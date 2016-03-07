import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { userSelector } from './mapStateToProps';

class UserProfile extends Component {

  static contextTypes = {
    deleteAccount: PropTypes.func.isRequired,
  }

  render() {
    const {
      avatar,
      email,
      displayname
    } = this.props.user;
    const { deleteAccount } = this.context;
    return (
      <div className="userprofile">
        <img className="userprofile__avatar" src={avatar}></img>
        <h3 className="userprofile__displayname">{displayname}</h3>
        <h6 className="userprofile__email">Email: {email}</h6>
        <button className="userprofile__delete-button" onClick={deleteAccount}>Delete Account</button>
      </div>
    );
  }

}

export default connect(
  createSelector(
    userSelector,
    (user) => ({ user })
  ),
  null,
  null,
  {pure: true}
)(UserProfile);
