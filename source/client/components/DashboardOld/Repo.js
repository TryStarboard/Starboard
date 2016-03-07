import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import classnames from 'classnames';
import findIndex from 'lodash/findIndex';
import RepoTag from './RepoTag';

class Repo extends Component {
  render() {
    const {
      id,
      full_name,
      description,
      html_url,
      tags,
      connectDropTarget,
      isOver,
      removeRepoTag,
    } = this.props;

    return connectDropTarget(
      <div className={classnames('repo', {'repo--is-tag-over': isOver})}>
        <div className="repo__full-name">
          <a className="repo__name-link" target="_blank" href={html_url}>{full_name}</a>
        </div>
        <ul className="repo__tags">
          {tags.filter((tag) => tag).map((tag) =>
            <RepoTag {...tag} removeRepoTag={removeRepoTag} repo_id={id} key={tag.id}/>
          )}
        </ul>
        <div className="repo__desc">{description}</div>
      </div>
    );
  }
}

export default DropTarget(
  'TAG',
  {
    canDrop(props, monitor) {
      const tag = monitor.getItem();
      return findIndex(props.tags, ['id', tag.id]) === -1;
    },
    drop(props, monitor) {
      const tag = monitor.getItem();
      props.applyTagToRepo(tag.id, props.id);
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.canDrop() && monitor.isOver(),
  })
)(Repo);
