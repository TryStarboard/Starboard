import React, {Component} from 'react';
import {DragSource} from 'react-dnd';
import observeStore from '../higher-order-components/observeStore';
import {beginDragTag, endDragTag, selectTag} from '../actions';

const createObserveComponent = observeStore(
  ({id}) => ({tag: ['tagsById', id]})
);

class Tag extends Component {
  render() {
    const {
      id,
      isDragging,
      connectDragSource,
      tag: {text, foreground_color, background_color, isSelected} = {}
    } = this.props;

    const style = {
      backgroundColor: background_color,
      color: foreground_color,
      opacity: isDragging ? 0.5 : 1,
      transform: isSelected ? 'scale(0.8)' : null,
    };

    return connectDragSource(
      <div className='tag' style={style} onClick={() => selectTag(id)}>
        {text}
      </div>
    );
  }
}

export default createObserveComponent(DragSource(
  'TAG',
  {
    beginDrag(props) {
      beginDragTag();
      return {tagId: props.id};
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
