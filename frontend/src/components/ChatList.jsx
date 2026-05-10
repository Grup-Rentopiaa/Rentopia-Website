export default function ChatList({ users, targetUser, onSelect }) {
  return (
    <div className="chat-items">
      {users.length === 0 ? (
        <div className="p-10 text-center text-sm text-gray-400">Belum ada user lain</div>
      ) : (
        users.map((u) => (
          <div
            key={u.id}
            className={`chat-item ${targetUser?.id === u.id ? "chat-item-active" : ""}`}
            onClick={() => onSelect(u)}
          >
            <div className="chat-text">
              <span className="chat-name">{u.name}</span>
              <span className="chat-last">{u.last_message || "Belum ada pesan"}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
