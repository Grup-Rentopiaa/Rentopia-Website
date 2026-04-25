import React from 'react';
import './Card.css';

// Komponen Card menerima 'title' dan 'children' (isi kontennya)
const Card = ({ title, children }) => {
  return (
    <div className="module-section">
      <h3>{title}</h3>
      <div className="card">
        {children}
      </div>
    </div>
  );
};

export default Card;