import React from 'react';

const Repo = ({full_name, description, html_url}) => (
  <div className="repo">
    <div className="repo__full-name">
      <a className="repo__name-link" target="_blank" href={html_url}>{full_name}</a>
    </div>
    <div className="repo__desc">{description}</div>
  </div>
);

export default ({stars}) => (
  <div className='dashboard'>
    {stars.map((s) => <Repo {...s}/>)}
  </div>
);
