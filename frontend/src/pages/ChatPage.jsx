import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useChat } from "../hooks/useChat";
import ChatList from "../components/ChatList";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";

export default function ChatPage() {
  const { user, loading } = useAuth();
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

  if (loading) {
    return <div className="p-5">Loading...</div>;
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

            <div className="product-section">
              <img
                src="/download.jpg"
                alt="Tas"
                className="product-image"
              />
              <div className="product-info">
                <div className="product-name">Tas</div>
                <div className="product-price">Rp 20000</div>
                <Link to="/offer" className="primary-pill-button text-center">
                  Buat Penawaran
                </Link>
              </div>
            </div>

            <div className="chat-body">
              <div id="messages" className="messages">
                {messages.length === 0 ? (
                  <div className="text-sm text-slate-500">Belum ada pesan</div>
                ) : (
                  messages.map((msg) => (
                    <MessageBubble
                      key={msg.pesan_id}
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