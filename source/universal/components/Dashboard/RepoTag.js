import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import classnames from 'classnames';

class RepoTag extends Component {

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
  };

  render() {
    const {
      background_color,
      foreground_color,
      text,
      connectDragSource,
      isDragging,
    } = this.props;

    const style = {
      backgroundColor: background_color,
      color: foreground_color,
    };

    return connectDragSource(
      <li
        className={classnames('repo__tag', {'repo__tag--dragging': isDragging})}
        style={style}>
        {text}
      </li>
    );
  }
}

export default DragSource(
  'REPO_TAG',
  {
    beginDrag({ id }) {
      return { id };
    },
    // endDrag({endDragTag}) {
    //   endDragTag();
    // },
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })
)(RepoTag);
