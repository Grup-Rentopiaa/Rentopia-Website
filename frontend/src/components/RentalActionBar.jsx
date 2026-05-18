/**
 * Rental action bar — shows the correct button/label for each rental state.
 *
 * SIMPLIFIED FLOW (per user request):
 *   pending           → seller: "Setujui Penyewaan"
 *   approved          → buyer:  "Kirim Data Jaminan"
 *   guarantee_submitted → buyer: "✅ Saya Sudah Terima Barang" (COD terjadi offline)
 *                         seller: info label saja
 *   received          → seller: "🔄 Barang Sudah Dikembalikan"
 *                         buyer:  info masa sewa berjalan
 *   returned          → buyer:  "⭐ Tulis Ulasan"
 *   reviewed          → selesai
 */
export default function RentalActionBar({
  agreement, isSeller, isBuyer, loading,
  onApprove, onOpenGuarantee, onReceived, onReturned, onReview,
}) {
  if (loading) {
    return <div className="w-full h-10 rounded-2xl animate-pulse" style={{ background: "#E8DCFF" }} />;
  }
  if (!isSeller && !isBuyer) return null;

  const status = agreement?.status;

  function Label({ text, icon = "⏳" }) {
    return (
      <p className="text-center text-xs py-2.5 font-semibold italic" style={{ color: "#A89CC4" }}>
        {icon} {text}
      </p>
    );
  }

  function Btn({ onClick, children, color = "purple", disabled: dis }) {
    const styles = {
      purple: {
        bg: "linear-gradient(135deg,#C9B8FF,#B09FEF)",
        text: "#3D2F6B",
      },
      pink: {
        bg: "linear-gradient(135deg,#FFD6EC,#FFB3D9)",
        text: "#9B4070",
      },
      green: {
        bg: "linear-gradient(135deg,#C9EFDC,#A0DFC0)",
        text: "#2D7A55",
      },
    };
    const s = styles[color] || styles.purple;
    return (
      <button
        onClick={onClick}
        disabled={!!dis}
        className="w-full py-3 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        style={{ background: dis ? "#E8DCFF" : s.bg, color: dis ? "#A89CC4" : s.text, border: "none" }}
      >
        {children}
      </button>
    );
  }

  // ── No agreement yet or pending → seller can approve ──────────────────────
  if (!status || status === "pending") {
    if (isSeller) return <Btn onClick={onApprove}>👍 Setujui Penyewaan</Btn>;
    return <Label text="Menunggu persetujuan penjual..." />;
  }

  // ── Approved → buyer sends guarantee data ─────────────────────────────────
  if (status === "approved") {
    if (isBuyer) return <Btn onClick={onOpenGuarantee} color="pink">🛡️ Kirim Data Jaminan</Btn>;
    return <Label text="Menunggu data jaminan dari penyewa..." />;
  }

  // ── Guarantee submitted → buyer confirms receipt (COD done offline) ────────
  // Seller has no action here — the handover happens in real life (COD)
  if (status === "guarantee_submitted") {
    if (isBuyer) {
      return (
        <div className="flex flex-col gap-2">
          <p className="text-center text-xs font-semibold" style={{ color: "#2D7A55" }}>
            📋 Data jaminan terkirim. Lakukan COD dengan penjual, lalu:
          </p>
          <Btn onClick={onReceived} color="green">✅ Saya Sudah Menerima Barang</Btn>
        </div>
      );
    }
    return <Label text="Menunggu penyewa konfirmasi penerimaan barang..." icon="📦" />;
  }

  // ── handover_confirmed (legacy, map to same as guarantee_submitted) ─────────
  if (status === "handover_confirmed") {
    if (isBuyer) return <Btn onClick={onReceived} color="green">✅ Saya Sudah Menerima Barang</Btn>;
    return <Label text="Menunggu penyewa konfirmasi penerimaan..." />;
  }

  // ── Received → masa sewa berjalan, seller confirms return ──────────────────
  if (status === "received") {
    if (isSeller) {
      return (
        <div className="flex flex-col gap-2">
          <p className="text-center text-xs font-semibold" style={{ color: "#9B4070" }}>
            Masa sewa sedang berjalan. Konfirmasi saat barang sudah kembali:
          </p>
          <Btn onClick={onReturned} color="pink">🔄 Barang Sudah Dikembalikan ke Saya</Btn>
        </div>
      );
    }
    return <Label text="Masa sewa berjalan. Kembalikan barang tepat waktu." icon="🟢" />;
  }

  // ── Returned → buyer can write review ─────────────────────────────────────
  if (status === "returned") {
    if (isBuyer) {
      return (
        <div className="flex flex-col gap-2">
          <p className="text-center text-xs font-semibold" style={{ color: "#9B87D9" }}>
            Penyewaan selesai! Bagikan pengalamanmu:
          </p>
          <Btn onClick={onReview} color="pink">⭐ Tulis Ulasan untuk Produk Ini</Btn>
        </div>
      );
    }
    return <Label text="Menunggu ulasan dari penyewa..." icon="⭐" />;
  }

  // ── Reviewed → done ────────────────────────────────────────────────────────
  if (status === "reviewed") {
    return (
      <p className="text-center text-xs py-2 font-bold" style={{ color: "#2D7A55" }}>
        🎉 Penyewaan selesai &amp; sudah diulas. Terima kasih!
      </p>
    );
  }

  return null;
}
