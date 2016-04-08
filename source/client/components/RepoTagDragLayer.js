import React, {Component} from 'react';
import {DragLayer} from 'react-dnd';
import TrashCanIcon from 'svg/trash-can-icon.svg';

const {pow, sqrt} = Math;

class RepoTagDragLayer extends Component {

  // static propTypes = {
  //   itemType: PropTypes.string,
  //   currentOffset: PropTypes.shape({
  //     x: PropTypes.number.isRequired,
  //     y: PropTypes.number.isRequired
  //   }),
  //   differenceFromInitialOffset: PropTypes.shape({
  //     x: PropTypes.number.isRequired,
  //     y: PropTypes.number.isRequired
  //   }),
  //   isDragging: PropTypes.bool.isRequired,
  // };

  render() {
    const {
      itemType,
      isDragging,
      currentOffset,
      differenceFromInitialOffset,
    } = this.props;

    if (!isDragging || itemType !== 'REPO_TAG') {
      return null;
    }

    const {x, y} = differenceFromInitialOffset;
    const showTrashCan = sqrt(pow(x, 2) + pow(y, 2)) > 200;

    if (!showTrashCan) {
      return null;
    }

    const style = {
      transform: `translate3d(${currentOffset.x - 30}px, ${currentOffset.y + 34}px, 0)`
    };

    return (
      <div className='dashboard__repo-tag-drag-layer' style={ style }>
        <TrashCanIcon/>
      </div>
    );
  }
}

export default DragLayer((monitor) => ({
  itemType: monitor.getItemType(),
  currentOffset: monitor.getSourceClientOffset(),
  differenceFromInitialOffset: monitor.getDifferenceFromInitialOffset(),
  isDragging: monitor.isDragging(),
}))(RepoTagDragLayer);
