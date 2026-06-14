import { useState } from "react";

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


const RENTAL_CODE_RE = /RNT-[A-Z0-9]+(?:-[A-Z0-9]+)*/g;

function CopyableBadge({ code }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button
      onClick={handleCopy}
      title="Klik untuk menyalin"
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-black cursor-pointer transition-all hover:scale-105 active:scale-95"
      style={{ background: "#C9EFDC", color: "#2D7A55", border: "1px solid #A0DFC0" }}
    >
      {code} {copied ? "✓" : "📋"}
    </button>
  );
}

function renderWithCopyableCodes(text) {
  const parts = [];
  let lastIndex = 0;
  let match;
  const re = new RegExp(RENTAL_CODE_RE.source, "g");
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<CopyableBadge key={match.index} code={match[0]} />);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export default function MessageBubble({ message, myId, senderName = "" }) {
  const isSystem = message.is_system === true || message.sender_id === null;
  const isMe = !isSystem && Number(message.sender_id) === Number(myId);
  const isOptimistic = String(message.pesan_id).startsWith("opt_");
  const initials = (senderName || "?")[0].toUpperCase();
  const avatarColor = getAvatarColor(senderName);

  
  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div
          className="px-4 py-2 rounded-2xl text-xs italic text-center max-w-xs leading-relaxed"
          style={{
            background: "linear-gradient(135deg, #E8DCFF, #FFD6EC)",
            color: "#7B6AAA",
            boxShadow: "0 1px 4px rgba(180,150,255,0.15)",
          }}
        >
          {renderWithCopyableCodes(message.isi_pesan)}
        </div>
      </div>
    );
  }

  
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
            color: "#3D2F6B",
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
