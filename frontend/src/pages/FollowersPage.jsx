import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UserMinus } from "lucide-react";
import apiFetch from "../api";
import AppNavbar from "../components/AppNavbar";

function getAvatarColor(name = "") {
  const colors = ["#C9B8FF","#FFD6EC","#D6F0FF","#C9EFDC","#FFB3D9","#A8DAFF"];
  let h = 0; for (let i = 0; i < name.length; i++) h += name.charCodeAt(i);
  return colors[h % colors.length];
}

function UserListCard({ user, onRemove, removeLabel }) {
  const navigate = useNavigate();
  const initials = (user.name || user.username || "?")[0].toUpperCase();
  const color = getAvatarColor(user.username || "");
  const [confirm, setConfirm] = useState(false);
  const [removing, setRemoving] = useState(false);

  async function handleRemove() {
    if (!confirm) { setConfirm(true); return; }
    setRemoving(true);
    try { await onRemove(user.id); }
    finally { setRemoving(false); setConfirm(false); }
  }

  return (
    <div className="rp-card p-4 flex items-center gap-4">
      {user.avatarB64 ? (
        <img src={user.avatarB64} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" style={{ border: "2px solid #E8DCFF" }} alt="av" />
      ) : (
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0"
          style={{ background: color, color: "#3D2F6B", border: "2px solid #E8DCFF" }}>
          {initials}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-black text-sm truncate" style={{ color: "#3D2F6B" }}>{user.name || user.username}</p>
        <p className="text-xs" style={{ color: "#A89CC4" }}>@{user.username}</p>
        <p className="text-xs mt-0.5" style={{ color: "#9B87D9" }}>{user.followers ?? 0} pengikut</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button onClick={() => navigate(`/profile/${user.id}`)} className="rp-btn-outline text-xs px-3 py-2">
          Lihat Profil
        </button>
        {onRemove && (
          <button
            onClick={handleRemove}
            disabled={removing}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-bold transition-all"
            style={{
              background: confirm ? "#FFD6EC" : "#FFF0F5",
              color: confirm ? "#9B4070" : "#FFB3D9",
              border: "1px solid #FFB3D9"
            }}
          >
            <UserMinus size={13} />
            {removing ? "..." : confirm ? "Yakin hapus?" : (removeLabel || "Hapus")}
          </button>
        )}
      </div>
    </div>
  );
}

export default function FollowersPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
  const isOwn = loggedInUser?.id === parseInt(userId);

  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiFetch(`/api/profile/${userId}/followers`),
      apiFetch(`/api/users/${userId}`),
    ]).then(([fl, u]) => {
      setFollowers(Array.isArray(fl) ? fl : []);
      setProfileName(u?.name || u?.username || "");
    }).catch(() => {}).finally(() => setLoading(false));
  }, [userId]);

  async function handleRemoveFollower(followerId) {
    await apiFetch(`/api/profile/${userId}/followers/${followerId}`, { method: "DELETE" });
    setFollowers(prev => prev.filter(u => u.id !== followerId));
  }

  return (
    <div className="min-h-screen rp-page" style={{ background: "#FAF8FF" }}>
      <AppNavbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="rp-back-btn mb-6">
          <ArrowLeft size={16} /> Kembali
        </button>
        <h1 className="text-xl font-black mb-1" style={{ color: "#3D2F6B" }}>
          {isOwn ? "Pengikutmu" : `Pengikut @${profileName}`}
        </h1>
        <p className="text-sm mb-6" style={{ color: "#A89CC4" }}>{followers.length} orang mengikuti</p>

        {loading ? (
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => <div key={i} className="rp-skeleton h-20 rounded-2xl" />)}
          </div>
        ) : followers.length === 0 ? (
          <div className="rp-card py-16 text-center">
            <div className="text-4xl mb-3">👥</div>
            <p className="font-bold" style={{ color: "#3D2F6B" }}>Belum ada pengikut</p>
          </div>
        ) : (
          <div className="space-y-3">
            {followers.map(u => (
              <UserListCard
                key={u.id}
                user={u}
                onRemove={isOwn ? handleRemoveFollower : null}
                removeLabel="Hapus Pengikut"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
