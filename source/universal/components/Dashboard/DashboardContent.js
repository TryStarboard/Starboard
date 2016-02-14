import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import AddTag from './AddTag';
import Tag from './Tag';
import Repo from './Repo';

function indexTags(tags) {
  const colorMap = {};
  for (const {text, foreground_color, background_color} of tags) {
    colorMap[text] = {bg: background_color, fg: foreground_color};
  }
  return colorMap;
}

class DashboardContent extends Component {
  render() {
    const {openAddTagModal, stars, tags, applyTagToRepo} = this.props;
    const colorMap = indexTags(tags);

    return (
      <div className='dashboard'>
        <div className="dashboard__tags">
          <AddTag onClick={openAddTagModal}></AddTag>
          {tags.map((t) => <Tag key={t.id} {...t}/>)}
        </div>
        <div className="dashboard__repos">
          {stars.map((s) => <Repo key={s.id} {...s} colorMap={colorMap} applyTagToRepo={applyTagToRepo}/>)}
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(DashboardContent);
