// components/Navbar.jsx
import React from 'react';

function Navbar() {
  const path = window.location.pathname;

  const isActive = (href) => {
    if (href === '/') {
      return path === '/' || path === '/index.html' || path === '';
    }
    return path.includes(href);
  };

  return (
    <nav className="navbar">
      <a href="/" className="navbar-brand">
        🏠 Rentopia
      </a>

      <ul className="navbar-links">
        <li>
          <a href="/" className={isActive('/') ? 'active' : ''}>
            🏠 Beranda
          </a>
        </li>
        <li>
          <a href="/upload.html" className={isActive('upload') ? 'active' : ''}>
            📤 Upload
          </a>
        </li>
        <li>
          <a href="/liked.html" className={isActive('liked') ? 'active' : ''}>
            ❤️ Disukai
          </a>
        </li>
        <li>
          <a href="/stats.html" className={isActive('stats') ? 'active' : ''}>
            📊 Statistik
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
