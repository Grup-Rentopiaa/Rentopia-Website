export default function MessageInput({ text, setText, onSend }) {
  async function handleSend() {
    if (!text.trim()) return;

    const success = await onSend(text);
    if (success) {
      setText("");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSend();
    }
  }

  return (
    <div className="input-area">
      <input
        type="text"
        placeholder="Ketik pesan kamu di sini"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="chat-input"
      />
      <button
        type="button"
        className="primary-pill-button"
        onClick={handleSend}
      >
        Kirim
      </button>
    </div>
  );
}