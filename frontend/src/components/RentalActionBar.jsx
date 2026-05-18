/**
 * Displays context-sensitive action buttons for the current rental state.
 * States (string enum): pending → approved → guarantee_submitted →
 *   handover_confirmed → received → returned → reviewed
 *
 * isSeller = logged-in user is the product owner
 * isBuyer  = logged-in user is the renter
 */
export default function RentalActionBar({
  agreement, isSeller, isBuyer, loading,
  onApprove, onOpenGuarantee, onHandover, onReceived, onReturned, onReview,
}) {
  // While loading, show a subtle skeleton row rather than vanishing entirely
  if (loading) {
    return (
      <div className="w-full h-10 rounded-2xl animate-pulse" style={{ background: "#E8DCFF" }} />
    );
  }

  if (!isSeller && !isBuyer) return null;

  const status = agreement?.status;

  function Label({ text }) {
    return (
      <p className="text-center text-xs py-2.5 font-semibold italic" style={{ color: "#A89CC4" }}>
        {text}
      </p>
    );
  }

  function Btn({ onClick, children, pink, green, disabled: extraDisabled }) {
    const isDisabled = extraDisabled;
    const bg = isDisabled
      ? "#E8DCFF"
      : green
        ? "linear-gradient(135deg,#C9EFDC,#A0DFC0)"
        : pink
          ? "linear-gradient(135deg,#FFD6EC,#FFB3D9)"
          : "linear-gradient(135deg,#C9B8FF,#B09FEF)";
    const color = isDisabled ? "#A89CC4" : green ? "#2D7A55" : pink ? "#9B4070" : "#3D2F6B";
    return (
      <button
        onClick={onClick}
        disabled={isDisabled}
        className="w-full py-3 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed"
        style={{ background: bg, color, border: "none" }}
      >
        {children}
      </button>
    );
  }

  // ── State 0: No agreement yet or status is pending ──────────────────────────
  if (!status || status === "pending") {
    if (isSeller) return <Btn onClick={onApprove}>👍 Setujui Penyewaan</Btn>;
    return <Label text="Menunggu persetujuan penjual..." />;
  }

  // ── State 1: approved ───────────────────────────────────────────────────────
  if (status === "approved") {
    if (isBuyer)  return <Btn onClick={onOpenGuarantee} pink>🛡️ Kirim Data Jaminan</Btn>;
    return <Label text="Menunggu data jaminan dari penyewa..." />;
  }

  // ── State 2: guarantee_submitted ───────────────────────────────────────────
  if (status === "guarantee_submitted") {
    if (isSeller) return <Btn onClick={onHandover}>📦 Barang Sudah Diserahkan</Btn>;
    return <Label text="Menunggu serah terima barang..." />;
  }

  // ── State 3: handover_confirmed ─────────────────────────────────────────────
  if (status === "handover_confirmed") {
    if (isBuyer)  return <Btn onClick={onReceived} green>✅ Barang Sudah Diterima</Btn>;
    return <Label text="Menunggu konfirmasi penyewa..." />;
  }

  // ── State 4: received ───────────────────────────────────────────────────────
  if (status === "received") {
    if (isSeller) return <Btn onClick={onReturned} pink>🔄 Barang Sudah Dikembalikan</Btn>;
    return <Label text="Masa sewa berjalan..." />;
  }

  // ── State 5: returned ───────────────────────────────────────────────────────
  if (status === "returned") {
    if (isBuyer)  return <Btn onClick={onReview} pink>⭐ Tulis Ulasan</Btn>;
    return <Label text="Menunggu ulasan dari penyewa..." />;
  }

  // ── State 6: reviewed ───────────────────────────────────────────────────────
  if (status === "reviewed") {
    return (
      <p className="text-center text-xs py-2 font-bold" style={{ color: "#2D7A55" }}>
        ✅ Penyewaan selesai &amp; sudah diulas
      </p>
    );
  }

  return null;
}
