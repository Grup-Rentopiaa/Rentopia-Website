export default function RentalCard({ rental, onDelete }) {
  const statusColor = {
    ongoing: 'bg-green-50 text-green-700 border-green-200',
    done:    'bg-amber-50 text-amber-700 border-amber-200',
    urgent:  'bg-red-50 text-red-600 border-red-200',
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-blue-500">
      <div className="p-5 flex flex-col gap-3">
        <div className="text-3xl">{rental.icon}</div>
        <div>
          <p className="font-bold text-slate-900 leading-tight">
            {rental.title}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{rental.store}</p>
        </div>
        <p className="text-sm font-bold text-blue-600">{rental.price}</p>
        {rental.note && (
          <p className="text-xs text-slate-400 italic">{rental.note}</p>
        )}
        <div className="flex items-center justify-between mt-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor[rental.status]}`}>
            {rental.status === 'ongoing' ? 'Aktif' : rental.status === 'urgent' ? 'Mendesak' : 'Selesai'}
          </span>
          <button
            onClick={onDelete}
            className="text-[11px] text-red-400 hover:text-red-600 font-medium transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}