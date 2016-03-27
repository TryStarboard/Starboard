import React, {Component}   from 'react';
import classnames           from 'classnames';
import observeStore         from '../higher-order-components/observeStore';
import {getAllTags, addTag} from '../actions';
import Tag                  from './Tag';

const createObserveComponent = observeStore(
  () => ({
    tags: ['tags'],
    errorMsg: ['ui', 'addTagErrorMsg', 'tag_text', 0],
  })
);

class TagsSideBar extends Component {
  componentDidMount() {
    getAllTags();
  }

  render() {
    const helperMsg = this.props.errorMsg || 'Type tag name, hit Enter to create new tag';

    return (
      <div className='dashboard__tags'>
        <form className='dashboard__tags-input-wrapper' onSubmit={addTag}>
          <input
            type='text'
            name='tag_text'
            className='dashboard__tags-input'
            placeholder='Create new tag...'/>
          <div className={classnames('dashboard__tags-input-helper-text', {
            'dashboard__tags-input-helper-text--error': this.props.errorMsg,
          })}>
            {helperMsg}
          </div>
        </form>
        <div className='dashboard__tags-tag-list'>
          {this.props.tags.map((id) => <Tag id={id} key={id} />)}
        </div>
      </div>
    );
  }
}

export default createObserveComponent(TagsSideBar);
