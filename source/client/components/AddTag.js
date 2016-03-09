import React, { Component } from 'react';
// import { DropTarget } from 'react-dnd';
import classnames from 'classnames';
import PlusIcon from 'svg/add-tag-icon.svg';
import TrashCanIcon from 'svg/trash-can-icon.svg';

export default class AddTag extends Component {
  render() {
    // const {
    //   onClick,
    //   ui: {isDraggingTag},
    //   connectDropTarget,
    //   isOver,
    // } = this.props;

    // return connectDropTarget(
    // return (
    //   <button
    //     className={classnames('tag', 'tag--btn', { 'tag--delete-active': isOver })}
    //     onClick={onClick}>
    //     {isDraggingTag ? <TrashCanIcon/> : <PlusIcon/>}
    //   </button>
    // );
    return (
      <button className={ classnames('tag', 'tag--btn') }>
        <PlusIcon />
      </button>
    );
  }
}

// export default DropTarget(
//   'TAG',
//   {
//     drop(props, monitor) {
//       props.deleteTag(monitor.getItem());
//     }
//   },
//   (connect, monitor) => ({
//     connectDropTarget: connect.dropTarget(),
//     isOver: monitor.isOver(),
//   })
// )(AddTag);
