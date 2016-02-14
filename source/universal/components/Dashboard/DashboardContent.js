import React from 'react';
import AddTag from './AddTag';
import Tag from './Tag';
import Repo from './Repo';

function indexTags(tags) {
  const colorMap = {};
  for (const {text, foreground_color, background_color} of tags) {
    colorMap[text] = {bg: background_color, fg: foreground_color};
  }
  return colorMap;
}

export default ({addTag, stars, tags}) => {

  const colorMap = indexTags(tags);

  return (
    <div className='dashboard'>
      <div className="dashboard__tags">
        <AddTag onClick={addTag}></AddTag>
        {tags.map((t) => <Tag key={t.id} {...t}/>)}
      </div>
      <div className="dashboard__repos">
        {stars.map((s) => <Repo key={s.id} {...s} colorMap={colorMap}/>)}
      </div>
    </div>
  );
};
