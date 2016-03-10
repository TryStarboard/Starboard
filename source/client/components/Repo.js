import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import classnames from 'classnames';
import findIndex from 'lodash/findIndex';
import observeStore from '../higher-order-components/observeStore';
import RepoTag from './RepoTag';

const connect = observeStore(
  ({ id }) => ({ repo: ['reposById', id] })
);

const ConnectedRepo = connect(
  class Repo extends Component {
    render() {
      const {
        isOver,
        connectDropTarget,
        repo: { id, full_name, description, html_url, tags } = {},
      } = this.props;

      return connectDropTarget(
        <div className={ classnames('repo', {'repo--is-tag-over': isOver}) }>
          <div className="repo__full-name">
            <a className="repo__name-link" target="_blank" href={ html_url }>{ full_name }</a>
          </div>
          <ul className="repo__tags">
            {tags && tags.map((id) => <RepoTag id={ id } key={ id }/> )}
          </ul>
          <div className="repo__desc">{ description }</div>
        </div>
      );
    }
  }
);

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
)(ConnectedRepo);
