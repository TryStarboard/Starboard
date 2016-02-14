import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import defaults from 'lodash/fp/defaults';
import keyBy from 'lodash/fp/keyBy';
import assign from 'lodash/fp/assign';
import { createSelector } from 'reselect';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';
import AddTagModal from './AddTagModal';
import { DEFAULT_TAG_COLORS } from '../../const/DEFAULT_TAG_COLORS';

class Dashboard extends Component {

  static contextTypes = {
    logout: PropTypes.func.isRequired,
    syncRepos: PropTypes.func.isRequired,
    openAddTagModal: PropTypes.func.isRequired,
    closeAddTagModal: PropTypes.func.isRequired,
    addTag: PropTypes.func.isRequired,
    applyTagToRepo: PropTypes.func.isRequired,
  };

  render() {
    const {
      logout,
      syncRepos,
      openAddTagModal,
      closeAddTagModal,
      addTag,
      applyTagToRepo,
    } = bindActionCreators(this.context, this.props.dispatch);

    return (
      <div>
        <Sidebar {...{logout, syncRepos}}></Sidebar>
        <DashboardContent
          {...{openAddTagModal, applyTagToRepo}}
          stars={this.props.stars}
          tags={this.props.tags}/>
        <AddTagModal
          ui={this.props.ui}
          closeAddTagModal={closeAddTagModal}
          addTag={addTag}/>
      </div>
    );
  }
}

const reposSelector = (state) => state.stars;
const tagsSelector = (state) => state.tags;
const uiSelector = (state) => state.ui;

const tagsWithColorsSelector = createSelector(
  tagsSelector,
  (tags) => {
    return tags.map((tag) => {
      const colors = DEFAULT_TAG_COLORS[tag.text.toLowerCase()];
      if (!colors) {
        return tag;
      }
      return defaults(tag, {
        background_color: colors.bg,
        foreground_color: colors.fg,
      });
    });
  }
);

const tagsMapSelector = createSelector(
  tagsWithColorsSelector,
  keyBy('id')
);

const reposWithTagDetailSelector = createSelector(
  reposSelector,
  tagsMapSelector,
  (repos, tags) => {
    return repos.map((repo) => {
      return assign(repo, {
        tags: repo.tags.map((tag_id) => tags[tag_id])
      });
    });
  }
);

const mapStateToProps = createSelector(
  tagsWithColorsSelector,
  reposWithTagDetailSelector,
  uiSelector,
  (tags, repos, ui) => ({tags, stars: repos, ui})
);

export default connect(mapStateToProps)(Dashboard);
