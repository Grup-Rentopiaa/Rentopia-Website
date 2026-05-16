export default function InputField({ label, name, type = "text", placeholder, value, onChange, error, icon: Icon, required, autoComplete }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative flex items-center">
        {Icon && <Icon className="absolute left-3 text-slate-400 pointer-events-none" size={16} />}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-4 ${Icon ? "pl-9" : ""} ${error ? "border-red-400 focus:ring-red-50" : "border-slate-300 focus:border-purple-500 focus:ring-purple-50"}`}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium flex items-center gap-1"><span>⚠</span> {error}</p>}
    </div>
  );
}