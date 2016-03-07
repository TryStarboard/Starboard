import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { contains, __, all, pluck } from 'ramda';
import { reposWithTagDetailSelector } from './mapStateToProps';
import Repo from './Repo';

class ReposList extends Component {

  static contextTypes = {
    getAllRepos: PropTypes.func.isRequired,
    applyTagToRepo: PropTypes.func.isRequired,
    removeRepoTag: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.context.getAllRepos();
  }

  render() {
    const {
      applyTagToRepo,
      removeRepoTag,
    } = this.context;

    const { repos } = this.props;

    return (
      <div className="dashboard__repos">
        {repos.map((repo) =>
          <Repo {...repo} {...{applyTagToRepo, removeRepoTag}} key={repo.id}/>
        )}
      </div>
    );
  }
}

export default connect(
  createSelector(
    reposWithTagDetailSelector,
    (state) => state.filters,
    (repos, filters) => {
      if (!filters.length) {
        return { repos };
      }

      return {
        repos: repos.filter((repo) => {
          return all(
            contains(__, pluck('id', repo.tags)),
            filters
          );
        }),
      };
    }
  ),
  null,
  null,
  {pure: true}
)(ReposList);
