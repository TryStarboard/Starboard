import React from 'react';

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

export { Tag as default };
