import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import observeStore from '../higher-order-components/observeStore';
import { beginDragTag, endDragTag } from '../actions';

const connect = observeStore(
  ({ id }) => ({ tag: ['tagsById', id] })
);

class Tag extends Component {
  render() {
    const {
      isSelected,
      isDragging,
      connectDragSource,
      tag: { id, text, foreground_color, background_color } = {}
    } = this.props;

    const style = {
      backgroundColor: background_color,
      color: foreground_color,
      opacity: isDragging ? 0.5 : 1,
      transform: isSelected ? 'scale(0.8)' : null,
    };

    return connectDragSource(
      <div
        className='tag'
        style={ style }
        onClick={ () => null }>
        <div className="tag__text">{ text }</div>
      </div>
    );
  }
}

export default connect(DragSource(
  'TAG',
  {
    beginDrag(props) {
      beginDragTag();
      return { tagId: props.id };
    },
    endDrag() {
      endDragTag();
    },
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(Tag));
