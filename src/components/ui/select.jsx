import React from 'react';

const Select = ({ children }) => {
  return <select className="select">{children}</select>;
};

const SelectTrigger = ({ children }) => {
  return <option>{children}</option>;
};

const SelectValue = ({ children }) => {
  return <span>{children}</span>;
};

const SelectContent = ({ children }) => {
  return <div className="select-content">{children}</div>;
};

const SelectItem = ({ children }) => {
  return <div className="select-item">{children}</div>;
};


export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
