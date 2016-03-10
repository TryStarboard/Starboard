import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import classnames from 'classnames';
import PlusIcon from 'svg/add-tag-icon.svg';
import TrashCanIcon from 'svg/trash-can-icon.svg';
import observeStore from '../higher-order-components/observeStore';
import { openAddTagModal, deleteTag } from '../actions';

const createObserveComponent = observeStore(
  () => ({ isDraggingTag: ['ui', 'isDraggingTag'] })
);

class AddTag extends Component {
  render() {
    const {
      isDraggingTag,
      connectDropTarget,
      isOver,
    } = this.props;

    const buttonClassname =
      classnames('tag', 'tag--btn', { 'tag--delete-active': isOver });

    return connectDropTarget(
      <button
        className={ buttonClassname }
        onClick={ openAddTagModal }>
        { isDraggingTag ? <TrashCanIcon /> : <PlusIcon /> }
      </button>
    );
  }
}

export default createObserveComponent(DropTarget(
  'TAG',
  {
    drop(props, monitor) {
      deleteTag(monitor.getItem());
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  })
)(AddTag));
