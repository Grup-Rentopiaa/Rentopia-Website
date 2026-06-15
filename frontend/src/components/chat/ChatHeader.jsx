import { ArrowLeft } from "lucide-react";

function getAvatarColor(name = "") {
  const colors = ["#C9B8FF", "#FFD6EC", "#D6F0FF", "#C9EFDC", "#FFB3D9", "#A8DAFF"];
  let h = 0;
  for (const c of (name || "")) h += c.charCodeAt(0);
  return colors[h % colors.length];
}

export default function ChatHeader({ targetUser, onOpenSidebar }) {
  const targetColor    = getAvatarColor(targetUser?.username || "");
  const targetInitials = (targetUser?.name || targetUser?.username || "?")[0]?.toUpperCase();

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
      style={{ background: "#7C4DFF", borderBottom: "1px solid rgba(255,255,255,0.15)" }}
    >
      <button
        onClick={onOpenSidebar}
        className="md:hidden p-2 rounded-xl"
        style={{ color: "rgba(255,255,255,0.8)" }}
      >
        <ArrowLeft size={20} />
      </button>

      {targetUser ? (
        <>
          {targetUser.avatarB64 ? (
            <img
              src={targetUser.avatarB64}
              alt={targetUser.username}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              style={{ border: "2px solid rgba(255,255,255,0.4)" }}
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
            >
              {targetInitials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-sm truncate text-white">
              {targetUser.name || targetUser.username}
            </h3>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>● Aktif</p>
          </div>
        </>
      ) : (
        <p className="text-sm text-white" style={{ opacity: 0.7 }}>Pilih percakapan</p>
      )}
    </div>
  );
}
