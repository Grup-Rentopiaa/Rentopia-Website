import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, UserMinus, MessageCircle } from "lucide-react";
import AppNavbar from "../AppNavbar";
import { useProfile } from "../../hooks/useProfile";
import { useItems } from "../../hooks/useItems";

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(price);
}

function getAvatarColor(name = "") {
  const colors = ["#C9B8FF", "#FFD6EC", "#D6F0FF", "#C9EFDC", "#FFB3D9", "#A8DAFF"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

export default function OtherProfile({ profileId, loggedInUserId }) {
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
            <div className="flex-shrink-0">
              {user.avatarB64 ? (
                <img src={user.avatarB64} alt={user.username}
                  className="w-24 h-24 rounded-2xl object-cover"
                  style={{ border: "3px solid #E8DCFF" }} />
              ) : (
                <div className="w-24 h-24 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl font-black"
                  style={{ background: avatarColor, color: "#3D2F6B", border: "3px solid #E8DCFF" }}>
                  {initials}
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-black" style={{ color: "#3D2F6B" }}>{user.name || user.username}</h1>
              <p className="text-sm mt-0.5" style={{ color: "#A89CC4" }}>@{user.username}</p>
              {user.city && <p className="text-sm mt-1" style={{ color: "#7B6AAA" }}>📍 {user.city}</p>}
              {user.description && (
                <p className="text-sm mt-2 leading-relaxed max-w-md" style={{ color: "#7B6AAA" }}>{user.description}</p>
              )}

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
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-5">
                <button onClick={toggleFollow} disabled={followLoading}
                  className={isFollowing ? "rp-btn-outline" : "rp-btn-primary"}>
                  {followLoading ? "⏳" : isFollowing
                    ? <><UserMinus size={15} /> Unfollow</>
                    : <><UserPlus size={15} /> Follow</>
                  }
                </button>
                <button onClick={startChat} className="rp-btn-pink">
                  <MessageCircle size={15} /> Chat
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <h2 className="font-black mb-4" style={{ color: "#3D2F6B" }}>Barang ({items.length})</h2>
        {items.length === 0 ? (
          <div className="rp-card py-16 text-center">
            <div className="text-5xl mb-3">📦</div>
            <p className="font-bold" style={{ color: "#3D2F6B" }}>Belum ada barang</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
                  <p className="text-sm font-black" style={{ color: "#9B87D9" }}>
                    {formatPrice(item.price_per_day || item.price)}
                    <span className="text-xs font-normal" style={{ color: "#A89CC4" }}>/hari</span>
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
