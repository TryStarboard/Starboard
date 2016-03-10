import React, { Component } from 'react';
import observeStore from '../higher-order-components/observeStore';

const connect = observeStore(
  ({ tagId }) => ({ tag: ['tagsById', tagId] })
);

export default connect(
  class FilterBar extends Component {
    render() {
      const {
        tag: { background_color, foreground_color, text } = {},
      } = this.props;

      const style = {
        backgroundColor: background_color,
        color: foreground_color,
      };

      return (
        <div className='filters__tag' style={ style }>{ text }</div>
      );
    }
  }
);
