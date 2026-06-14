export default function RentalBadges({ agreement }) {
  if (!agreement) return null;

  const daysLeft = agreement.endDate
    ? Math.max(0, Math.ceil((new Date(agreement.endDate) - new Date()) / 86400000))
    : null;

  return (
    <>
      {/* Rental countdown badge */}
      {agreement.status === "received" && daysLeft !== null && (
        <div
          className="flex-shrink-0 mx-4 mt-3 px-4 py-2 rounded-2xl flex items-center gap-2"
          style={{
            background: daysLeft <= 1 ? "#FFD6EC" : "#C9EFDC",
            color: daysLeft <= 1 ? "#9B4070" : "#2D7A55",
          }}
        >
          <span className="text-sm font-black">
            {daysLeft <= 0 ? "⚠️ Masa sewa habis hari ini!" : `⏳ Sisa ${daysLeft} hari sewa`}
          </span>
          {agreement.endDate && (
            <span className="text-xs ml-auto">
              s/d {new Date(agreement.endDate).toLocaleDateString("id-ID")}
            </span>
          )}
        </div>
      )}

      {/* Rental code badge */}
      {agreement.rentalCode && (
        <div className="flex-shrink-0 mx-4 mt-2">
          <div
            className="px-4 py-2 rounded-xl text-xs font-bold text-center"
            style={{ background: "#C9EFDC", color: "#2D7A55" }}
          >
            🔑 Kode Sewa: {agreement.rentalCode}
            {agreement.durationDays && (
              <span className="ml-2 font-normal" style={{ color: "#5DAA80" }}>
                · {agreement.durationDays} hari
                {agreement.endDate && ` · s/d ${new Date(agreement.endDate).toLocaleDateString("id-ID")}`}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
