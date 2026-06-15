import { useState, useEffect, useRef, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { useChat } from "../hooks/useChat";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import GuaranteeModal from "../components/GuaranteeModal";
import ReviewModal from "../components/ReviewModal";
import RentalActionBar from "../components/RentalActionBar";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatHeader from "../components/chat/ChatHeader";
import ProductPin from "../components/chat/ProductPin";
import RentalBadges from "../components/chat/RentalBadges";
import apiFetch from "../api";

const QUICK_REPLIES = ["Halo, masih tersedia?", "Berapa harga sewanya?", "Bisa COD tidak?"];
const BASE_WS = import.meta.env.VITE_WS_URL || "ws://localhost:3000";
const POLL_INTERVAL_MS = 8000;

export default function ChatPage() {
  const user     = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  const [mobileSidebar,    setMobileSidebar]    = useState(true);
  const [text,             setText]             = useState("");
  const [agreement,        setAgreement]        = useState(null);
  const [agLoading,        setAgLoading]        = useState(false);
  const [actionLoading,    setActionLoading]    = useState(false);
  const [showGuarantee,    setShowGuarantee]    = useState(false);
  const [showReview,       setShowReview]       = useState(false);
  const [agreementProduct, setAgreementProduct] = useState(null);

  const initiatedRef = useRef(new Set());
  const endRef       = useRef(null);
  const wsRef        = useRef(null);

  const {
    users, targetUser, messages, loading,
    usersLoading, sendMessage, chooseUser, refreshMessages,
  } = useChat(user?.id);

  const localProduct = (() => {
    try {
      const s = localStorage.getItem("targetChatProduct");
      console.log('localProduct raw:', s);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  })();

  const product = localProduct || agreementProduct;

  const isSeller = !!(
    (localProduct && user?.id === localProduct.ownerId) ||
    (agreement   && user?.id === agreement.sellerId)
  );
  const isBuyer = !!(
    (localProduct && user?.id !== localProduct.ownerId) ||
    (agreement   && user?.id === agreement.buyerId)
  );

  const buyerId  = agreement?.buyerId  ?? (isBuyer  ? user?.id : targetUser?.id) ?? null;
  const sellerId = agreement?.sellerId ?? (isSeller ? user?.id : targetUser?.id) ?? null;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchAgreement = useCallback(async () => {
    if (!targetUser || !user) return;
    console.log('fetchAgreement:', { localProduct, buyerId, sellerId });
    setAgLoading(true);
    try {
      let data = null;
      if (localProduct?.id && buyerId && sellerId) {
        data = await apiFetch(
          `/api/rental/agreement?buyerId=${buyerId}&sellerId=${sellerId}&itemId=${localProduct.id}`
        ).catch(() => null);
      }
      if (!data) {
        data = await apiFetch(
          `/api/rental/between?userId=${user.id}&otherId=${targetUser.id}`
        ).catch(() => null);
      }
      setAgreement(data || null);
      if (data?.itemId && !localProduct) {
        apiFetch(`/api/items/${data.itemId}`)
          .then(item => setAgreementProduct({
            id:      item.id,
            title:   item.title,
            price:   item.price_per_day ?? item.price,
            image:   item.image,
            status:  item.status,
            ownerId: item.owner_id,
          }))
          .catch(() => {});
      }
    } catch {
      setAgreement(null);
    } finally {
      setAgLoading(false);
    }
  }, [targetUser?.id, user?.id, localProduct?.id]);

  useEffect(() => {
    setAgreementProduct(null);
    setAgreement(null);
    if (targetUser?.id) fetchAgreement();
  }, [targetUser?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    const ws = new WebSocket(`${BASE_WS}?token=${token}`);
    wsRef.current = ws;
    ws.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.type === "agreement_update" || payload.type === "rental_request") {
          fetchAgreement();
          if (targetUser?.id) refreshMessages(targetUser.id);
        }
      } catch {}
    };
    ws.onerror = () => {};
    return () => { ws.close(); };
  }, [user?.id]);

  useEffect(() => {
    if (!targetUser?.id) return;
    const interval = setInterval(fetchAgreement, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [targetUser?.id]);

  useEffect(() => {
    if (!targetUser || !localProduct || !user || !buyerId || !sellerId) return;
    if (!isBuyer) return;
    const key = `${buyerId}-${sellerId}-${localProduct.id}`;
    if (initiatedRef.current.has(key)) return;
    initiatedRef.current.add(key);
    apiFetch("/api/rental/initiate", {
      method: "POST",
      body: JSON.stringify({ buyerId, sellerId, itemId: localProduct.id }),
    })
      .then(res => { if (res?.agreement) setAgreement(res.agreement); })
      .catch(() => {});
  }, [targetUser?.id, localProduct?.id]);

  async function doAction(endpoint, body) {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await apiFetch(endpoint, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      });
      await fetchAgreement();
      if (targetUser?.id) await refreshMessages(targetUser.id);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  const handlers = {
    onApprove:       () => doAction("/api/rental/approve", { buyerId, sellerId, itemId: product?.id }),
    onReceived:      () => doAction(`/api/rental/${agreement?.id}/confirm-received`),
    onReturned:      () => doAction(`/api/rental/${agreement?.id}/confirm-returned`),
    onOpenGuarantee: () => setShowGuarantee(true),
    onReview:        () => setShowReview(true),
  };

  function handleChooseUser(u) {
    setAgreementProduct(null);
    setAgreement(null);
    chooseUser(u);
    setMobileSidebar(false);
  }

  if (!user) return <Navigate to="/login" replace />;

  const showActionBar = !!(targetUser && product);

  return (
    <div className="flex h-screen" style={{ background: "#FAF8FF" }}>

      {/* Sidebar */}
      <ChatSidebar
        users={users}
        targetUser={targetUser}
        onSelect={handleChooseUser}
        loading={usersLoading}
        onClose={mobileSidebar}
      />

      {mobileSidebar && (
        <div className="fixed inset-0 bg-black/20 z-10 md:hidden"
          onClick={() => setMobileSidebar(false)} />
      )}

      {/* Area chat utama */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <ChatHeader
          targetUser={targetUser}
          onOpenSidebar={() => setMobileSidebar(true)}
        />

        {/* Pinned product */}
        {targetUser && product && <ProductPin product={product} />}

        {/* Rental badges */}
        {agreement && <RentalBadges agreement={agreement} />}

        {/* Action bar */}
        {showActionBar && (
          <div className="flex-shrink-0 px-4 py-3 bg-white" style={{ borderBottom: "1px solid #E8DCFF" }}>
            {agLoading ? (
              <div className="w-full h-10 rounded-2xl animate-pulse" style={{ background: "#E8DCFF" }} />
            ) : (
              <RentalActionBar
                agreement={agreement}
                isSeller={isSeller}
                isBuyer={isBuyer}
                loading={actionLoading}
                {...handlers}
              />
            )}
          </div>
        )}

        {!showActionBar && targetUser && agreement && agLoading && (
          <div className="flex-shrink-0 px-4 py-3 bg-white" style={{ borderBottom: "1px solid #E8DCFF" }}>
            <div className="w-full h-10 rounded-2xl animate-pulse" style={{ background: "#E8DCFF" }} />
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3 scrollbar-none"
          style={{ background: "#FAF8FF" }}>
          {!targetUser ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                style={{ background: "#E8DCFF" }}>💬</div>
              <h3 className="font-black text-lg" style={{ color: "#3D2F6B" }}>Selamat datang di Pesan</h3>
              <p className="text-sm max-w-xs" style={{ color: "#A89CC4" }}>
                Pilih percakapan dari sidebar untuk mulai chat.
              </p>
            </div>
          ) : loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className={`flex gap-2 ${i % 2 ? "flex-row-reverse" : ""}`}>
                <div className="w-7 h-7 rounded-full rp-skeleton flex-shrink-0" />
                <div className={`h-9 rounded-2xl rp-skeleton ${i % 2 ? "w-36" : "w-48"}`} />
              </div>
            ))
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-4xl mb-3">✉️</div>
              <p className="font-bold" style={{ color: "#3D2F6B" }}>Belum ada pesan</p>
              <p className="text-sm mt-1" style={{ color: "#A89CC4" }}>
                Mulai percakapan dengan quick reply di bawah
              </p>
            </div>
          ) : messages.map(msg => (
            <MessageBubble
              key={msg.pesan_id || msg.id}
              message={msg}
              myId={user.id}
              senderName={targetUser.name || targetUser.username}
            />
          ))}
          <div ref={endRef} />
        </div>

        {/* Quick replies + input */}
        {targetUser && (
          <div className="flex-shrink-0 bg-white" style={{ borderTop: "1px solid #E8DCFF" }}>
            <div className="flex items-center gap-2 px-4 pt-3 pb-1 overflow-x-auto scrollbar-none">
              {QUICK_REPLIES.map(r => (
                <button key={r} onClick={() => setText(r)}
                  className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border font-bold whitespace-nowrap"
                  style={{ borderColor: "#7C4DFF", color: "#7C4DFF", background: "#F3EEFF" }}>
                  {r}
                </button>
              ))}
            </div>
            <MessageInput text={text} setText={setText} onSend={sendMessage} disabled={loading} />
            <div className="flex justify-center pb-2">
              <a href="mailto:admin@rentopia.id"
                className="text-[10px] flex items-center gap-1" style={{ color: "#A89CC4" }}>
                <AlertTriangle size={10} /> Ada masalah? Hubungi Admin Rentopia
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showGuarantee && (
        <GuaranteeModal
          buyerId={buyerId}
          sellerId={sellerId}
          itemId={product?.id}
          onSuccess={async () => {
            setShowGuarantee(false);
            await fetchAgreement();
            if (targetUser?.id) await refreshMessages(targetUser.id);
          }}
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