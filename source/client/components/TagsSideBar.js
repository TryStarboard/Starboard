import React, {Component}                                 from 'react';
import classnames                                         from 'classnames';
import {DropTarget}                                       from 'react-dnd';
import observeStore                                       from '../higher-order-components/observeStore';
import {getAllTags, addTag, deleteTag, changeAddTagInput} from '../actions';
import Tag                                                from './Tag';

const createObserveComponent = observeStore(
  () => ({
    tags: ['tags'],
    errorMsg: ['ui', 'addTagErrorMsg'],
    isDraggingTag: ['ui', 'isDraggingTag'],
    inputValue: ['ui', 'tagInputValue'],
  })
);

class TagsSideBar extends Component {
  componentDidMount() {
    getAllTags();
  }

  render() {
    const {
      isDraggingTag,
      connectDropTarget,
      isOver,
      errorMsg,
      inputValue,
    } = this.props;

    let inputContent;

    if (isDraggingTag) {
      const dropTarget = connectDropTarget(
        <div className={classnames('dashboard__tags-input-delete-zone', {
          'dashboard__tags-input-delete-zone--over': isOver,
        })}></div>
      );

      inputContent = (
        <div>
          {dropTarget}
          <div className='dashboard__tags-input-helper-text'>
            Drag here to delete
          </div>
        </div>
      );
    } else {
      const helperMsg = errorMsg || 'Type tag name, hit Enter to create new tag';

      inputContent = (
        <form onSubmit={addTag} autoComplete='off'>
          <input
            type='text'
            name='tag_text'
            className='dashboard__tags-input'
            placeholder='Create new tag...'
            value={inputValue}
            onChange={changeAddTagInput}/>
          <div className={classnames('dashboard__tags-input-helper-text', {
            'dashboard__tags-input-helper-text--error': errorMsg,
          })}>
            {helperMsg}
          </div>
        </form>
      );
    }

    return (
      <div className='dashboard__tags'>
        <div className='dashboard__tags-input-wrapper'>
          {inputContent}
        </div>
        <div className='dashboard__tags-tag-list'>
          {this.props.tags.map((id) => <Tag id={id} key={id} />)}
        </div>
        <div className="dashboard__tags-tip-box">
          <div className="dashboard__tags-tip-box-arrow"></div>
          Drag & drop a tag over a repo to assign tags to repos
        </div>
      </div>
    );
  }
}

export default createObserveComponent(DropTarget(
  'TAG',
  {
    drop(props, monitor) {
      deleteTag(monitor.getItem());
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  })
)(TagsSideBar));
