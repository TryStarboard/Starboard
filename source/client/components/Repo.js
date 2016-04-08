import React, {Component} from 'react';
import {DropTarget}       from 'react-dnd';
import classnames         from 'classnames';
import observeStore       from '../higher-order-components/observeStore';
import {applyTagToRepo}   from '../actions';
import RepoTag            from './RepoTag';

const createObserveComponent = observeStore(
  ({id}) => ({repo: ['reposById', id]})
);

class Repo extends Component {
  render() {
    const {
      id: repoId,
      isOver,
      connectDropTarget,
      repo: {full_name, description, html_url, tags} = {},
    } = this.props;

    const [, authorName, repoName] = /(.+)\/(.+)/.exec(full_name);

    let tagsSection = null;
    if (tags.length) {
      tagsSection = (
        <ul className="repo__tags">
          {tags.map((id) => <RepoTag tagId={id} repoId={repoId} key={id}/>)}
        </ul>
      );
    }

    return connectDropTarget(
      <div className={classnames('repo', {'repo--is-tag-over': isOver})}>
        <div className="repo__full-name">
          <a className="repo__name-link" target="_blank" href={html_url}>
            <span className="repo__repo-name">{repoName}</span>
            <span className="repo__author-name"> / {authorName}</span>
          </a>
        </div>
        {tagsSection}
        <div className="repo__desc">{description}</div>
      </div>
    );
  }
}

export default createObserveComponent(DropTarget(
  'TAG',
  {
    canDrop(props, monitor) {
      const {tagId} = monitor.getItem();
      return props.repo.tags.indexOf(tagId) === -1;
    },
    drop(props, monitor) {
      const {tagId} = monitor.getItem();
      applyTagToRepo(tagId, props.id);
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.canDrop() && monitor.isOver(),
  })
)(Repo));
