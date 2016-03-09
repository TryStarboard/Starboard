import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import observeStore from '../higher-order-components/observeStore';

const connect = observeStore(
  ({ id }) => ({ tag: ['tagsById', id] })
);

const ConnectedTag = connect(class Tag extends Component {

  // static contextTypes = {
  //   selectTag: PropTypes.func.isRequired,
  // };

  // static propTypes = {
  //   text: PropTypes.string.isRequired,
  //   isSelected: PropTypes.bool,
  //   beginDragTag: PropTypes.func.isRequired,
  //   endDragTag: PropTypes.func.isRequired,

  //   // Injected by React DnD
  //   isDragging: PropTypes.bool.isRequired,
  //   connectDragSource: PropTypes.func.isRequired,
  // };

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
});

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
)(ConnectedTag);
