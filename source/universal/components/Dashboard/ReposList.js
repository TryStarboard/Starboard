import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { reposWithTagDetailSelector } from './mapStateToProps';
import Repo from './Repo';

const ReposList = ({repos}, {applyTagToRepo, removeRepoTag}) => (
  <div className="dashboard__repos">
    {repos.map((repo) =>
      <Repo {...repo} {...{applyTagToRepo, removeRepoTag}} key={repo.id}/>
    )}
  </div>
);

ReposList.contextTypes = {
  applyTagToRepo: PropTypes.func.isRequired,
  removeRepoTag: PropTypes.func.isRequired,
};

export default connect(
  createSelector(
    reposWithTagDetailSelector,
    (repos) => ({ repos })
  ),
  null,
  null,
  {pure: true}
)(ReposList);
