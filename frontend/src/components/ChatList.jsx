function timeAgo(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Baru";
  if (diffMin < 60) return `${diffMin}m`;
  const diffHour = Math.floor(diffMs / 3600000);
  if (diffHour < 24) return `${diffHour}j`;
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffDay === 1) return "Kmrn";
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function getAvatarColor(name = "") {
  const colors = ["#C9B8FF","#FFD6EC","#D6F0FF","#C9EFDC","#FFB3D9","#A8DAFF"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

export default function ChatList({ users, targetUser, onSelect, loading }) {
  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ borderColor: "#E8DCFF" }}>
            <div className="w-11 h-11 rounded-full rp-skeleton flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="rp-skeleton h-3 w-3/4" />
              <div className="rp-skeleton h-2.5 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-3">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl" style={{ background: "#E8DCFF" }}>
          💬
        </div>
        <p className="text-sm font-bold" style={{ color: "#7B6AAA" }}>Belum ada percakapan</p>
        <p className="text-xs" style={{ color: "#A89CC4" }}>Mulai chat dari halaman produk</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {users.map(u => {
        const initials    = (u.name || u.username || "?")[0].toUpperCase();
        const color       = getAvatarColor(u.name || u.username || "");
        const isActive    = targetUser?.id === u.id;

        return (
          <div
            key={u.id}
            onClick={() => onSelect(u)}
            className="flex items-center gap-3 px-4 py-3.5 cursor-pointer border-b relative transition-colors"
            style={{
              borderColor: "#E8DCFF",
              background: isActive ? "#FAF8FF" : "transparent",
              borderRight: isActive ? "3px solid #C9B8FF" : "3px solid transparent",
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#FAF8FF"; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
          >
            {/* Avatar */}
            <div className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-black"
              style={{ background: color, color: "#3D2F6B" }}>
              {initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold truncate" style={{ color: isActive ? "#9B87D9" : "#3D2F6B" }}>
                  {u.name || u.username}
                </span>
                {u.last_time && (
                  <span className="text-[10px] flex-shrink-0" style={{ color: "#A89CC4" }}>
                    {timeAgo(u.last_time)}
                  </span>
                )}
              </div>
              <p className="text-xs truncate mt-0.5" style={{ color: "#A89CC4" }}>
                {u.last_message || "Mulai percakapan..."}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
