export default function AlertBanner({ type, message }) {
  if (!message) return null;
  const cls = type === "error"
    ? "bg-red-50 text-red-600 border border-red-200"
    : "bg-green-50 text-green-700 border border-green-200";
  return (
    <div className={`text-sm px-4 py-2.5 rounded-xl font-medium ${cls}`}>
      {message}
    </div>
  );
}