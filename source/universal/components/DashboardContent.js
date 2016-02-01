import React, { Component } from 'react';

const Repo = ({full_name}) => (
  <div className="">{full_name}</div>
);

export default ({stars}) => (
  <div className='dashboard'>
    {stars.map((s) => <Repo {...s}/>)}
  </div>
);
