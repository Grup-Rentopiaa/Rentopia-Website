export default function ProfileStatBox({ label, value, onClick }) {
  return (
    <div
      className={`flex flex-col items-center px-5 py-4 ${onClick ? "cursor-pointer hover:bg-purple-50 transition-colors" : ""}`}
      onClick={onClick}
    >
      <p className="text-2xl font-black" style={{ color: "#9B87D9" }}>{value}</p>
      <p className="text-xs font-semibold mt-0.5" style={{ color: "#A89CC4" }}>{label}</p>
    </div>
  );
}
