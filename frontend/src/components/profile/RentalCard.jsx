export default function RentalCard({ r }) {
  const daysLeft = r.daysLeft;
  const urgent = daysLeft !== null && daysLeft <= 1;

  const statusLabel = {
    approved: { text: "Disetujui — menunggu jaminan", color: "#9B87D9", bg: "#E8DCFF" },
    guarantee_submitted: { text: "Jaminan terkirim — menunggu COD", color: "#7B6AAA", bg: "#D6F0FF" },
    handover_confirmed: { text: "Barang siap — konfirmasi penerimaan", color: "#2D7A55", bg: "#C9EFDC" },
    received: { text: "Sedang berjalan", color: "#2D7A55", bg: "#C9EFDC" },
  }[r.status] || { text: r.status, color: "#A89CC4", bg: "#F5F0FF" };

  return (
    <div className="rp-card p-4 flex gap-4">
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#E8DCFF" }}>
        {r.item?.image
          ? <img src={r.item.image} alt={r.item.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm line-clamp-1" style={{ color: "#3D2F6B" }}>{r.item?.title || "—"}</h3>
        <p className="text-xs mt-0.5" style={{ color: "#A89CC4" }}>dari {r.seller?.username || "—"}</p>
        <span
          className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: statusLabel.bg, color: statusLabel.color }}
        >
          {statusLabel.text}
        </span>
        {r.rentalCode && (
          <p className="text-xs font-bold mt-1" style={{ color: "#9B87D9" }}>🔑 {r.rentalCode}</p>
        )}
        {r.durationDays && (
          <p className="text-[10px] mt-0.5" style={{ color: "#A89CC4" }}>
            Durasi: {r.durationDays} hari
            {r.endDate && ` · Berakhir: ${new Date(r.endDate).toLocaleDateString("id-ID")}`}
          </p>
        )}
        {r.status === "received" && daysLeft !== null && (
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`rp-badge text-[10px] ${urgent ? "rp-badge-pink" : "rp-badge-blue"}`}>
              {daysLeft <= 0
                ? "⚠️ Harus dikembalikan hari ini!"
                : urgent
                ? `⚠️ ${daysLeft} hari lagi`
                : `${daysLeft} hari lagi`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
