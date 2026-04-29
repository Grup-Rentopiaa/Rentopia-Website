export default function ChatList({ users, targetUser, onSelect }) {
  return (
    <div className="flex-1 overflow-y-auto">
      {users.length === 0 ? (
        <div className="mt-5 text-center text-sm text-slate-500">
          Belum ada user lain
        </div>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelect(user)}
            className={`cursor-pointer border-b border-slate-100 px-[14px] py-3 transition hover:bg-slate-50 ${
              Number(targetUser?.id) === Number(user.id) ? "bg-[#e0ecff]" : ""
            }`}
          >
            <div className="text-sm font-semibold">{user.name}</div>
            <div className="mt-0.5 truncate text-xs text-slate-500">
              {user.last_message || "Belum ada pesan"}
            </div>
          </div>
        ))
      )}
    </div>
  );
}