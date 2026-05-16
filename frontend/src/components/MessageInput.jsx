import { useRef } from "react";
import { Send } from "lucide-react";

export default function MessageInput({ text, setText, onSend, disabled }) {
  const inputRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    const success = await onSend(text);
    if (success) {
      setText("");
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e) {
    // Send on Enter, Shift+Enter = new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 px-4 py-3 bg-white border-t border-gray-100"
    >
      <textarea
        ref={inputRef}
        rows={1}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          // Auto-resize
          e.target.style.height = "auto";
          e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
        }}
        onKeyDown={handleKeyDown}
        placeholder="Ketik pesan... (Enter untuk kirim)"
        disabled={disabled}
        className="flex-1 resize-none overflow-hidden px-4 py-2.5 bg-gray-50 border border-gray-200
                   rounded-2xl text-sm text-gray-800 placeholder-gray-400
                   outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100
                   transition-all disabled:opacity-50 leading-relaxed"
        style={{ minHeight: "42px", maxHeight: "120px" }}
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-600 text-white
                   flex items-center justify-center
                   hover:bg-purple-700 active:scale-95 transition-all
                   disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
      >
        <Send size={16} />
      </button>
    </form>
  );
}
