import React from 'react';

const Repo = ({full_name, description, html_url, tag_texts, colorMap}) => (
  <div className="repo">
    <div className="repo__full-name">
      <a className="repo__name-link" target="_blank" href={html_url}>{full_name}</a>
    </div>
    <div className="repo__desc">{description}</div>
    <ul className="repo__tags">
      {tag_texts[0] != null ? tag_texts.map((text) => {
        const style = {
          backgroundColor: colorMap[text].bg,
          color: colorMap[text].fg,
        };

        return <li key={text} style={style}>{text}</li>;
      }) : null}
    </ul>
  </div>
);

const Tag = ({text, foreground_color, background_color}) => {
  const style = {
    backgroundColor: background_color,
    color: foreground_color,
  };

  return (
    <div className="tag" style={style}>
      <div className="tag__text">{text}</div>
    </div>
  );
};

function indexTags(tags) {
  const colorMap = {};
  for (const {text, foreground_color, background_color} of tags) {
    colorMap[text] = {bg: background_color, fg: foreground_color};
  }
  return colorMap;
}

export default ({stars, tags}) => {

  const colorMap = indexTags(tags);

  return (
    <div className='dashboard'>
      <div className="dashboard__tags">
        {tags.map((t) => <Tag key={t.id} {...t}/>)}
      </div>
      <div className="dashboard__repos">
        {stars.map((s) => <Repo key={s.id} {...s} colorMap={colorMap}/>)}
      </div>
    </div>
  );
};
