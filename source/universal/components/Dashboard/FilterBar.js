import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { uiSelector, tagsMapSelector } from './mapStateToProps';

class FilterBar extends Component {
  render() {
    return (
      <div className='dashboard__filters filters'>
        {this.props.filters.map((tag) => {
          const style = {
            backgroundColor: tag.background_color,
            color: tag.foreground_color,
          };

          return <div className='filters__tag' style={style} key={tag.id}>{tag.text}</div>;
        })}
      </div>
    );
  }
}



export default connect(
  createSelector(
    uiSelector,
    tagsMapSelector,
    (ui, tagMap) => {
      return {
        filters: ui.selectedTags.length ? [tagMap[ui.selectedTags[0]]] : [],
      };
    }
  )
)(FilterBar);
