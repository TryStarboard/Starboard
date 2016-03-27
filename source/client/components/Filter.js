import React, {Component} from 'react';
import observeStore       from '../higher-order-components/observeStore';
import {removeFilter}     from '../actions';

const createObserveComponent = observeStore(
  ({tagId}) => ({tag: ['tagsById', tagId]})
);

export default createObserveComponent(
  class FilterBar extends Component {
    render() {
      const {
        tagId: id,
        tag: {background_color, foreground_color, text} = {},
      } = this.props;

      const style = {
        backgroundColor: background_color,
        color: foreground_color,
      };

      return (
        <div className='filters__tag' style={style} onClick={() => removeFilter(id)}>{text}</div>
      );
    }
  }
);
