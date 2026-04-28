export default function RentalCard({ rental }) {
  const statusColor = {
    ongoing: 'bg-blue-50 text-blue-700 border-blue-200',
    done:    'bg-slate-50 text-slate-500 border-slate-200',
    urgent:  'bg-red-50 text-red-600 border-red-200',
  }

  const statusLabel = {
    ongoing: 'Aktif',
    done:    'Selesai',
    urgent:  'Mendesak',
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-blue-500">
      {/* No image placeholder for rentals */}
      <div className="flex flex-1 flex-col p-4 gap-2">
        <div>
          <p className="font-bold text-slate-900 leading-tight text-sm">{rental.title}</p>
          <p className="text-xs text-slate-400 mt-0.5">{rental.store}</p>
        </div>
        <p className="text-sm font-bold text-blue-600">{rental.price}</p>
        {rental.note && <p className="text-xs text-slate-400 italic">{rental.note}</p>}
        <div className="mt-auto pt-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor[rental.status]}`}>
            {statusLabel[rental.status]}
          </span>
        </div>
      </div>
    </div>
  )
}