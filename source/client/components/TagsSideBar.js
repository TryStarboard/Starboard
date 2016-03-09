import React, { Component } from 'react';
import u from 'updeep';
import { pipe, prop, contains, __, assoc } from 'ramda';
import { getAllTags } from '../actions';
import observeStore from '../higher-order-components/observeStore';
import AddTag from './AddTag';
import Tag from './Tag';

const connect = observeStore(
  () => ({ tags: ['tags'] })
);

export default connect(
  class TagsSideBar extends Component {
    componentDidMount() {
      getAllTags();
    }

    render() {
      return (
        <div className="dashboard__tags">
          <AddTag />
          { this.props.tags.map((tag) => <Tag { ...tag } key={ tag.id } />) }
        </div>
      );
    }
  }
);

// export default connect(
//   createSelector(
//     tagsWithColorsSelector,
//     uiSelector,
//     (state) => state.filters,
//     (tags, ui, filters) => {
//       return {
//         ui,
//         tags: tags.map(u(
//           u.if(
//             pipe(prop('id'), contains(__, filters)),
//             assoc('isSelected', true)
//           )
//         ))
//       };
//     }
//   ),
//   null,
//   null,
//   {pure: true}
// )(TagsSideBar);
