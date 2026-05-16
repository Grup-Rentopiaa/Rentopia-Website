import { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical, Phone, Tag } from "lucide-react";
import { useChat } from "../hooks/useChat";
import ChatList from "../components/ChatList";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import { updateItemStatusService } from "../services/itemService";
import apiFetch from "../api";

function getAvatarColor(name = "") {
  const colors = [
    "bg-purple-500", "bg-blue-500", "bg-emerald-500",
    "bg-orange-500", "bg-pink-500", "bg-teal-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

const QUICK_REPLIES = [
  "Halo, produk ini masih tersedia?",
  "Saya tertarik, bisa berikan detail?",
  "Berapa harga sewanya per hari?",
  "Lokasi pengambilan di mana?",
];

export default function ChatPage({ setActivePage }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [showProductCard, setShowProductCard] = useState(true);
  const [rentalLoading, setRentalLoading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const {
    users,
    targetUser,
    messages,
    loading,
    usersLoading,
    sendMessage,
    chooseUser,
  } = useChat(user?.id);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // When a user is chosen on mobile, switch view to chat
  function handleChooseUser(u) {
    chooseUser(u);
    setMobileSidebarOpen(false);
  }

  async function handleSend(textMessage) {
    return await sendMessage(textMessage);
  }

  function handleQuickReply(msg) {
    setText(msg);
  }

  // Product from localStorage (set when clicking "Chat" on a product page)
  const productStr = localStorage.getItem("targetChatProduct");
  const product = productStr ? JSON.parse(productStr) : null;

  async function confirmRental() {
    if (!product || !targetUser) return;
    if (!window.confirm(`Konfirmasi penyewaan "${product.title}"?`)) return;
    setRentalLoading(true);
    try {
      await updateItemStatusService(product.id, "rented");
      await apiFetch(`/api/users/${targetUser.id}/rentals`, {
        method: "POST",
        body: JSON.stringify({
          title: product.title,
          price: product.price.toString(),
          store: user.name || user.username,
          itemId: product.id,
          image: product.image,
        }),
      });
      product.status = "rented";
      localStorage.setItem("targetChatProduct", JSON.stringify(product));
      await sendMessage(`✅ Saya ingin menyewa "${product.title}" (Rp ${Number(product.price).toLocaleString("id-ID")}/hari). Mohon konfirmasinya.`);
      navigate(`/product/${product.id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setRentalLoading(false);
    }
  }

  if (!user) return <Navigate to="/login" replace />;

  const targetInitials = (targetUser?.name || targetUser?.username || "?")[0].toUpperCase();
  const targetColor = getAvatarColor(targetUser?.name || targetUser?.username || "");

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ─── Sidebar ─────────────────────────────────────── */}
      <aside
        className={`
          flex-shrink-0 w-[300px] bg-white border-r border-gray-200 flex flex-col
          transition-transform duration-300
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative absolute inset-y-0 left-0 z-20
        `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-5 py-4 bg-purple-700 text-white">
          <div>
            <h2 className="font-bold text-base">Pesan</h2>
            <p className="text-purple-200 text-xs mt-0.5">{users.length} percakapan</p>
          </div>
          {setActivePage && (
            <button
              onClick={() => setActivePage("home")}
              className="p-1.5 rounded-lg hover:bg-purple-600 transition-colors"
              title="Kembali"
            >
              <ArrowLeft size={18} />
            </button>
          )}
        </div>

        {/* User list */}
        <ChatList
          users={users}
          targetUser={targetUser}
          onSelect={handleChooseUser}
          loading={usersLoading}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-10 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ─── Main Chat Area ───────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          {/* Mobile back button */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden p-2 -ml-1 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ArrowLeft size={20} />
          </button>

          {targetUser ? (
            <>
              <div
                className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold ${targetColor}`}
              >
                {targetInitials}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm truncate">
                  {targetUser.name || targetUser.username}
                </h3>
                <p className="text-xs text-emerald-500 font-medium">Aktif</p>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
                  <Phone size={18} />
                </button>
                <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
                  <MoreVertical size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1">
              <h3 className="font-bold text-gray-400 text-sm">
                Pilih percakapan
              </h3>
            </div>
          )}
        </div>

        {/* Product Card Banner */}
        {targetUser && product && showProductCard && (
          <div className="flex-shrink-0 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    📦
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Tag size={11} className="text-purple-500" />
                  <span className="text-[10px] text-purple-500 font-semibold uppercase tracking-wide">
                    Produk Terkait
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-800 truncate">
                  {product.title}
                </p>
                <p className="text-xs text-purple-700 font-semibold">
                  Rp {Number(product.price).toLocaleString("id-ID")}
                  <span className="text-gray-400 font-normal">/hari</span>
                </p>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button
                  onClick={confirmRental}
                  disabled={rentalLoading || product.status === "rented"}
                  className="text-xs font-bold px-3 py-1.5 bg-purple-600 text-white rounded-full
                             hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {rentalLoading
                    ? "⏳"
                    : product.status === "rented"
                    ? "✓ Disewa"
                    : "Konfirmasi Sewa"}
                </button>
                <button
                  onClick={() => setShowProductCard(false)}
                  className="text-[10px] text-gray-400 hover:text-gray-600 text-center transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3 bg-gray-50">
          {!targetUser ? (
            /* Empty state: no chat selected */
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 h-full">
              <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-4xl">
                💬
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-700">
                  Selamat datang di Pesan
                </h3>
                <p className="text-sm text-gray-400 mt-1 max-w-xs">
                  Pilih percakapan dari sidebar atau mulai chat dari halaman produk yang kamu minati.
                </p>
              </div>
            </div>
          ) : loading ? (
            /* Loading skeleton */
            <div className="flex flex-col gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${
                    i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {i % 2 === 0 && (
                    <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
                  )}
                  <div
                    className={`h-9 rounded-2xl animate-pulse bg-gray-200 ${
                      i % 2 === 0 ? "w-48" : "w-36 bg-purple-100"
                    }`}
                  />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            /* No messages yet */
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 h-full">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-3xl">
                ✉️
              </div>
              <p className="text-sm font-semibold text-gray-500">
                Belum ada pesan dengan{" "}
                <span className="text-purple-600">
                  {targetUser.name || targetUser.username}
                </span>
              </p>
              <p className="text-xs text-gray-400">
                Mulai percakapan dengan quick reply di bawah
              </p>
            </div>
          ) : (
            /* Messages */
            messages.map((msg) => (
              <MessageBubble
                key={msg.pesan_id || msg.id}
                message={msg}
                myId={user.id}
                senderName={targetUser.name || targetUser.username}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies + Input */}
        {targetUser && (
          <div className="flex-shrink-0 bg-white border-t border-gray-100">
            {/* Quick Replies */}
            <div className="flex items-center gap-2 px-4 pt-3 pb-1 overflow-x-auto scrollbar-none">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleQuickReply(reply)}
                  className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-purple-300
                             text-purple-600 bg-purple-50 hover:bg-purple-100
                             transition-colors font-medium whitespace-nowrap"
                >
                  {reply}
                </button>
              ))}
            </div>

            <MessageInput
              text={text}
              setText={setText}
              onSend={handleSend}
              disabled={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
