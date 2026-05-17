import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Eye, MapPin, Star, MessageCircle, ShoppingBag, Package, Tag, Calendar, User } from "lucide-react";
import { getItemByIdService, likeItemService, deleteItemService } from "../services/itemService";
import apiFetch from "../api";
import AppNavbar from "../components/AppNavbar";

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price);
}

function StarRating({ value, onChange, size = 28 }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button"
          onClick={() => onChange && onChange(s)}
          onMouseEnter={() => onChange && setHover(s)}
          onMouseLeave={() => onChange && setHover(0)}
          style={{ fontSize: size, lineHeight: 1, cursor: onChange ? "pointer" : "default" }}>
          <span style={{ color: s <= (hover || value) ? "#FFB3D9" : "#E8DCFF" }}>★</span>
        </button>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem("user") || "null");
  const wishlistKey = user ? `rentopia_wishlist_${user.id}` : null;
  const wishlist  = wishlistKey ? JSON.parse(localStorage.getItem(wishlistKey) || "[]") : [];

  const [item,      setItem]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [liked,     setLiked]     = useState(wishlist.includes(Number(id)));
  const [likesCount,setLikesCount]= useState(0);
  const [reviews,   setReviews]   = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating,    setRating]    = useState(5);
  const [comment,   setComment]   = useState("");
  const [submitting,setSubmitting]= useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewAgreementId, setReviewAgreementId] = useState(null);

  useEffect(() => { fetchItem(); }, [id]);

  async function fetchItem() {
    try {
      setLoading(true);
      const data = await getItemByIdService(id);
      setItem(data);
      setLikesCount(data.likes?.length || 0);
      setLiked(data.likes?.some(l => l.user_id === user?.id) || wishlist.includes(Number(id)));
      const revs = await apiFetch(`/api/items/${id}/reviews`).catch(() => []);
      setReviews(Array.isArray(revs) ? revs : []);
      // Check review eligibility
      if (user?.id) {
        const elig = await apiFetch(`/api/rental/eligibility/${user.id}/${id}`).catch(() => ({ canReview: false }));
        setCanReview(!!elig?.canReview);
        if (elig?.agreementId) setReviewAgreementId(elig.agreementId);
      }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  async function handleLike() {
    if (!user) { navigate("/login"); return; }
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => prev + (newLiked ? 1 : -1));
    const updated = newLiked
      ? [...wishlist.filter(x => x !== Number(id)), Number(id)]
      : wishlist.filter(x => x !== Number(id));
    if (wishlistKey) localStorage.setItem(wishlistKey, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("likeChanged"));
    try { await likeItemService(id, user.id); } catch {}
  }

  function handleChat() {
    if (!user) { navigate("/login"); return; }
    if (item) {
      localStorage.setItem("targetChatId", String(item.owner_id));
      localStorage.setItem("targetChatProduct", JSON.stringify({
        id: item.id,
        title: item.title,
        price: item.price_per_day || item.price,
        image: item.image,
        status: item.status,
        ownerId: item.owner_id,   // ← needed for seller/buyer role detection in ChatPage
      }));
    }
    navigate("/chat");
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await apiFetch(`/api/items/${id}/reviews`, {
        method: "POST",
        body: JSON.stringify({ userId: user.id, rating, comment }),
      });
      setShowReviewForm(false);
      setComment("");
      setRating(5);
      const revs = await apiFetch(`/api/items/${id}/reviews`).catch(() => []);
      setReviews(Array.isArray(revs) ? revs : []);
    } catch (err) { alert(err.message); }
    finally { setSubmitting(false); }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAF8FF" }}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-full rp-skeleton mx-auto mb-4" />
        <p style={{ color: "#A89CC4" }}>Memuat detail produk...</p>
      </div>
    </div>
  );

  if (error || !item) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAF8FF" }}>
      <div className="rp-card p-10 text-center">
        <div className="text-5xl mb-3">😢</div>
        <h2 className="font-black text-xl mb-2" style={{ color: "#3D2F6B" }}>Produk Tidak Ditemukan</h2>
        <button onClick={() => navigate("/home")} className="rp-btn-primary mt-2">Kembali ke Beranda</button>
      </div>
    </div>
  );

  const isOwner = user?.id === item.owner_id;
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="min-h-screen rp-page" style={{ background: "#FAF8FF" }}>
      <AppNavbar wishlistCount={wishlist.length} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="rp-back-btn mb-6">
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Left: Image ── */}
          <div>
            <div className="rp-card overflow-hidden aspect-[4/3] relative">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl" style={{ background: "#E8DCFF" }}>📦</div>
              )}
              {/* Overlay badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {item.category_name && <span className="rp-badge rp-badge-primary">{item.category_name}</span>}
                <span className={`rp-badge ${item.status === "rented" ? "rp-badge-pink" : "rp-badge-mint"}`}>
                  {item.status === "rented" ? "Sedang Disewa" : "Tersedia"}
                </span>
              </div>
              {/* Likes overlay */}
              <button
                onClick={handleLike}
                className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full font-bold text-sm transition-all hover:scale-105"
                style={{ background: liked ? "#FFD6EC" : "rgba(255,255,255,0.9)", color: liked ? "#9B4070" : "#A89CC4" }}
              >
                <Heart size={16} fill={liked ? "#FFB3D9" : "none"} /> {likesCount}
              </button>
              {item.views > 0 && (
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: "rgba(255,255,255,0.9)", color: "#7B6AAA" }}>
                  <Eye size={13} /> {item.views} dilihat
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Details ── */}
          <div className="flex flex-col gap-5">
            <div className="rp-card p-6">
              <h1 className="text-2xl font-black mb-2" style={{ color: "#3D2F6B" }}>{item.title}</h1>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-black" style={{ color: "#9B87D9" }}>
                  {formatPrice(item.price_per_day || item.price)}
                </span>
                <span className="text-sm" style={{ color: "#A89CC4" }}>/ hari</span>
              </div>

              {/* Meta */}
              <div className="space-y-2 mb-5">
                {item.location && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: "#7B6AAA" }}>
                    <MapPin size={15} style={{ color: "#C9B8FF" }} /> {item.location}
                  </div>
                )}
                {avgRating && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: "#7B6AAA" }}>
                    <Star size={15} fill="#FFB3D9" color="#FFB3D9" /> {avgRating} ({reviews.length} ulasan)
                  </div>
                )}
                {item.created_at && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: "#7B6AAA" }}>
                    <Calendar size={15} style={{ color: "#C9B8FF" }} />
                    {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                )}
              </div>

              {item.description && (
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#7B6AAA" }}>{item.description}</p>
              )}

              {/* CTA Buttons */}
              {!isOwner && (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleChat}
                    disabled={item.status === "rented"}
                    className="rp-btn-primary w-full py-3.5 text-base"
                    style={item.status === "rented" ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                  >
                    <MessageCircle size={18} />
                    {item.status === "rented" ? "Sedang Tidak Tersedia" : "Chat & Sewa Sekarang"}
                  </button>
                  <button onClick={handleLike} className="rp-btn-outline w-full py-3">
                    <Heart size={16} fill={liked ? "#FFB3D9" : "none"} color={liked ? "#FFB3D9" : "#C9B8FF"} />
                    {liked ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}
                  </button>
                </div>
              )}

              {isOwner && (
                <div className="flex gap-3">
                  <button onClick={() => navigate(`/upload?edit=${id}`)} className="rp-btn-outline flex-1 py-3">✏️ Edit</button>
                </div>
              )}
            </div>

            {/* Owner Card */}
            {item.owner && (
              <div className="rp-card p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-base flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #C9B8FF, #FFD6EC)", color: "#3D2F6B" }}>
                  {(item.owner.username || "U")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm" style={{ color: "#3D2F6B" }}>{item.owner.username}</p>
                  <p className="text-xs" style={{ color: "#A89CC4" }}>Pemilik</p>
                </div>
                <button onClick={() => navigate(`/profile/${item.owner_id}`)} className="rp-btn-outline text-sm px-3 py-2">
                  <User size={14} /> Profil
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Reviews ── */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black" style={{ color: "#3D2F6B" }}>Ulasan ({reviews.length})</h2>
            {user && !isOwner && canReview && !showReviewForm && (
              <button onClick={() => setShowReviewForm(true)} className="rp-btn-primary text-sm px-4 py-2">
                + Tulis Ulasan
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="rp-card p-6 mb-6">
              <h3 className="font-black mb-4" style={{ color: "#3D2F6B" }}>Tulis Ulasan</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="text-sm font-bold mb-2 block" style={{ color: "#7B6AAA" }}>Rating</label>
                  <StarRating value={rating} onChange={setRating} size={32} />
                </div>
                <div className="mb-4">
                  <label className="text-sm font-bold mb-2 block" style={{ color: "#7B6AAA" }}>Komentar</label>
                  <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
                    placeholder="Ceritakan pengalaman menyewa produk ini..."
                    className="rp-input resize-none" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowReviewForm(false)} className="rp-btn-outline flex-1 py-2.5">Batal</button>
                  <button type="submit" disabled={submitting} className="rp-btn-primary flex-1 py-2.5">
                    {submitting ? "Mengirim..." : "Kirim Ulasan"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="rp-card py-12 text-center">
              <div className="text-4xl mb-3">⭐</div>
              <p className="font-bold" style={{ color: "#3D2F6B" }}>Belum ada ulasan</p>
              <p className="text-sm mt-1" style={{ color: "#A89CC4" }}>Jadilah yang pertama memberikan ulasan!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r, i) => (
                <div key={i} className="rp-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black" style={{ background: "#E8DCFF", color: "#9B87D9" }}>
                        {(r.username || r.user?.username || "U")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: "#3D2F6B" }}>{r.username || r.user?.username || "Pengguna"}</p>
                        <StarRating value={r.rating} size={14} />
                      </div>
                    </div>
                    {r.created_at && (
                      <span className="text-xs" style={{ color: "#A89CC4" }}>
                        {new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#7B6AAA" }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
