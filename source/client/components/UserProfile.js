import React, {Component} from 'react';
import observeStore from '../higher-order-components/observeStore';
import {deleteAccount} from '../actions';

const createObserveComponent = observeStore(
  () => ({user: ['user']})
);

export default createObserveComponent(
  class UserProfile extends Component {
    render() {
      const {
        user: {avatar, email, displayname} = {}
      } = this.props;

      return (
        <div className='userprofile'>
          <img className='userprofile__avatar' src={ avatar }></img>
          <h3 className='userprofile__displayname'>{ displayname }</h3>
          <h6 className='userprofile__email'>Email: { email }</h6>
          <button
            className='userprofile__delete-button'
            onClick={ deleteAccount }>
            Delete Account
          </button>
        </div>
      );
    }
  }
);
