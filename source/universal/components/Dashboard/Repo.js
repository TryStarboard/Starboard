import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import classnames from 'classnames';

class Repo extends Component {
  render() {
    const {
      full_name,
      description,
      html_url,
      tags,
      connectDropTarget,
      isOver,
    } = this.props;

    return connectDropTarget(
      <div className={classnames('repo', {'repo--is-tag-over': isOver})}>
        <div className="repo__full-name">
          <a className="repo__name-link" target="_blank" href={html_url}>{full_name}</a>
        </div>
        <div className="repo__desc">{description}</div>
        <ul className="repo__tags">
          {tags[0] != null ? tags.map((tag) => {
            const style = {
              backgroundColor: tag.background_color,
              color: tag.foreground_color,
            };

            return <li key={tag.id} style={style}>{tag.text}</li>;
          }) : null}
        </ul>
      </div>
    );
  }
}

export default DropTarget(
  'TAG',
  {
    drop(props, monitor) {
      const tag = monitor.getItem();
      props.applyTagToRepo(tag.id, props.id);
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  })
)(Repo);
