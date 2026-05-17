import apiFetch from "../api";

/**
 * Displays context-sensitive action buttons for the current rental state.
 * States: pending(0) approved(1) guarantee_submitted(2) handover_confirmed(3) received(4) returned(5) reviewed
 */
export default function RentalActionBar({ agreement, isSeller, isBuyer, loading,
  onApprove, onOpenGuarantee, onHandover, onReceived, onReturned, onReview }) {

  if (loading || !isSeller && !isBuyer) return null;

  const status = agreement?.status;

  function Label({ text }) {
    return <p className="text-center text-xs py-2 font-semibold" style={{ color:"#A89CC4" }}>{text}</p>;
  }

  function Btn({ onClick, children, pink, green, disabled }) {
    const bg = green
      ? "linear-gradient(135deg,#C9EFDC,#A0DFC0)"
      : pink
        ? "linear-gradient(135deg,#FFD6EC,#FFB3D9)"
        : "linear-gradient(135deg,#C9B8FF,#B09FEF)";
    const color = green ? "#2D7A55" : pink ? "#9B4070" : "#3D2F6B";
    return (
      <button onClick={onClick} disabled={disabled}
        className="w-full py-3 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
        style={{ background: disabled ? "#E8DCFF" : bg, color: disabled ? "#A89CC4" : color, border:"none" }}>
        {children}
      </button>
    );
  }

  // No agreement yet or pending
  if (!status || status === "pending") {
    if (isSeller) return <Btn onClick={onApprove}>👍 Setujui Penyewaan</Btn>;
    return <Label text="Menunggu persetujuan penjual..." />;
  }

  if (status === "approved") {
    if (isBuyer)  return <Btn onClick={onOpenGuarantee} pink>🛡️ Kirim Data Jaminan</Btn>;
    return <Label text="Menunggu data jaminan dari penyewa..." />;
  }

  if (status === "guarantee_submitted") {
    if (isSeller) return <Btn onClick={onHandover}>📦 Barang Sudah Diserahkan</Btn>;
    return <Label text="Menunggu serah terima barang..." />;
  }

  if (status === "handover_confirmed") {
    if (isBuyer)  return <Btn onClick={onReceived} green>✅ Barang Sudah Diterima</Btn>;
    return <Label text="Menunggu konfirmasi penyewa..." />;
  }

  if (status === "received") {
    if (isSeller) return <Btn onClick={onReturned} pink>🔄 Barang Sudah Dikembalikan</Btn>;
    return <Label text="Masa sewa berjalan..." />;
  }

  if (status === "returned") {
    if (isBuyer)  return <Btn onClick={onReview} pink>⭐ Tulis Ulasan</Btn>;
    return <Label text="Menunggu ulasan dari penyewa..." />;
  }

  if (status === "reviewed") {
    return <p className="text-center text-xs py-2 font-bold" style={{ color:"#2D7A55" }}>✅ Penyewaan selesai &amp; sudah diulas</p>;
  }

  return null;
}
