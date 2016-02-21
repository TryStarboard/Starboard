import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TagsSideBar from './TagsSideBar';
import ReposList from './ReposList';
import FilterBar from './FilterBar';
import RepoTagDragLayer from './RepoTagDragLayer';

class DashboardContent extends Component {
  render() {
    return (
      <div>
        <FilterBar/>
        <TagsSideBar/>
        <ReposList/>
        <RepoTagDragLayer/>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(DashboardContent);
