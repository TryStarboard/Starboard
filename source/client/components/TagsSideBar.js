import React, {Component} from 'react';
import observeStore       from '../higher-order-components/observeStore';
import {getAllTags}       from '../actions';
import Tag                from './Tag';

const createObserveComponent = observeStore(
  () => ({tags: ['tags']})
);

export default createObserveComponent(
  class TagsSideBar extends Component {
    componentDidMount() {
      getAllTags();
    }

    render() {
      return (
        <div className="dashboard__tags">
          <div className="dashboard__tags-input-wrapper">
            <input type="text" className="dashboard__tags-input" placeholder="Search or create new tag..." />
            <div className="dashboard__tags-input-helper-text">Type for search, hit Enter to create new tag</div>
          </div>
          <div className="dashboard__tags-tag-list">
            {this.props.tags.map((id) => <Tag id={id} key={id} />)}
          </div>
        </div>
      );
    }
  }
);
