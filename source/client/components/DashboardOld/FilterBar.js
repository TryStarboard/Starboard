import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { tagsMapSelector } from './mapStateToProps';

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
    (state) => state.filters,
    tagsMapSelector,
    (filters, tagMap) => {
      return {
        filters: filters.map((id) => tagMap[id]),
      };
    }
  )
)(FilterBar);
