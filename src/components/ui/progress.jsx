import React from 'react';

const Progress = ({ value }) => {
  return (
    <div className="progress">
      <div className="progress-bar" style={{ width: `${value}%` }} />
    </div>
  );
};

export default Progress;
