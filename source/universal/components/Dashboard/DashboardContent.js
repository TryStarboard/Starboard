import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TagsSideBar from './TagsSideBar';
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
    } = this.props;

    const {
      applyTagToRepo,
      removeRepoTag,
    } = this.context;

    return (
      <div className='dashboard'>
        <TagsSideBar/>
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
