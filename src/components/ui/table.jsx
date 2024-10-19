import React from 'react';

const Table = ({ children }) => {
  return <table className="table">{children}</table>;
};

const TableHeader = ({ children }) => {
  return <thead>{children}</thead>;
};

const TableBody = ({ children }) => {
  return <tbody>{children}</tbody>;
};

const TableRow = ({ children }) => {
  return <tr>{children}</tr>;
};

const TableCell = ({ children }) => {
  return <td>{children}</td>;
};


export { Table, TableHeader, TableBody, TableRow, TableCell };
