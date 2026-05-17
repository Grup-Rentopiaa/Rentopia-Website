import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Heart, Clock, Package, ShieldCheck, CheckCircle, RefreshCw, MessageCircle, Star } from "lucide-react";
import apiFetch from "../api";
import AppNavbar from "../components/AppNavbar";

const TYPE_META = {
  like:                { icon: <Heart size={18} />,         color: "#FFB3D9", bg: "#FFD6EC", label: "Wishlist" },
  return_reminder:     { icon: <Clock size={18} />,         color: "#FFA500", bg: "#FFF3CD", label: "Pengingat" },
  rental_request:      { icon: <Package size={18} />,       color: "#9B87D9", bg: "#E8DCFF", label: "Penyewaan" },
  guarantee_submitted: { icon: <ShieldCheck size={18} />,   color: "#2D7A55", bg: "#C9EFDC", label: "Jaminan" },
  item_received:       { icon: <CheckCircle size={18} />,   color: "#2660A4", bg: "#D6F0FF", label: "Diterima" },
  item_returned:       { icon: <RefreshCw size={18} />,     color: "#9B87D9", bg: "#E8DCFF", label: "Dikembalikan" },
  new_message:         { icon: <MessageCircle size={18} />, color: "#7B3F68", bg: "#FFD6EC", label: "Pesan" },
  review_submitted:    { icon: <Star size={18} />,          color: "#C9873D", bg: "#FFF3CD", label: "Ulasan" },
  general:             { icon: <Bell size={18} />,          color: "#9B87D9", bg: "#E8DCFF", label: "Info" },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        setLoading(true);
        const data = await apiFetch(`/api/notifications/${user.id}`);
        setNotifications(Array.isArray(data) ? data : []);
        // Mark all as read
        await apiFetch(`/api/notifications/${user.id}/read-all`, { method: "PUT" }).catch(() => {});
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  return (
    <div className="min-h-screen rp-page" style={{ background: "#FAF8FF" }}>
      <AppNavbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <button onClick={() => navigate(-1)} className="rp-back-btn mb-6">
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #C9B8FF, #FFD6EC)" }}>
            <Bell size={20} style={{ color: "#3D2F6B" }} />
          </div>
          <div>
            <h1 className="text-xl font-black" style={{ color: "#3D2F6B" }}>Notifikasi</h1>
            <p className="text-xs" style={{ color: "#A89CC4" }}>{notifications.length} notifikasi</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="rp-card p-4 flex gap-3">
                <div className="w-10 h-10 rounded-xl rp-skeleton flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="rp-skeleton h-4 w-3/4" />
                  <div className="rp-skeleton h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="rp-card py-20 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="font-black text-lg mb-2" style={{ color: "#3D2F6B" }}>Belum ada notifikasi</h3>
            <p className="text-sm" style={{ color: "#A89CC4" }}>Aktivitas terbaru akan muncul di sini</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => {
              const meta = TYPE_META[notif.type] || TYPE_META.general;
              return (
                <div
                  key={notif.id}
                  className="rp-card p-4 flex gap-3 cursor-default transition-all hover:shadow-md"
                  style={{ borderLeft: notif.is_read ? "3px solid transparent" : `3px solid ${meta.color}` }}
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: meta.bg, color: meta.color }}
                  >
                    {meta.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <span
                          className="text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full mb-1 inline-block"
                          style={{ background: meta.bg, color: meta.color }}
                        >
                          {meta.label}
                        </span>
                        <p className="text-sm leading-relaxed" style={{ color: "#3D2F6B" }}>
                          {notif.message}
                        </p>
                        <p className="text-xs mt-1" style={{ color: "#A89CC4" }}>
                          {timeAgo(notif.created_at)}
                        </p>
                      </div>
                      {/* Unread dot */}
                      {!notif.is_read && (
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1"
                          style={{ background: meta.color }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
