import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UserPlus, UserMinus, MessageCircle, Package, ShoppingBag, Camera, Edit2 } from "lucide-react";
import { useProfile }  from "../hooks/useProfile";
import { useItems }    from "../hooks/useItems";
import { useUser }     from "../hooks/useUser";
import AppNavbar from "../components/AppNavbar";
import EditProfileForm from "./EditProfileForm";
import apiFetch from "../api";

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price);
}

function getAvatarColor(name = "") {
  const colors = ["#C9B8FF","#FFD6EC","#D6F0FF","#C9EFDC","#FFB3D9","#A8DAFF"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

// ── OWN PROFILE ──────────────────────────────────────────────────────────────
function OwnProfile() {
  const navigate = useNavigate();
  const { user: self, updateUser, userId } = useUser();
  const { items, loading: iLoad } = useItems(userId);
  const [tab, setTab] = useState("items");
  const [showEdit, setShowEdit] = useState(false);
  const [activeRentals, setActiveRentals] = useState([]);
  const [rentalsLoading, setRentalsLoading] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const fileRef = useRef();

  useEffect(() => {
    if (!userId) return;
    const list = JSON.parse(localStorage.getItem(`rentopia_wishlist_${userId}`) || "[]");
    setWishlistCount(list.length);
  }, [userId]);

  useEffect(() => {
    if (tab !== "renting" || !userId) return;
    setRentalsLoading(true);
    apiFetch(`/api/rental/active/${userId}`)
      .then(data => setActiveRentals(Array.isArray(data) ? data : []))
      .catch(() => setActiveRentals([]))
      .finally(() => setRentalsLoading(false));
  }, [tab, userId]);

  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async ev => { await updateUser({ avatarB64: ev.target.result }); };
    reader.readAsDataURL(file);
  }

  const initials = (self?.name || self?.username || "?")[0]?.toUpperCase();

  const StatBox = ({ label, value, onClick }) => (
    <div
      className={`flex flex-col items-center px-5 py-4 ${onClick ? "cursor-pointer hover:bg-purple-50 transition-colors" : ""}`}
      onClick={onClick}
    >
      <p className="text-2xl font-black" style={{ color: "#9B87D9" }}>{value}</p>
      <p className="text-xs font-semibold mt-0.5" style={{ color: "#A89CC4" }}>{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen rp-page" style={{ background: "#FAF8FF" }}>
      <AppNavbar wishlistCount={wishlistCount} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="rp-card p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative group cursor-pointer flex-shrink-0" onClick={() => fileRef.current?.click()}>
              {self?.avatarB64 ? (
                <img src={self.avatarB64} className="w-24 h-24 rounded-2xl object-cover" style={{ border: "3px solid #E8DCFF" }} alt="avatar" />
              ) : (
                <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-black" style={{ background: "linear-gradient(135deg, #C9B8FF, #FFD6EC)", color: "#3D2F6B", border: "3px solid #E8DCFF" }}>
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.3)" }}>
                <Camera size={20} className="text-white" />
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-black" style={{ color: "#3D2F6B" }}>{self?.name || self?.username}</h1>
              <p className="text-sm mt-0.5" style={{ color: "#A89CC4" }}>@{self?.username}</p>
              {self?.city && <p className="text-sm mt-1" style={{ color: "#7B6AAA" }}>📍 {self.city}</p>}
              {self?.description && <p className="text-sm mt-2 max-w-md leading-relaxed" style={{ color: "#7B6AAA" }}>{self.description}</p>}
              <button onClick={() => setShowEdit(p => !p)} className="rp-btn-outline text-sm px-4 py-2 mt-4">
                <Edit2 size={14} /> {showEdit ? "Batal Edit" : "Edit Profil"}
              </button>
            </div>

            {/* Stats — 4 stats for own profile */}
            <div className="flex rounded-2xl overflow-hidden flex-shrink-0" style={{ border: "1px solid #E8DCFF", background: "#FAF8FF" }}>
              {[
                { label: "Barang",   value: items.length, onClick: undefined },
                { label: "Disewa",   value: activeRentals.length || 0, onClick: undefined },
                { label: "Pengikut", value: self?.followers ?? 0, onClick: () => navigate(`/profile/${userId}/followers`) },
                { label: "Diikuti",  value: self?.following ?? 0, onClick: () => navigate(`/profile/${userId}/following`) },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex items-stretch">
                  <StatBox {...s} />
                  {i < arr.length - 1 && <div className="w-px my-3" style={{ background: "#E8DCFF" }} />}
                </div>
              ))}
            </div>
          </div>

          {showEdit && (
            <div className="mt-6 border-t pt-6" style={{ borderColor: "#E8DCFF" }}>
              <EditProfileForm
                user={self}
                onSave={async data => { await updateUser(data); setShowEdit(false); }}
                onCancel={() => setShowEdit(false)}
              />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1.5 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid #E8DCFF" }}>
          {[
            { id: "items",   label: `Barang Saya (${items.length})`,      icon: <Package size={15} /> },
            { id: "renting", label: `Yang Sedang Saya Sewa`,               icon: <ShoppingBag size={15} /> },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: tab === t.id ? "linear-gradient(135deg, #C9B8FF, #B09FEF)" : "transparent",
                color: tab === t.id ? "#3D2F6B" : "#A89CC4"
              }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* Tab: Barang Saya */}
        {tab === "items" && (
          iLoad ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(4).fill(0).map((_, i) => <div key={i} className="rp-skeleton h-48 rounded-2xl" />)}
            </div>
          ) : items.length === 0 ? (
            <div className="rp-card py-16 text-center">
              <div className="text-5xl mb-3">📦</div>
              <p className="font-bold" style={{ color: "#3D2F6B" }}>Belum ada barang</p>
              <button onClick={() => navigate("/upload")} className="rp-btn-primary mt-4 text-sm">Upload Produk</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map(item => (
                <div key={item.id} className="rp-product-card cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                  <div className="aspect-square overflow-hidden" style={{ background: "#E8DCFF" }}>
                    {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold line-clamp-1" style={{ color: "#3D2F6B" }}>{item.title}</h3>
                    <p className="text-sm font-black mt-0.5" style={{ color: "#9B87D9" }}>
                      {formatPrice(item.price_per_day || item.price)}<span className="text-xs font-normal" style={{ color: "#A89CC4" }}>/hari</span>
                    </p>
                    <span className={`rp-badge mt-1.5 text-[10px] ${item.status === "rented" ? "rp-badge-pink" : "rp-badge-mint"}`}>
                      {item.status === "rented" ? "Disewa" : "Tersedia"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Tab: Yang Sedang Saya Sewa */}
        {tab === "renting" && (
          rentalsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array(3).fill(0).map((_, i) => <div key={i} className="rp-skeleton h-32 rounded-2xl" />)}
            </div>
          ) : activeRentals.length === 0 ? (
            <div className="rp-card py-16 text-center">
              <div className="text-5xl mb-3">🛍️</div>
              <p className="font-bold" style={{ color: "#3D2F6B" }}>Tidak ada rental aktif</p>
              <button onClick={() => navigate("/home")} className="rp-btn-primary mt-4 text-sm">Cari Produk</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeRentals.map(r => {
                const daysLeft = r.daysLeft;
                const urgent = daysLeft !== null && daysLeft <= 1;
                return (
                  <div key={r.id} className="rp-card p-4 flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#E8DCFF" }}>
                      {r.item?.image ? <img src={r.item.image} alt={r.item.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm line-clamp-1" style={{ color: "#3D2F6B" }}>{r.item?.title || "—"}</h3>
                      <p className="text-xs mt-0.5" style={{ color: "#A89CC4" }}>dari {r.seller?.username || "—"}</p>
                      {r.rentalCode && <p className="text-xs font-bold mt-1" style={{ color: "#9B87D9" }}>{r.rentalCode}</p>}
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`rp-badge text-[10px] ${urgent ? "rp-badge-pink" : "rp-badge-blue"}`}>
                          {daysLeft !== null ? (urgent ? `⚠️ ${daysLeft} hari lagi` : `${daysLeft} hari lagi`) : "Aktif"}
                        </span>
                      </div>
                      {r.endDate && (
                        <p className="text-[10px] mt-1" style={{ color: "#A89CC4" }}>
                          Berakhir: {new Date(r.endDate).toLocaleDateString("id-ID")}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </main>
    </div>
  );
}

// ── OTHER USER'S PROFILE ─────────────────────────────────────────────────────
function OtherProfile({ profileId, loggedInUserId }) {
  const navigate = useNavigate();
  const { profile: user, loading, error, isFollowing, followLoading, toggleFollow } = useProfile(profileId, loggedInUserId);
  const { items } = useItems(profileId);

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
        <button onClick={() => navigate(-1)} className="rp-back-btn mb-6">
          <ArrowLeft size={16} /> Kembali
        </button>

        {/* Profile Card */}
        <div className="rp-card p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl font-black" style={{ background: avatarColor, color: "#3D2F6B", border: "3px solid #E8DCFF" }}>
              {initials}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-black" style={{ color: "#3D2F6B" }}>{user.name || user.username}</h1>
              <p className="text-sm mt-0.5" style={{ color: "#A89CC4" }}>@{user.username}</p>
              {user.city && <p className="text-sm mt-1" style={{ color: "#7B6AAA" }}>📍 {user.city}</p>}
              {user.description && <p className="text-sm mt-2 leading-relaxed max-w-md" style={{ color: "#7B6AAA" }}>{user.description}</p>}

              {/* Stats — 2 stats only for other users */}
              <div className="flex gap-6 mt-4">
                <div>
                  <p className="text-xl font-black" style={{ color: "#9B87D9" }}>{items.length}</p>
                  <p className="text-xs" style={{ color: "#A89CC4" }}>Barang</p>
                </div>
                <div>
                  <p className="text-xl font-black" style={{ color: "#9B87D9" }}>{user.followers ?? 0}</p>
                  <p className="text-xs" style={{ color: "#A89CC4" }}>Pengikut</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-5">
                <button onClick={toggleFollow} disabled={followLoading} className={isFollowing ? "rp-btn-outline" : "rp-btn-primary"}>
                  {followLoading ? "⏳" : isFollowing ? <><UserMinus size={15} /> Unfollow</> : <><UserPlus size={15} /> Follow</>}
                </button>
                <button onClick={startChat} className="rp-btn-pink">
                  <MessageCircle size={15} /> Chat
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid — no tabs for other user */}
        <h2 className="font-black mb-4" style={{ color: "#3D2F6B" }}>Barang ({items.length})</h2>
        {items.length === 0 ? (
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
                  <p className="text-sm font-black" style={{ color: "#9B87D9" }}>
                    {formatPrice(item.price_per_day || item.price)}<span className="text-xs font-normal" style={{ color: "#A89CC4" }}>/hari</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function ProfilPage() {
  const { id } = useParams();
  const loggedInUserId = JSON.parse(localStorage.getItem("user") || "null")?.id;
  const profileId = id ? parseInt(id) : null;
  const isOwn = !profileId || profileId === loggedInUserId;

  if (isOwn) return <OwnProfile />;
  return <OtherProfile profileId={profileId} loggedInUserId={loggedInUserId} />;
}