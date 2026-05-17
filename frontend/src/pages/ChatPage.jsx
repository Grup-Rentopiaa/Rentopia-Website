import { useState, useEffect, useRef, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Tag, MessageCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { useChat } from "../hooks/useChat";
import ChatList from "../components/ChatList";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import GuaranteeModal from "../components/GuaranteeModal";
import ReviewModal from "../components/ReviewModal";
import RentalActionBar from "../components/RentalActionBar";
import apiFetch from "../api";

function getAvatarColor(name = "") {
  const colors = ["#C9B8FF","#FFD6EC","#D6F0FF","#C9EFDC","#FFB3D9","#A8DAFF"];
  let h = 0; for (const c of (name||"")) h += c.charCodeAt(0);
  return colors[h % colors.length];
}

const QUICK_REPLIES = ["Halo, masih tersedia?","Berapa harga sewanya?","Bisa COD tidak?"];

export default function ChatPage() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();
  const [mobileSidebar, setMobileSidebar] = useState(true);
  const [text, setText] = useState("");
  const [agreement, setAgreement] = useState(null);
  const [agLoading, setAgLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showGuarantee, setShowGuarantee] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const endRef = useRef(null);

  const { users, targetUser, messages, loading, usersLoading, sendMessage, chooseUser } = useChat(user?.id);

  const productStr = localStorage.getItem("targetChatProduct");
  const product = productStr ? (() => { try { return JSON.parse(productStr); } catch { return null; } })() : null;

  const isSeller = !!(product && user?.id === product.ownerId);
  const isBuyer  = !!(product && user?.id !== product.ownerId);
  const buyerId  = product ? (isBuyer ? user?.id : targetUser?.id) : null;
  const sellerId = product ? (isSeller ? user?.id : targetUser?.id) : null;

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const fetchAgreement = useCallback(async () => {
    if (!targetUser || !product || !user) return;
    setAgLoading(true);
    try {
      const data = await apiFetch(`/api/rental/agreement?buyerId=${buyerId}&sellerId=${sellerId}&itemId=${product.id}`);
      setAgreement(data || null);
    } catch { setAgreement(null); }
    finally { setAgLoading(false); }
  }, [targetUser?.id, product?.id, user?.id]);

  useEffect(() => { fetchAgreement(); }, [fetchAgreement]);

  async function doAction(endpoint, body, sysMsg) {
    setActionLoading(true);
    try {
      await apiFetch(endpoint, { method:"POST", body: body ? JSON.stringify(body) : undefined });
      if (sysMsg) await sendMessage(sysMsg);
      await fetchAgreement();
    } catch (err) { alert(err.message); }
    finally { setActionLoading(false); }
  }

  const handlers = {
    onApprove: () => doAction("/api/rental/approve",
      { buyerId, sellerId, itemId: product?.id },
      "✅ Penjual menyetujui penyewaan. Menunggu data jaminan dari penyewa."),
    onHandover: () => doAction(`/api/rental/${agreement?.id}/confirm-handover`, null,
      `📋 Penjual mengonfirmasi barang diserahkan. Kode Sewa: ${agreement?.rentalCode} · Durasi: ${agreement?.durationDays} hari.`),
    onReceived: () => doAction(`/api/rental/${agreement?.id}/confirm-received`, null,
      "🟢 Penyewa mengonfirmasi menerima barang. Masa sewa dimulai sekarang!"),
    onReturned: () => doAction(`/api/rental/${agreement?.id}/confirm-returned`, null,
      "✅ Barang telah dikembalikan. Terima kasih telah menggunakan Rentopia!"),
    onOpenGuarantee: () => setShowGuarantee(true),
    onReview: () => setShowReview(true),
  };

  function handleChooseUser(u) { chooseUser(u); setMobileSidebar(false); }

  if (!user) return <Navigate to="/login" replace />;

  const targetColor    = getAvatarColor(targetUser?.username || "");
  const targetInitials = (targetUser?.name || targetUser?.username || "?")[0]?.toUpperCase();

  // Rental status countdown
  const daysLeft = agreement?.endDate
    ? Math.max(0, Math.ceil((new Date(agreement.endDate) - new Date()) / 86400000))
    : null;

  return (
    <div className="flex h-screen" style={{ background:"#FAF8FF" }}>
      {/* ── Sidebar ── */}
      <aside className={`flex-shrink-0 w-72 flex flex-col border-r bg-white z-20
        ${mobileSidebar ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:relative absolute inset-y-0 left-0 transition-transform duration-300`}
        style={{ borderColor:"#E8DCFF" }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ background:"linear-gradient(135deg,#E8DCFF,#FFD6EC)" }}>
          <div className="flex items-center gap-2">
            <MessageCircle size={18} style={{ color:"#9B87D9" }} />
            <span className="font-black" style={{ color:"#3D2F6B" }}>Pesan</span>
          </div>
          <button onClick={() => navigate(-1)} className="rp-back-btn text-xs px-2 py-1"><ArrowLeft size={14} /></button>
        </div>
        <ChatList users={users} targetUser={targetUser} onSelect={handleChooseUser} loading={usersLoading} />
      </aside>
      {mobileSidebar && <div className="fixed inset-0 bg-black/20 z-10 md:hidden" onClick={() => setMobileSidebar(false)} />}

      {/* ── Main chat ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white flex-shrink-0" style={{ borderBottom:"1px solid #E8DCFF" }}>
          <button onClick={() => setMobileSidebar(true)} className="md:hidden p-2 rounded-xl" style={{ color:"#9B87D9" }}>
            <ArrowLeft size={20} />
          </button>
          {targetUser ? (
            <>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                style={{ background:targetColor, color:"#3D2F6B" }}>{targetInitials}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-sm truncate" style={{ color:"#3D2F6B" }}>{targetUser.name || targetUser.username}</h3>
                <p className="text-xs" style={{ color:"#9B87D9" }}>● Aktif</p>
              </div>
            </>
          ) : <p className="text-sm" style={{ color:"#A89CC4" }}>Pilih percakapan</p>}
        </div>

        {/* Pinned product card */}
        {targetUser && product && (
          <div className="flex-shrink-0 px-4 py-3 flex items-center gap-3" style={{ background:"linear-gradient(135deg,#E8DCFF,#FFD6EC)", borderBottom:"1px solid #C9B8FF" }}>
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background:"#C9B8FF" }}>
              {product.image
                ? <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <Tag size={10} style={{ color:"#9B87D9" }} />
                <span className="text-[10px] font-bold uppercase" style={{ color:"#9B87D9" }}>Produk Terkait</span>
              </div>
              <p className="text-sm font-black truncate" style={{ color:"#3D2F6B" }}>{product.title}</p>
              <p className="text-xs font-bold" style={{ color:"#9B87D9" }}>
                {new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(product.price)}
                <span className="font-normal" style={{ color:"#A89CC4" }}>/hari</span>
              </p>
            </div>
            <button onClick={() => navigate(`/product/${product.id}`)} className="flex-shrink-0 p-2 rounded-xl" style={{ background:"#E8DCFF" }}>
              <ExternalLink size={14} style={{ color:"#9B87D9" }} />
            </button>
          </div>
        )}

        {/* Rental countdown badge */}
        {agreement?.status === "received" && daysLeft !== null && (
          <div className="flex-shrink-0 mx-4 mt-3 px-4 py-2 rounded-2xl flex items-center gap-2"
            style={{ background: daysLeft <= 1 ? "#FFD6EC" : "#C9EFDC", color: daysLeft <= 1 ? "#9B4070" : "#2D7A55" }}>
            <span className="text-sm font-black">
              {daysLeft <= 0 ? "⚠️ Masa sewa habis hari ini!" : `⏳ Sisa ${daysLeft} hari sewa`}
            </span>
            {agreement.endDate && (
              <span className="text-xs ml-auto">
                s/d {new Date(agreement.endDate).toLocaleDateString("id-ID")}
              </span>
            )}
          </div>
        )}

        {/* Rental code badge */}
        {agreement?.rentalCode && (
          <div className="flex-shrink-0 mx-4 mt-2">
            <div className="px-4 py-2 rounded-xl text-xs font-bold text-center" style={{ background:"#C9EFDC", color:"#2D7A55" }}>
              🔑 Kode Sewa: {agreement.rentalCode}
            </div>
          </div>
        )}

        {/* Action bar */}
        {targetUser && product && (
          <div className="flex-shrink-0 px-4 py-3 bg-white" style={{ borderBottom:"1px solid #E8DCFF" }}>
            <RentalActionBar
              agreement={agreement} isSeller={isSeller} isBuyer={isBuyer}
              loading={agLoading || actionLoading} {...handlers} />
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3 scrollbar-none" style={{ background:"#FAF8FF" }}>
          {!targetUser ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl" style={{ background:"#E8DCFF" }}>💬</div>
              <h3 className="font-black text-lg" style={{ color:"#3D2F6B" }}>Selamat datang di Pesan</h3>
              <p className="text-sm max-w-xs" style={{ color:"#A89CC4" }}>Pilih percakapan dari sidebar untuk mulai chat.</p>
            </div>
          ) : loading ? (
            Array(5).fill(0).map((_,i) => (
              <div key={i} className={`flex gap-2 ${i%2?"flex-row-reverse":""}`}>
                <div className="w-7 h-7 rounded-full rp-skeleton flex-shrink-0" />
                <div className={`h-9 rounded-2xl rp-skeleton ${i%2?"w-36":"w-48"}`} />
              </div>
            ))
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-4xl mb-3">✉️</div>
              <p className="font-bold" style={{ color:"#3D2F6B" }}>Belum ada pesan</p>
              <p className="text-sm mt-1" style={{ color:"#A89CC4" }}>Mulai percakapan dengan quick reply di bawah</p>
            </div>
          ) : messages.map(msg => (
            <MessageBubble key={msg.pesan_id || msg.id} message={msg} myId={user.id}
              senderName={targetUser.name || targetUser.username} />
          ))}
          <div ref={endRef} />
        </div>

        {/* Quick replies + Input */}
        {targetUser && (
          <div className="flex-shrink-0 bg-white" style={{ borderTop:"1px solid #E8DCFF" }}>
            <div className="flex items-center gap-2 px-4 pt-3 pb-1 overflow-x-auto scrollbar-none">
              {QUICK_REPLIES.map(r => (
                <button key={r} onClick={() => setText(r)}
                  className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border font-bold whitespace-nowrap"
                  style={{ borderColor:"#C9B8FF", color:"#9B87D9", background:"#FAF8FF" }}>
                  {r}
                </button>
              ))}
            </div>
            <MessageInput text={text} setText={setText} onSend={sendMessage} disabled={loading} />
            <div className="flex justify-center pb-2">
              <a href="mailto:admin@rentopia.id" className="text-[10px] flex items-center gap-1" style={{ color:"#A89CC4" }}>
                <AlertTriangle size={10} /> Ada masalah? Hubungi Admin Rentopia
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showGuarantee && (
        <GuaranteeModal
          buyerId={buyerId} sellerId={sellerId} itemId={product?.id}
          onSuccess={() => { setShowGuarantee(false); fetchAgreement(); }}
          onClose={() => setShowGuarantee(false)}
        />
      )}
      {showReview && (
        <ReviewModal
          rentalId={agreement?.id}
          onSuccess={() => { setShowReview(false); fetchAgreement(); }}
          onClose={() => setShowReview(false)}
        />
      )}
    </div>
  );
}
