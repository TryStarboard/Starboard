import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import classnames from 'classnames';
import observeStore from '../higher-order-components/observeStore';

const connect = observeStore(
  ({ id }) => ({ tag: ['tagsById', id] })
);

const ConnectedRepoTag = connect(
  class RepoTag extends Component {
    render() {
      const {
        connectDragSource,
        isDragging,
        tag: { background_color, foreground_color, text } = {},
      } = this.props;

      const style = {
        backgroundColor: background_color,
        color: foreground_color,
      };

      return connectDragSource(
        <li
          className={ classnames('repo__tag', {'repo__tag--dragging': isDragging}) }
          style={ style }>
          { text }
        </li>
      );
    }
  }
);

const { pow, sqrt } = Math;

export default DragSource(
  'REPO_TAG',
  {
    beginDrag({ id, repo_id }) {
      return { tag_id: id, repo_id };
    },
    endDrag({ removeRepoTag }, monitor) {
      const { x, y } = monitor.getDifferenceFromInitialOffset();
      const shouldRemoveTag = sqrt(pow(x, 2) + pow(y, 2)) > 200;
      if (shouldRemoveTag) {
        removeRepoTag(monitor.getItem());
      }
    },
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })
)(ConnectedRepoTag);
