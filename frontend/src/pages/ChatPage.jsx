import { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical, Phone, Tag, Send, MessageCircle } from "lucide-react";
import { useChat } from "../hooks/useChat";
import ChatList from "../components/ChatList";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import { updateItemStatusService } from "../services/itemService";
import apiFetch from "../api";

const QUICK_REPLIES = [
  "Halo, produk ini masih tersedia?",
  "Saya tertarik, bisa kirim detail?",
  "Berapa harga sewanya per hari?",
];

function getAvatarColor(name = "") {
  const colors = ["#C9B8FF","#FFD6EC","#D6F0FF","#C9EFDC","#FFB3D9","#A8DAFF"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

export default function ChatPage() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [showProduct, setShowProduct] = useState(true);
  const [rentalLoading, setRentalLoading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const { users, targetUser, messages, loading, usersLoading, sendMessage, chooseUser } = useChat(user?.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleChooseUser(u) {
    chooseUser(u);
    setMobileSidebarOpen(false);
  }

  const productStr = localStorage.getItem("targetChatProduct");
  const product = productStr ? (() => { try { return JSON.parse(productStr); } catch { return null; } })() : null;

  async function confirmRental() {
    if (!product || !targetUser) return;
    if (!window.confirm(`Konfirmasi penyewaan "${product.title}"?`)) return;
    setRentalLoading(true);
    try {
      await updateItemStatusService(product.id, "rented");
      await apiFetch(`/api/users/${targetUser.id}/rentals`, {
        method: "POST",
        body: JSON.stringify({ title: product.title, price: product.price.toString(), store: user.name || user.username, itemId: product.id, image: product.image }),
      });
      product.status = "rented";
      localStorage.setItem("targetChatProduct", JSON.stringify(product));
      await sendMessage(`✅ Saya ingin menyewa "${product.title}" (${new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(product.price)}/hari). Mohon dikonfirmasi ya!`);
      navigate(`/product/${product.id}`);
    } catch (err) { alert(err.message); }
    finally { setRentalLoading(false); }
  }

  if (!user) return <Navigate to="/login" replace />;

  const targetInitials = (targetUser?.name || targetUser?.username || "?")[0]?.toUpperCase();
  const targetColor = getAvatarColor(targetUser?.name || targetUser?.username || "");

  return (
    <div className="flex h-screen rp-page" style={{ background: "#FAF8FF" }}>
      {/* ── Sidebar ── */}
      <aside className={`flex-shrink-0 w-72 flex flex-col border-r transition-transform duration-300 bg-white
        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:relative absolute inset-y-0 left-0 z-20`}
        style={{ borderColor: "#E8DCFF" }}>
        {/* Sidebar header */}
        <div className="px-5 py-4" style={{ background: "linear-gradient(135deg, #E8DCFF, #FFD6EC)" }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <MessageCircle size={18} style={{ color: "#9B87D9" }} />
                <h2 className="font-black text-base" style={{ color: "#3D2F6B" }}>Pesan</h2>
              </div>
              <p className="text-xs mt-0.5" style={{ color: "#A89CC4" }}>{users.length} percakapan</p>
            </div>
            <button onClick={() => navigate(-1)} className="rp-back-btn text-xs px-2 py-1">
              <ArrowLeft size={14} />
            </button>
          </div>
        </div>
        <ChatList users={users} targetUser={targetUser} onSelect={handleChooseUser} loading={usersLoading} />
      </aside>

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-10 md:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* ── Chat Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white flex-shrink-0" style={{ borderBottom: "1px solid #E8DCFF" }}>
          <button onClick={() => setMobileSidebarOpen(true)} className="md:hidden p-2 rounded-xl" style={{ color: "#9B87D9" }}>
            <ArrowLeft size={20} />
          </button>
          {targetUser ? (
            <>
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-black" style={{ background: targetColor, color: "#3D2F6B" }}>
                {targetInitials}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-sm" style={{ color: "#3D2F6B" }}>{targetUser.name || targetUser.username}</h3>
                <p className="text-xs font-semibold" style={{ color: "#9B87D9" }}>● Aktif</p>
              </div>
            </>
          ) : (
            <p className="text-sm font-semibold" style={{ color: "#A89CC4" }}>Pilih percakapan</p>
          )}
        </div>

        {/* Product Banner */}
        {targetUser && product && showProduct && (
          <div className="flex-shrink-0 px-4 py-3" style={{ background: "linear-gradient(135deg, #E8DCFF, #FFD6EC)", borderBottom: "1px solid #C9B8FF" }}>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#C9B8FF" }}>
                {product.image ? <img src={product.image} alt={product.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  <Tag size={10} style={{ color: "#9B87D9" }} />
                  <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#9B87D9" }}>Produk Terkait</span>
                </div>
                <p className="text-sm font-black truncate" style={{ color: "#3D2F6B" }}>{product.title}</p>
                <p className="text-xs font-bold" style={{ color: "#9B87D9" }}>
                  {new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(product.price)}<span className="font-normal" style={{ color: "#A89CC4" }}>/hari</span>
                </p>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button onClick={confirmRental} disabled={rentalLoading || product.status === "rented"} className="rp-btn-primary text-xs py-1.5 px-3">
                  {rentalLoading ? "⏳" : product.status === "rented" ? "✓ Disewa" : "Konfirmasi Sewa"}
                </button>
                <button onClick={() => setShowProduct(false)} className="text-[10px] text-center" style={{ color: "#A89CC4" }}>Tutup</button>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3 scrollbar-none" style={{ background: "#FAF8FF" }}>
          {!targetUser ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 h-full">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl" style={{ background: "#E8DCFF" }}>💬</div>
              <h3 className="text-lg font-black" style={{ color: "#3D2F6B" }}>Selamat datang di Pesan</h3>
              <p className="text-sm max-w-xs" style={{ color: "#A89CC4" }}>Pilih percakapan dari sidebar atau mulai chat dari halaman produk.</p>
            </div>
          ) : loading ? (
            <div className="flex flex-col gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`flex gap-2 ${i % 2 ? "flex-row-reverse" : ""}`}>
                  {!(i % 2) && <div className="w-7 h-7 rounded-full rp-skeleton flex-shrink-0" />}
                  <div className={`h-9 rounded-2xl rp-skeleton ${i % 2 ? "w-36" : "w-48"}`} />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center h-full">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3" style={{ background: "#FFD6EC" }}>✉️</div>
              <p className="font-bold" style={{ color: "#3D2F6B" }}>Belum ada pesan dengan <span style={{ color: "#9B87D9" }}>{targetUser.name || targetUser.username}</span></p>
              <p className="text-sm mt-1" style={{ color: "#A89CC4" }}>Mulai dengan quick reply di bawah</p>
            </div>
          ) : (
            messages.map(msg => (
              <MessageBubble key={msg.pesan_id || msg.id} message={msg} myId={user.id} senderName={targetUser.name || targetUser.username} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies + Input */}
        {targetUser && (
          <div className="flex-shrink-0 bg-white" style={{ borderTop: "1px solid #E8DCFF" }}>
            <div className="flex items-center gap-2 px-4 pt-3 pb-1 overflow-x-auto scrollbar-none">
              {QUICK_REPLIES.map(r => (
                <button key={r} onClick={() => setText(r)}
                  className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border font-bold whitespace-nowrap transition-colors"
                  style={{ borderColor: "#C9B8FF", color: "#9B87D9", background: "#FAF8FF" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#E8DCFF"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#FAF8FF"; }}>
                  {r}
                </button>
              ))}
            </div>
            <MessageInput text={text} setText={setText} onSend={sendMessage} disabled={loading} />
          </div>
        )}
      </div>
    </div>
  );
}
