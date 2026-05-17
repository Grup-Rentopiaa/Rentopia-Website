function formatTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function getAvatarColor(name = "") {
  const colors = ["#C9B8FF","#FFD6EC","#D6F0FF","#C9EFDC","#FFB3D9","#A8DAFF"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

export default function MessageBubble({ message, myId, senderName = "" }) {
  const isMe = Number(message.sender_id) === Number(myId);
  const isOptimistic = String(message.pesan_id).startsWith("opt_");
  const initials = (senderName || "?")[0].toUpperCase();
  const avatarColor = getAvatarColor(senderName);

  return (
    <div className={`flex items-end gap-2 group ${isMe ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar for received */}
      {!isMe && (
        <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black mb-1"
          style={{ background: avatarColor, color: "#3D2F6B" }}>
          {initials}
        </div>
      )}

      <div className={`flex flex-col gap-0.5 max-w-[68%] ${isMe ? "items-end" : "items-start"}`}>
        <div
          className="px-4 py-2.5 text-sm leading-relaxed"
          style={{
            background: isMe ? "linear-gradient(135deg, #C9B8FF, #B09FEF)" : "#FFFFFF",
            color: isMe ? "#3D2F6B" : "#3D2F6B",
            borderRadius: isMe ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
            boxShadow: "0 2px 8px rgba(180,150,255,0.12)",
            border: isMe ? "none" : "1px solid #E8DCFF",
            opacity: isOptimistic ? 0.7 : 1,
            fontFamily: "Nunito, sans-serif",
          }}
        >
          {message.isi_pesan}
        </div>
        <div className="flex items-center gap-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px]" style={{ color: "#A89CC4" }}>{formatTime(message.waktu)}</span>
          {isMe && <span className="text-[10px]" style={{ color: "#C9B8FF" }}>{isOptimistic ? "⏳" : "✓✓"}</span>}
        </div>
      </div>
    </div>
  );
}
