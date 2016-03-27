import React, {Component} from 'react';
import classnames         from 'classnames';
import observeStore       from '../higher-order-components/observeStore';
import {getAllRepos}      from '../actions';
import Repo               from './Repo';
import FilterBar          from './FilterBar';

const createObserveComponent = observeStore(
  () => ({
    repos: ['repos'],
    filters: ['filters'],
  })
);

export default createObserveComponent(
  class ReposList extends Component {
    componentDidMount() {
      getAllRepos();
    }

    render() {
      return (
        <div className='dashboard__repos'>
          <FilterBar/>
          <div className={classnames('dashboard__repos-list', {
            'dashboard__repos-list--no-filter': this.props.filters.length === 0,
          })}>
            <div className='dashboard__repos-list-inner'>
              {this.props.repos.map((id) => <Repo id={id} key={id}/>)}
            </div>
          </div>
        </div>
      );
    }
  }
);
