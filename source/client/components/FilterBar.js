import React, {Component} from 'react';
import observeStore       from '../higher-order-components/observeStore';
import Filter             from './Filter';

const createObserveComponent = observeStore(
  () => ({filters: ['filters']})
);

export default createObserveComponent(
  class FilterBar extends Component {
    render() {
      return (
        <div className='dashboard__filters filters'>
          {this.props.filters.map((tagId) => <Filter tagId={tagId} key={tagId}/>)}
        </div>
      );
    }
  }
);
