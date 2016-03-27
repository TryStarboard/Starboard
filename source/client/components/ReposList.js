import React, {Component} from 'react';
import observeStore from '../higher-order-components/observeStore';
import {getAllRepos} from '../actions';
import Repo from './Repo';

const createObserveComponent = observeStore(
  () => ({repos: ['repos']})
);

export default createObserveComponent(
  class ReposList extends Component {
    componentDidMount() {
      getAllRepos();
    }

    render() {
      return (
        <div className="dashboard__repos">
          {this.props.repos.map((id) => <Repo id={id} key={id}/>)}
        </div>
      );
    }
  }
);
