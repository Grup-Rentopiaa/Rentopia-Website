import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useChat } from "../hooks/useChat";
import ChatList from "../components/ChatList";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import { updateItemStatusService } from "../services/itemService";
import apiFetch from "../api";

export default function ChatPage({ setActivePage }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();
  const [text, setText] = useState("");

  const {
    users,
    targetUser,
    messages,
    chooseUser,
    sendMessage,
  } = useChat(user?.id);

  function handleQuickReply(message) {
    setText(message);
  }

  async function handleSend(textMessage) {
    return await sendMessage(textMessage);
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="chat-page">
      <div className="chat-root">
        <aside className="chat-sidebar">
          <div className="chat-list-header">Chat</div>
          <ChatList
            users={users}
            targetUser={targetUser}
            onSelect={chooseUser}
          />
        </aside>

        <div className="chat-wrapper">
          <div className="chat-container">
            <div className="chat-header">
              <div className="user-info">
                <div className="avatar"></div>
                <span className="username" id="username">
                  {targetUser ? targetUser.name : "Pilih chat"}
                </span>
              </div>
            </div>

            {(() => {
              const productStr = localStorage.getItem('targetChatProduct');
              if (!productStr) return null;
              const product = JSON.parse(productStr);
              
              const confirmRental = async () => {
                if (window.confirm(`Konfirmasi penyewaan "${product.title}"?`)) {
                  try {
                    await updateItemStatusService(product.id, 'rented');
                    await apiFetch(`/api/users/${targetUser.id}/rentals`, {
                      method: 'POST',
                      body: JSON.stringify({
                        title: product.title,
                        price: product.price.toString(),
                        store: user.name || user.username,
                        itemId: product.id,
                        image: product.image
                      })
                    });
                    alert('Status produk berhasil diubah menjadi Sedang Disewa');
                    // Update local storage to reflect status
                    product.status = 'rented';
                    localStorage.setItem('targetChatProduct', JSON.stringify(product));
                    navigate(`/product/${product.id}`);
                  } catch (err) {
                    alert(err.message);
                  }
                }
              };

              return (
                <div className="product-section">
                  {product.image ? (
                    <img src={product.image} alt={product.title} className="product-image" />
                  ) : (
                    <div className="product-image bg-slate-100 flex items-center justify-center">📦</div>
                  )}
                  <div className="product-info">
                    <div className="product-name font-bold">{product.title}</div>
                    <div className="product-price text-purple-600">Rp {product.price.toLocaleString('id-ID')}</div>
                    
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={() => {
                          if (setActivePage) setActivePage('offer');
                          else navigate('/offer');
                        }}
                        className="primary-pill-button text-[10px] py-1 px-3"
                      >
                        Tawar
                      </button>
                      
                      <button 
                        onClick={confirmRental}
                        className="bg-emerald-500 text-white rounded-full text-[10px] py-1 px-3 font-bold hover:bg-emerald-600 transition-colors"
                      >
                        Konfirmasi Sewa
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="chat-body">
              <div id="messages" className="messages">
                {!targetUser ? (
                  <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
                    Pilih chat terlebih dahulu
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-sm text-gray-400 p-4">Belum ada pesan</div>
                ) : (
                  messages.map((msg) => (
                    <MessageBubble
                      key={msg.pesan_id || msg.id}
                      message={msg}
                      myId={user.id}
                    />
                  ))
                )}
              </div>

              <div className="bottom-area">
                <div className="info-text">
                  Pilih pesan cepat atau ketik di bawah
                </div>

                <div className="quick-replies">
                  <button
                    type="button"
                    className="quick-reply"
                    onClick={() => handleQuickReply("Saya tertarik")}
                  >
                    Saya tertarik
                  </button>
                  <button
                    type="button"
                    className="quick-reply"
                    onClick={() => handleQuickReply("Halo, produk ini masih ada?")}
                  >
                    Halo, produk ini masih ada?
                  </button>
                  <button
                    type="button"
                    className="quick-reply"
                    onClick={() => handleQuickReply("Tolong kirim detail produk")}
                  >
                    Tolong kirim detail produk
                  </button>
                </div>

                {targetUser ? (
                  <MessageInput
                    text={text}
                    setText={setText}
                    onSend={handleSend}
                  />
                ) : (
                  <div className="mt-2 text-center text-sm text-slate-500">
                    Pilih chat terlebih dahulu
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
