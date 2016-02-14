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

export { Repo as default };
