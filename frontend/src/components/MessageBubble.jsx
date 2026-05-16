function formatTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getAvatarColor(name = "") {
  const colors = [
    "bg-purple-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-teal-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

export default function MessageBubble({ message, myId, senderName = "" }) {
  const isMe = Number(message.sender_id) === Number(myId);
  const initials = (senderName || "?")[0].toUpperCase();
  const colorClass = getAvatarColor(senderName);
  const isOptimistic = String(message.pesan_id).startsWith("opt_");

  return (
    <div
      className={`flex items-end gap-2 group ${
        isMe ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar for received messages */}
      {!isMe && (
        <div
          className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mb-1 ${colorClass}`}
        >
          {initials}
        </div>
      )}

      <div
        className={`flex flex-col gap-1 max-w-[68%] ${
          isMe ? "items-end" : "items-start"
        }`}
      >
        {/* Bubble */}
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm transition-all
            ${
              isMe
                ? "bg-purple-600 text-white rounded-2xl rounded-tr-sm"
                : "bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-100"
            }
            ${isOptimistic ? "opacity-70" : "opacity-100"}
          `}
        >
          {message.isi_pesan}
        </div>

        {/* Timestamp */}
        <div
          className={`flex items-center gap-1 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity px-1`}
        >
          <span>{formatTime(message.waktu)}</span>
          {isMe && (
            <span className="text-purple-400">
              {isOptimistic ? "⏳" : "✓✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
