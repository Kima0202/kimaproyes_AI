import React from 'react';

const Button = ({ onClick, children, variant = 'default' }) => {
  return (
    <button className={`btn ${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button; // Asegúrate de que esta línea esté presente
