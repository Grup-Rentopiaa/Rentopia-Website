import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Heart, Bell, MessageCircle, User, LogOut,
  Search, Upload, ChevronDown, Home, BarChart2,
} from "lucide-react";
import apiFetch from "../api";

export default function AppNavbar({ wishlistCount = 0, searchValue = "" }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount,  setUnreadCount]  = useState(0);
  const [localSearch,  setLocalSearch]  = useState(searchValue);
  const dropRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchUnread = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await apiFetch(`/api/notifications/${user.id}/unread-count`);
      setUnreadCount(data?.count || 0);
    } catch {}
  }, [user?.id]);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  function handleLogout() {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser?.id) {
      localStorage.removeItem(`rentopia_wishlist_${storedUser.id}`);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    apiFetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    navigate("/", { replace: true });
  }

  function handleSearchKeyDown(e) {
    if (e.key === "Enter" && localSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(localSearch.trim())}`);
    }
  }

  function handleSearchButtonClick() {
    if (localSearch.trim()) navigate(`/search?q=${encodeURIComponent(localSearch.trim())}`);
  }

  const initials = (user?.username || user?.name || "U")[0].toUpperCase();

  return (
    <nav style={{
      background: '#7C4DFF',
      borderBottom: '1px solid rgba(255,255,255,0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

        <Link to="/home" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.2)' }}>
            <img src="/logo.png" alt="Logo" />
          </div>
          <span className="text-lg font-black hidden sm:block text-white" style={{letterSpacing: '-0.5px'}}>
            Rentopia
          </span>
        </Link>

        <div className="flex-1 max-w-lg">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'rgba(255,255,255,0.6)' }} />
            <input
  id="navbar-search-input"
  type="text"
  placeholder="Cari barang atau pengguna..."
  value={localSearch}
  onChange={e => setLocalSearch(e.target.value)}
  onKeyDown={handleSearchKeyDown}
  className="w-full pl-10 pr-12 py-2.5 text-sm rounded-xl outline-none"
  style={{
    background: '#fff',
    border: 'none',
    color: '#3D2F6B',
  }}
/>
            <button
              id="navbar-search-btn"
              onClick={handleSearchButtonClick}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.25)', color: '#fff' }}
            >
              <Search size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          {[
            { icon: <Home size={20} />, onClick: () => navigate("/home"), title: "Beranda" },
            { icon: <MessageCircle size={20} />, onClick: () => navigate("/chat"), title: "Pesan" },
            { icon: <Upload size={20} />, onClick: () => navigate("/upload"), title: "Upload" },
          ].map((btn, i) => (
            <button key={i} onClick={btn.onClick} title={btn.title}
              className="p-2 rounded-xl transition-colors"
              style={{ color: 'rgba(255,255,255,0.85)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              {btn.icon}
            </button>
          ))}

          <button onClick={() => navigate("/wishlist")}
            className="relative p-2 rounded-xl transition-colors"
            style={{ color: 'rgba(255,255,255,0.85)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center"
                style={{ background: "#FFB3D9", color: "#7B3F68" }}>
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </button>

          <button id="navbar-bell-btn"
            onClick={() => { navigate("/notifications"); setUnreadCount(0); }}
            className="relative p-2 rounded-xl transition-colors"
            style={{ color: 'rgba(255,255,255,0.85)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center"
                style={{ background: "#FFB3D9", color: "#7B3F68" }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <div className="relative" ref={dropRef}>
            <button id="navbar-user-menu-btn"
              onClick={() => setDropdownOpen(v => !v)}
              className="flex items-center gap-2 ml-1 px-3 py-2 rounded-xl transition-colors"
              style={{ background: dropdownOpen ? 'rgba(255,255,255,0.2)' : 'transparent' }}
              onMouseEnter={e => { if (!dropdownOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
              onMouseLeave={e => { if (!dropdownOpen) e.currentTarget.style.background = 'transparent' }}>
              {user?.avatarB64 ? (
  <img src={user.avatarB64} className="w-7 h-7 rounded-full object-cover" alt="avatar"
    style={{ border: '2px solid rgba(255,255,255,0.4)' }} />
) : (
  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
    style={{ background: 'rgba(255,255,255,0.3)', color: '#fff' }}>
    {initials}
  </div>
)}
              <span className="text-sm font-bold hidden sm:block text-white">
                {user?.username || "Pengguna"}
              </span>
              <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.7)' }} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 py-2 z-50 rounded-2xl"
                style={{ background: '#fff', boxShadow: "0 8px 32px rgba(124,77,255,0.25)", border: '1px solid #E8DCFF' }}>
                <div className="px-4 py-2 border-b" style={{ borderColor: "#E8DCFF" }}>
                  <p className="font-bold text-sm" style={{ color: "#3D2F6B" }}>{user?.username}</p>
                  <p className="text-xs" style={{ color: "#A89CC4" }}>{user?.email}</p>
                  {user?.isAdmin && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full mt-1 inline-block"
                      style={{ background: "#C9EFDC", color: "#2D7A55" }}>Admin</span>
                  )}
                </div>

                <button id="navbar-profile-btn"
                  onClick={() => { navigate("/profile"); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-left"
                  style={{ color: "#7B6AAA" }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F3EEFF'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <User size={16} /> Profil
                </button>

                {user?.isAdmin && (
                  <button onClick={() => { navigate("/admin/visitors"); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-left"
                    style={{ color: "#2D7A55" }}
                    onMouseEnter={e => e.currentTarget.style.background = '#C9EFDC'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <BarChart2 size={16} /> Visitor Analytics
                  </button>
                )}

                <div className="border-t mt-1 pt-1" style={{ borderColor: "#E8DCFF" }}>
                  <button id="navbar-logout-btn" onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-left"
                    style={{ color: "#FF8FC5" }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FFD6EC'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <LogOut size={16} /> Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}