export default function MessageBubble({ message, myId }) {
  const isMe = Number(message.sender_id) === Number(myId);

  return (
    <div className={`message ${isMe ? "message-sent" : "message-received"}`}>
      {message.isi_pesan}
    </div>
  );
}
