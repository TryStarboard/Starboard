import React, { Component, PropTypes } from 'react';
import { contains, __, all, pluck } from 'ramda';
import observeStore from '../higher-order-components/observeStore';
import { getAllRepos } from '../actions';
import Repo from './Repo';

const connect = observeStore(
  () => ({ repos: ['repos'] })
);

export default connect(
  class ReposList extends Component {
    componentDidMount() {
      getAllRepos();
    }

    render() {
      return (
        <div className="dashboard__repos">
          { this.props.repos.map((id) => <Repo id={ id } key={ id } />) }
        </div>
      );
    }
  }
);

// export default connect(
//   createSelector(
//     reposWithTagDetailSelector,
//     (state) => state.filters,
//     (repos, filters) => {
//       if (!filters.length) {
//         return { repos };
//       }

//       return {
//         repos: repos.filter((repo) => {
//           return all(
//             contains(__, pluck('id', repo.tags)),
//             filters
//           );
//         }),
//       };
//     }
//   ),
//   null,
//   null,
//   {pure: true}
// )(ReposList);
