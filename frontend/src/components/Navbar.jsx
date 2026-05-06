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
    <nav className="bg-[#1d6bcf] text-white px-6 h-[60px] flex items-center justify-between sticky top-0 z-[100] shadow-md shadow-[#1d6bcf]/30">
      <a href="/" className="text-[22px] font-bold text-white no-underline tracking-tight">
        🏠 Rentopia
      </a>

      <ul className="flex items-center gap-1 list-none m-0 p-0">
        <li>
          <a href="/" className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/') ? 'bg-white/20 text-white' : 'text-white/85 hover:bg-white/15 hover:text-white'}`}>
            🏠 Beranda
          </a>
        </li>
        <li>
          <a href="/upload" className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('upload') ? 'bg-white/20 text-white' : 'text-white/85 hover:bg-white/15 hover:text-white'}`}>
            📤 Upload
          </a>
        </li>
        <li>
          <a href="/liked" className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('liked') ? 'bg-white/20 text-white' : 'text-white/85 hover:bg-white/15 hover:text-white'}`}>
            ❤️ Disukai
          </a>
        </li>
        <li>
          <a href="/stats" className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('stats') ? 'bg-white/20 text-white' : 'text-white/85 hover:bg-white/15 hover:text-white'}`}>
            📊 Statistik
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
