function formatTime(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function MessageBubble({ message, myId }) {
  console.log("RENDER MESSAGE:", message);

  const isMine = Number(message.sender_id) === Number(myId);

  return (
    <div className={`message ${isMine ? "message-sent" : "message-received"}`}>
      <div>{message.isi_pesan}</div>
      <div className="mt-1 text-right text-[10px] opacity-80">
        {formatTime(message.waktu)}
      </div>
    </div>
  );
}