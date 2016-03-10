import React, { Component } from 'react';
import observeStore from '../higher-order-components/observeStore';
import { getAllTags } from '../actions';
import AddTag from './AddTag';
import Tag from './Tag';

const createObserveComponent = observeStore(
  () => ({ tags: ['tags'] })
);

export default createObserveComponent(
  class TagsSideBar extends Component {
    componentDidMount() {
      getAllTags();
    }

    render() {
      return (
        <div className="dashboard__tags">
          <AddTag />
          { this.props.tags.map((id) => <Tag id={ id } key={ id } />) }
        </div>
      );
    }
  }
);
