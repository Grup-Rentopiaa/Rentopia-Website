import React from 'react';
import './Navbar.css'; // Jika kamu ingin memisahkan CSS-nya

const Navbar = () => {
  return (
    <header className="main-header">
      <div className="container">
        <h1 className="logo">RENTOPIA</h1>
        <nav>
          <ul>
            {/* Di React, nantinya href ini bisa diganti dengan <Link> dari react-router-dom */}
            <li><a href="#admin-panel">Admin</a></li>
            <li><a href="#user-panel">Rating</a></li>
            <li><a href="#log-panel">Riwayat</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;