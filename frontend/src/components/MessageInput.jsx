export default function MessageInput({ text, setText, onSend }) {
  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const success = await onSend(text);
    if (success) setText("");
  }

  return (
    <form className="input-area" onSubmit={handleSubmit}>
      <input
        type="text"
        className="chat-input"
        placeholder="Ketik pesan..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="primary-pill-button">Kirim</button>
    </form>
  );
}
