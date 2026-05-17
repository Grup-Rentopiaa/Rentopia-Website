import { Send } from "lucide-react";
import { useRef } from "react";

export default function MessageInput({ text, setText, onSend, disabled }) {
  const inputRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    const success = await onSend(text);
    if (success) { setText(""); inputRef.current?.focus(); }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3 px-4 py-3 bg-white" style={{ borderTop: "1px solid #E8DCFF" }}>
      <textarea
        ref={inputRef}
        rows={1}
        value={text}
        onChange={e => {
          setText(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
        }}
        onKeyDown={handleKeyDown}
        placeholder="Ketik pesan... (Enter kirim)"
        disabled={disabled}
        className="flex-1 resize-none overflow-hidden px-4 py-2.5 text-sm outline-none transition-all"
        style={{
          background: "#FAF8FF",
          border: "2px solid #E8DCFF",
          borderRadius: "14px",
          color: "#3D2F6B",
          fontFamily: "Nunito, sans-serif",
          minHeight: "42px",
          maxHeight: "120px",
        }}
        onFocus={e => { e.target.style.borderColor = "#C9B8FF"; }}
        onBlur={e => { e.target.style.borderColor = "#E8DCFF"; }}
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
        style={{ background: text.trim() ? "linear-gradient(135deg, #C9B8FF, #B09FEF)" : "#E8DCFF", color: text.trim() ? "#3D2F6B" : "#A89CC4" }}
      >
        <Send size={16} />
      </button>
    </form>
  );
}
