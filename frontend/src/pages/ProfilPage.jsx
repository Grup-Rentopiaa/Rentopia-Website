import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UserPlus, UserMinus, MessageCircle, Package, ShoppingBag } from "lucide-react";
import { useProfile }  from "../hooks/useProfile";
import { useItems }    from "../hooks/useItems";
import { useRentals }  from "../hooks/useRentals";
import AppNavbar from "../components/AppNavbar";

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
}

function getAvatarColor(name = "") {
  const colors = ["#C9B8FF","#FFD6EC","#D6F0FF","#C9EFDC","#FFB3D9","#A8DAFF"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

export default function ProfilPage() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const loggedInUserId = JSON.parse(localStorage.getItem("user") || "null")?.id;
  const [tab, setTab] = useState("items");

  // If viewing own profile, redirect to dashboard
  useEffect(() => {
    if (!id || parseInt(id) === loggedInUserId) {
      navigate("/dashboard", { replace: true });
    }
  }, [id, navigate, loggedInUserId]);

  const profileId = id ? parseInt(id) : null;
  const { profile: user, loading, error, isFollowing, followLoading, toggleFollow } = useProfile(profileId, loggedInUserId);
  const { items }   = useItems(profileId);
  const { rentals } = useRentals(profileId);

  if (!profileId || profileId === loggedInUserId) return null;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAF8FF" }}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-full rp-skeleton mx-auto mb-4" />
        <div className="rp-skeleton h-4 w-32 mx-auto mb-2" />
        <div className="rp-skeleton h-3 w-24 mx-auto" />
      </div>
    </div>
  );

  if (error || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAF8FF" }}>
      <div className="rp-card p-10 text-center">
        <div className="text-5xl mb-3">😢</div>
        <h3 className="font-black" style={{ color: "#3D2F6B" }}>Profil Tidak Ditemukan</h3>
        <button onClick={() => navigate(-1)} className="rp-btn-primary mt-4">Kembali</button>
      </div>
    </div>
  );

  const initials = (user?.name || user?.username || "?")[0].toUpperCase();
  const avatarColor = getAvatarColor(user?.name || user?.username || "");

  function startChat() {
    localStorage.setItem("targetChatId", String(profileId));
    navigate("/chat");
  }

  return (
    <div className="min-h-screen rp-page" style={{ background: "#FAF8FF" }}>
      <AppNavbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="rp-back-btn mb-6">
          <ArrowLeft size={16} /> Kembali
        </button>

        {/* Profile Card */}
        <div className="rp-card p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl font-black" style={{ background: avatarColor, color: "#3D2F6B", border: "3px solid #E8DCFF" }}>
              {initials}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-black" style={{ color: "#3D2F6B" }}>{user.name || user.username}</h1>
              <p className="text-sm mt-0.5" style={{ color: "#A89CC4" }}>@{user.username}</p>
              {user.city && <p className="text-sm mt-1" style={{ color: "#7B6AAA" }}>📍 {user.city}</p>}
              {user.description && <p className="text-sm mt-2 leading-relaxed max-w-md" style={{ color: "#7B6AAA" }}>{user.description}</p>}

              {/* Stats */}
              <div className="flex gap-6 mt-4">
                <div>
                  <p className="text-xl font-black" style={{ color: "#9B87D9" }}>{items.length}</p>
                  <p className="text-xs" style={{ color: "#A89CC4" }}>Barang</p>
                </div>
                <div>
                  <p className="text-xl font-black" style={{ color: "#9B87D9" }}>{user.followers ?? 0}</p>
                  <p className="text-xs" style={{ color: "#A89CC4" }}>Pengikut</p>
                </div>
                <div>
                  <p className="text-xl font-black" style={{ color: "#9B87D9" }}>{user.following ?? 0}</p>
                  <p className="text-xs" style={{ color: "#A89CC4" }}>Mengikuti</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={toggleFollow}
                  disabled={followLoading}
                  className={isFollowing ? "rp-btn-outline" : "rp-btn-primary"}
                >
                  {followLoading ? "⏳" : isFollowing ? <><UserMinus size={15} /> Unfollow</> : <><UserPlus size={15} /> Follow</>}
                </button>
                <button onClick={startChat} className="rp-btn-pink">
                  <MessageCircle size={15} /> Chat
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1.5 rounded-2xl mb-6" style={{ background: "#FFFFFF", border: "1px solid #E8DCFF" }}>
          {[
            { id: "items",   label: `Barang (${items.length})`,   icon: <Package size={14} /> },
            { id: "rentals", label: `Disewa (${rentals.length})`, icon: <ShoppingBag size={14} /> },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: tab === t.id ? "linear-gradient(135deg, #C9B8FF, #B09FEF)" : "transparent", color: tab === t.id ? "#3D2F6B" : "#A89CC4" }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {tab === "items" && (
          items.length === 0 ? (
            <div className="rp-card py-16 text-center">
              <div className="text-5xl mb-3">📦</div>
              <p className="font-bold" style={{ color: "#3D2F6B" }}>Belum ada barang</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {items.map(item => (
                <div key={item.id} className="rp-product-card cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                  <div className="aspect-square overflow-hidden" style={{ background: "#E8DCFF" }}>
                    {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold line-clamp-1" style={{ color: "#3D2F6B" }}>{item.title}</h3>
                    <p className="text-sm font-black" style={{ color: "#9B87D9" }}>{formatPrice(item.price_per_day || item.price)}<span className="text-xs font-normal" style={{ color: "#A89CC4" }}>/hari</span></p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
        {tab === "rentals" && (
          rentals.length === 0 ? (
            <div className="rp-card py-16 text-center">
              <div className="text-5xl mb-3">🛍️</div>
              <p className="font-bold" style={{ color: "#3D2F6B" }}>Belum ada rental aktif</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rentals.map(r => (
                <div key={r.id} className="rp-card p-4 flex gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#E8DCFF" }}>
                    {r.image ? <img src={r.image} alt={r.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: "#3D2F6B" }}>{r.title}</h3>
                    <p className="text-xs" style={{ color: "#9B87D9" }}>{formatPrice(r.price)}/hari</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}