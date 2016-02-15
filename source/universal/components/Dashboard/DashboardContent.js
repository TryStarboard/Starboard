import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import AddTag from './AddTag';
import Tag from './Tag';
import Repo from './Repo';

class DashboardContent extends Component {

  render() {
    const {
      stars,
      openAddTagModal,
      tags,
      applyTagToRepo,
      beginDragTag,
      endDragTag,
      deleteTag,
    } = this.props;

    return (
      <div className='dashboard'>
        <div className="dashboard__tags">
          <AddTag onClick={openAddTagModal} ui={this.props.ui} deleteTag={deleteTag}></AddTag>
          {tags.map((tag) => <Tag {...tag} {...{beginDragTag, endDragTag}} key={tag.id}/>)}
        </div>
        <div className="dashboard__repos">
          {stars.map((repo) =>
            <Repo {...repo} {...{applyTagToRepo}} key={repo.id}/>
          )}
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(DashboardContent);
