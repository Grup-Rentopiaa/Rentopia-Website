import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Heart, Bell, MessageCircle, User, LogOut,
  Search, Upload, ChevronDown, Home,
} from "lucide-react";
import apiFetch from "../api";

export default function AppNavbar({ wishlistCount = 0, searchValue = "" }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount,  setUnreadCount]  = useState(0);
  const [localSearch,  setLocalSearch]  = useState(searchValue);
  const dropRef = useRef(null);

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    function handler(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch unread notification count
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
    // Pakai apiFetch supaya base URL konsisten
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
    <nav className="rp-navbar">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
            style={{ background: "linear-gradient(135deg, #C9B8FF, #FFD6EC)" }}>
            R
          </div>
          <span className="text-lg font-black hidden sm:block" style={{ color: "#9B87D9" }}>
            Rentopia
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#C9B8FF" }} />
            <input
              id="navbar-search-input"
              type="text"
              placeholder="Cari barang atau pengguna..."
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="rp-input pl-10 pr-12 py-2.5 text-sm"
            />
            <button
              id="navbar-search-btn"
              onClick={handleSearchButtonClick}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: "linear-gradient(135deg, #C9B8FF, #B09FEF)", color: "#3D2F6B" }}
              title="Cari"
            >
              <Search size={14} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto">
          <button onClick={() => navigate("/home")}
            className="p-2 rounded-xl transition-colors hover:bg-rp-primary-lt"
            title="Beranda" style={{ color: "#9B87D9" }}>
            <Home size={20} />
          </button>

          <button onClick={() => navigate("/wishlist")}
            className="relative p-2 rounded-xl transition-colors hover:bg-rp-primary-lt"
            title="Wishlist" style={{ color: "#9B87D9" }}>
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center"
                style={{ background: "#FFB3D9", color: "#7B3F68" }}>
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </button>

          <button
            id="navbar-bell-btn"
            onClick={() => { navigate("/notifications"); setUnreadCount(0); }}
            className="relative p-2 rounded-xl transition-colors hover:bg-rp-primary-lt"
            title="Notifikasi" style={{ color: "#9B87D9" }}>
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center"
                style={{ background: "#FFB3D9", color: "#7B3F68" }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <button onClick={() => navigate("/chat")}
            className="p-2 rounded-xl transition-colors hover:bg-rp-primary-lt"
            title="Pesan" style={{ color: "#9B87D9" }}>
            <MessageCircle size={20} />
          </button>

          <button onClick={() => navigate("/upload")}
            className="p-2 rounded-xl transition-colors hover:bg-rp-primary-lt"
            title="Upload Produk" style={{ color: "#9B87D9" }}>
            <Upload size={20} />
          </button>

          {/* User dropdown */}
          <div className="relative" ref={dropRef}>
            <button
              id="navbar-user-menu-btn"
              onClick={() => setDropdownOpen(v => !v)}
              className="flex items-center gap-2 ml-1 px-3 py-2 rounded-xl transition-colors"
              style={{ background: dropdownOpen ? "#E8DCFF" : "transparent" }}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                style={{ background: "#C9B8FF", color: "#3D2F6B" }}>
                {initials}
              </div>
              <span className="text-sm font-bold hidden sm:block" style={{ color: "#7B6AAA" }}>
                {user?.username || "Pengguna"}
              </span>
              <ChevronDown size={14} style={{ color: "#A89CC4" }} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 rp-card py-2 z-50"
                style={{ boxShadow: "0 8px 32px rgba(180,150,255,0.2)" }}>
                <div className="px-4 py-2 border-b" style={{ borderColor: "#E8DCFF" }}>
                  <p className="font-bold text-sm" style={{ color: "#3D2F6B" }}>{user?.username}</p>
                  <p className="text-xs" style={{ color: "#A89CC4" }}>{user?.email}</p>
                </div>
                <button
                  id="navbar-profile-btn"
                  onClick={() => { navigate("/profile"); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-left transition-colors hover:bg-rp-primary-lt"
                  style={{ color: "#7B6AAA" }}
                >
                  <User size={16} /> Profil
                </button>
                <div className="border-t mt-1 pt-1" style={{ borderColor: "#E8DCFF" }}>
                  <button
                    id="navbar-logout-btn"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-left transition-colors"
                    style={{ color: "#FF8FC5" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FFD6EC"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
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
