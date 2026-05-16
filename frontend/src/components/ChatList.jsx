// Helper: get consistent avatar color based on name
function getAvatarColor(name = "") {
  const colors = [
    "bg-purple-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-rose-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} mnt`;
  if (diffHour < 24) return `${diffHour} jam`;
  if (diffDay === 1) return "Kemarin";
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export default function ChatList({ users, targetUser, onSelect, loading }) {
  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 border-b border-gray-100"
            >
              <div className="w-11 h-11 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-3">
        <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-2xl">
          💬
        </div>
        <p className="text-sm font-semibold text-gray-500">Belum ada percakapan</p>
        <p className="text-xs text-gray-400">Mulai chat dari halaman produk</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {users.map((u) => {
        const initials = (u.name || u.username || "?")[0].toUpperCase();
        const colorClass = getAvatarColor(u.name || u.username || "");
        const isActive = targetUser?.id === u.id;

        return (
          <div
            key={u.id}
            onClick={() => onSelect(u)}
            className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer border-b border-gray-50 transition-all duration-150 relative
              ${isActive
                ? "bg-purple-50 border-r-[3px] border-r-purple-600"
                : "hover:bg-gray-50"
              }`}
          >
            {/* Avatar */}
            <div
              className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm ${colorClass}`}
            >
              {initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-sm font-semibold truncate ${
                    isActive ? "text-purple-700" : "text-gray-900"
                  }`}
                >
                  {u.name || u.username}
                </span>
                {u.last_time && (
                  <span className="text-[10px] text-gray-400 flex-shrink-0">
                    {timeAgo(u.last_time)}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {u.last_message || "Mulai percakapan..."}
              </p>
            </div>

            {/* Active indicator */}
            {isActive && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-600 rounded-l-full" />
            )}
          </div>
        );
      })}
    </div>
  );
}
