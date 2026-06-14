import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit2, Package, ShoppingBag } from "lucide-react";
import AppNavbar from "../AppNavbar";
import EditProfileForm from "../../pages/EditProfileForm";
import ProfileStatBox from "./ProfileStatBox";
import RentalCard from "./RentalCard";
import { useItems } from "../../hooks/useItems";
import { useUser } from "../../hooks/useUser";
import apiFetch from "../../api";

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(price);
}

export default function OwnProfile() {
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
                <img src={self.avatarB64} className="w-24 h-24 rounded-full object-cover"
                  style={{ border: "3px solid #E8DCFF" }} alt="avatar" />
              ) : (
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black"
                  style={{ background: "linear-gradient(135deg, #C9B8FF, #FFD6EC)", color: "#3D2F6B", border: "3px solid #E8DCFF" }}>
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(0,0,0,0.3)" }}>
                <Camera size={20} className="text-white" />
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-black" style={{ color: "#3D2F6B" }}>{self?.name || self?.username}</h1>
              <p className="text-sm mt-0.5" style={{ color: "#A89CC4" }}>@{self?.username}</p>
              {self?.city && <p className="text-sm mt-1" style={{ color: "#7B6AAA" }}>📍 {self.city}</p>}
              {self?.description && (
                <p className="text-sm mt-2 max-w-md leading-relaxed" style={{ color: "#7B6AAA" }}>{self.description}</p>
              )}
              <button onClick={() => setShowEdit(p => !p)} className="rp-btn-outline text-sm px-4 py-2 mt-4">
                <Edit2 size={14} /> {showEdit ? "Batal Edit" : "Edit Profil"}
              </button>
            </div>

            {/* Stats */}
            <div className="flex rounded-2xl overflow-hidden flex-shrink-0"
              style={{ border: "1px solid #E8DCFF", background: "#FAF8FF" }}>
              {[
                { label: "Barang",   value: items.length,              onClick: undefined },
                { label: "Disewa",   value: activeRentals.length || 0, onClick: undefined },
                { label: "Pengikut", value: self?.followers ?? 0,      onClick: () => navigate(`/profile/${userId}/followers`) },
                { label: "Diikuti",  value: self?.following ?? 0,      onClick: () => navigate(`/profile/${userId}/following`) },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex items-stretch">
                  <ProfileStatBox {...s} />
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
        <div className="flex gap-2 mb-6 p-1.5 rounded-2xl"
          style={{ background: "#FFFFFF", border: "1px solid #E8DCFF" }}>
          {[
            { id: "items",   label: `Barang Saya (${items.length})`, icon: <Package size={15} /> },
            { id: "renting", label: "Yang Sedang Saya Sewa",          icon: <ShoppingBag size={15} /> },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: tab === t.id ? "linear-gradient(135deg, #C9B8FF, #B09FEF)" : "transparent",
                color: tab === t.id ? "#3D2F6B" : "#A89CC4",
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
                <div key={item.id} className="rp-product-card cursor-pointer"
                  onClick={() => navigate(`/product/${item.id}`)}>
                  <div className="aspect-square overflow-hidden" style={{ background: "#E8DCFF" }}>
                    {item.image
                      ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                    }
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold line-clamp-1" style={{ color: "#3D2F6B" }}>{item.title}</h3>
                    <p className="text-sm font-black mt-0.5" style={{ color: "#9B87D9" }}>
                      {formatPrice(item.price_per_day || item.price)}
                      <span className="text-xs font-normal" style={{ color: "#A89CC4" }}>/hari</span>
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
              {activeRentals.map(r => <RentalCard key={r.id} r={r} />)}
            </div>
          )
        )}
      </main>
    </div>
  );
}
