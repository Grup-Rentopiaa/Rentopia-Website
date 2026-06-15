import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import ChatList from "../ChatList";

export default function ChatSidebar({ users, targetUser, onSelect, loading, onClose }) {
  const navigate = useNavigate();

  return (
    <aside
      className={`flex-shrink-0 w-72 flex flex-col border-r bg-white z-20
        ${onClose ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:relative absolute inset-y-0 left-0 transition-transform duration-300`}
      style={{ borderColor: "#E8DCFF" }}
    >
      <div className="px-5 py-4 flex items-center justify-between"
        style={{ background: "#7C4DFF" }}>
        <div className="flex items-center gap-2">
          <MessageCircle size={18} style={{ color: "rgba(255,255,255,0.8)" }} />
          <span className="font-black text-white">Pesan</span>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-xs px-2 py-1 rounded-lg font-bold"
          style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
        >
          <ArrowLeft size={14} />
        </button>
      </div>
      <ChatList
        users={users}
        targetUser={targetUser}
        onSelect={onSelect}
        loading={loading}
      />
    </aside>
  );
}
