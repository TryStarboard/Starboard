import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import AddTag from './AddTag';
import Tag from './Tag';
import Repo from './Repo';

class DashboardContent extends Component {
  render() {
    const {openAddTagModal, stars, tags, applyTagToRepo} = this.props;

    return (
      <div className='dashboard'>
        <div className="dashboard__tags">
          <AddTag onClick={openAddTagModal}></AddTag>
          {tags.map((t) => <Tag {...t} key={t.id}/>)}
        </div>
        <div className="dashboard__repos">
          {stars.map((repo) => <Repo {...repo} applyTagToRepo={applyTagToRepo} key={repo.id}/>)}
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(DashboardContent);
