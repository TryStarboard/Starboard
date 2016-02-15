import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';

class Tag extends Component {

  static propTypes = {
    text: PropTypes.string.isRequired,
    // Injected by React DnD
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    beginDragTag: PropTypes.func.isRequired,
    endDragTag: PropTypes.func.isRequired,
  };

  render() {
    const {
      text,
      foreground_color,
      background_color,
      isDragging,
      connectDragSource,
    } = this.props;

    const style = {
      backgroundColor: background_color,
      color: foreground_color,
      opacity: isDragging ? 0.5 : 1,
    };

    return connectDragSource(
      <div className="tag" style={style}>
        <div className="tag__text">{text}</div>
      </div>
    );
  }
}

export default DragSource(
  'TAG',
  {
    beginDrag({id, beginDragTag}) {
      beginDragTag();
      return {id};
    },
    endDrag({endDragTag}) {
      endDragTag();
    },
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(Tag);
