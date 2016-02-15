import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import AddTag from './AddTag';
import Tag from './Tag';
import Repo from './Repo';
import RepoTagDragLayer from './RepoTagDragLayer';

class DashboardContent extends Component {

  static contextTypes = {
    openAddTagModal: PropTypes.func.isRequired,
    applyTagToRepo: PropTypes.func.isRequired,
    beginDragTag: PropTypes.func.isRequired,
    endDragTag: PropTypes.func.isRequired,
    deleteTag: PropTypes.func.isRequired,
    removeRepoTag: PropTypes.func.isRequired,
  };

  render() {
    const {
      stars,
      tags,
    } = this.props;

    const {
      openAddTagModal,
      applyTagToRepo,
      beginDragTag,
      endDragTag,
      deleteTag,
      removeRepoTag,
    } = this.context;

    return (
      <div className='dashboard'>
        <div className="dashboard__tags">
          <AddTag onClick={openAddTagModal} ui={this.props.ui} deleteTag={deleteTag}></AddTag>
          {tags.map((tag) => <Tag {...tag} {...{beginDragTag, endDragTag}} key={tag.id}/>)}
        </div>
        <div className="dashboard__repos">
          {stars.map((repo) =>
            <Repo {...repo} {...{applyTagToRepo, removeRepoTag}} key={repo.id}/>
          )}
        </div>
        <RepoTagDragLayer/>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(DashboardContent);
