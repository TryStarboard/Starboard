import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import classnames from 'classnames';
import PlusIcon from '../../../client/img/add-tag-icon.svg';
import TrashCanIcon from '../../../client/img/trash-can-icon.svg';

class AddTag extends Component {
  render() {
    const {
      onClick,
      ui: {isDraggingTag},
      connectDropTarget,
      isOver,
    } = this.props;

    return connectDropTarget(
      <button
        className={classnames('tag', 'tag--btn', {'tag--delete-active': isOver})}
        onClick={onClick}>
        {isDraggingTag ? <TrashCanIcon/> : <PlusIcon/>}
      </button>
    );
  }
}

export default DropTarget(
  'TAG',
  {
    drop(props, monitor) {
      props.deleteTag(monitor.getItem());
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  })
)(AddTag);
