import React from 'react';

const Card = ({ children }) => {
  return (
    <div className="card">
      {children}
    </div>
  );
};

const CardContent = ({ children }) => {
  return <div className="card-content">{children}</div>;
};

const CardHeader = ({ children }) => {
  return <div className="card-header">{children}</div>;
};

const CardTitle = ({ children }) => {
  return <h2 className="card-title">{children}</h2>;
};

const CardDescription = ({ children }) => {
  return <p className="card-description">{children}</p>;
};

const CardFooter = ({ children }) => {
  return <div className="card-footer">{children}</div>;
};

// Exporta todos los componentes
export { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter };
