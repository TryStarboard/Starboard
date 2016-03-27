import React, {Component}   from 'react';
import observeStore         from '../higher-order-components/observeStore';
import {getAllTags, addTag} from '../actions';
import Tag                  from './Tag';

const createObserveComponent = observeStore(
  () => ({tags: ['tags']})
);

export default createObserveComponent(
  class TagsSideBar extends Component {
    componentDidMount() {
      getAllTags();
    }

    render() {
      return (
        <div className="dashboard__tags">
          <form className="dashboard__tags-input-wrapper" onSubmit={addTag}>
            <input
              type="text"
              name="tag_text"
              className="dashboard__tags-input"
              placeholder="Create new tag..."/>
            <div className="dashboard__tags-input-helper-text">Type tag name, hit Enter to create new tag</div>
          </form>
          <div className="dashboard__tags-tag-list">
            {this.props.tags.map((id) => <Tag id={id} key={id} />)}
          </div>
        </div>
      );
    }
  }
);
