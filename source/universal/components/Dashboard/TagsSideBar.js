import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import u from 'updeep';
import { pipe, prop, contains, __, assoc } from 'ramda';
import AddTag from './AddTag';
import Tag from './Tag';
import { tagsWithColorsSelector, uiSelector } from './mapStateToProps';

const TagsSideBar = ({tags, ui}, {openAddTagModal, deleteTag, beginDragTag, endDragTag}) => (
  <div className="dashboard__tags">
    <AddTag onClick={openAddTagModal} ui={ui} deleteTag={deleteTag}/>
    {tags.map((tag) => <Tag {...tag} {...{beginDragTag, endDragTag}} key={tag.id}/>)}
  </div>
);

TagsSideBar.contextTypes = {
  openAddTagModal: PropTypes.func.isRequired,
  beginDragTag: PropTypes.func.isRequired,
  endDragTag: PropTypes.func.isRequired,
  deleteTag: PropTypes.func.isRequired,
};

export default connect(
  createSelector(
    tagsWithColorsSelector,
    uiSelector,
    (state) => state.filters,
    (tags, ui, filters) => {
      return {
        ui,
        tags: tags.map(u(
          u.if(
            pipe(prop('id'), contains(__, filters)),
            assoc('isSelected', true)
          )
        ))
      };
    }
  ),
  null,
  null,
  {pure: true}
)(TagsSideBar);
