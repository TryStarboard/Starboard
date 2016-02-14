import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import classnames from 'classnames';

class Repo extends Component {
  render() {
    const {
      full_name,
      description,
      html_url,
      tag_texts,
      colorMap,
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
          {tag_texts[0] != null ? tag_texts.map((text) => {
            const style = {
              backgroundColor: colorMap[text].bg,
              color: colorMap[text].fg,
            };

            return <li key={text} style={style}>{text}</li>;
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
