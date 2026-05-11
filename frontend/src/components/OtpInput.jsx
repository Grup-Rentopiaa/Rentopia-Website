import { useRef } from "react";

export default function OtpInput({ value, onChange }) {
  const digits = (value + "      ").slice(0, 6).split("");
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  function handleKey(i, e) {
    if (e.key === "Backspace") {
      const next = value.slice(0, i) + value.slice(i + 1);
      onChange(next);
      if (i > 0) refs[i - 1].current?.focus();
    } else if (/^\d$/.test(e.key)) {
      const arr = value.replace(/\D/g, "").split("");
      arr[i] = e.key;
      onChange(arr.join("").slice(0, 6));
      if (i < 5) refs[i + 1].current?.focus();
    }
  }

  return (
    <div className="flex justify-center gap-3">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d.trim()}
          onChange={() => {}}
          onKeyDown={(e) => handleKey(i, e)}
          className="w-11 h-12 text-center text-lg font-bold rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-slate-50"
        />
      ))}
    </div>
  );
}