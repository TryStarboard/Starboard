import * as React from 'react';
import { Component } from 'react';
// import { DragDropContext } from 'react-dnd';
// import HTML5Backend from 'react-dnd-html5-backend';
import TagsSideBar from './TagsSideBar';
// import ReposList from './ReposList';
// import FilterBar from './FilterBar';
// import RepoTagDragLayer from './RepoTagDragLayer';

class DashboardContent extends Component<any, any> {
        // <FilterBar />
        // <ReposList />
        // <RepoTagDragLayer />
  render() {
    return (
      <div>
        <TagsSideBar />
      </div>
    );
  }
}

export { DashboardContent as default };

// export default DragDropContext(HTML5Backend)(DashboardContent);
