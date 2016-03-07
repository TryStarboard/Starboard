import * as React from 'react';
import { Component } from 'react';
// import { createSelector } from 'reselect';
import u from 'updeep';
import { pipe, prop, contains, __, assoc } from 'ramda';
import AddTag from './AddTag';
import Tag from './Tag';
import { tagsWithColorsSelector, uiSelector } from './mapStateToProps';

export default class TagsSideBar extends Component<any, any> {

  componentDidMount() {
    // this.context.getAllTags();
  }

  render() {
    const { tags, ui } = this.props;

    return (
      <div className="dashboard__tags">
        <AddTag onClick={'openAddTagModal'} ui={ui} deleteTag={'deleteTag'}/>
        {tags.map((tag) => <Tag {...tag} {...{beginDragTag, endDragTag}} key={tag.id}/>)}
      </div>
    );
  }

}

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
