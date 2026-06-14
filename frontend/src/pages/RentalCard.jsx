export default function RentalCard({ rental, onReview }) {
  const statusColor = {
    ongoing: 'bg-purple-50 text-purple-700 border-purple-200',
    done:    'bg-slate-50 text-slate-500 border-slate-200',
    urgent:  'bg-red-50 text-red-600 border-red-200',
  }

  const statusLabel = {
    ongoing: 'Aktif',
    done:    'Selesai',
    urgent:  'Mendesak',
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-purple-500">
      {/* No image placeholder for rentals */}
      <div className="flex flex-1 flex-col p-4 gap-2">
        <div>
          <p className="font-bold text-slate-900 leading-tight text-sm">{rental.title}</p>
          <p className="text-xs text-slate-400 mt-0.5">{rental.store}</p>
        </div>
        <p className="text-sm font-bold text-purple-600">{rental.price}</p>
        {rental.note && <p className="text-xs text-slate-400 italic">{rental.note}</p>}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor[rental.status]}`}>
            {statusLabel[rental.status]}
          </span>
          {rental.status === 'done' && rental.itemId && (
            <button 
              onClick={() => onReview && onReview(rental)}
              className="text-[10px] font-bold bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700 transition-colors shadow-sm"
            >
              Beri Review
            </button>
          )}
        </div>
      </div>
    </div>
  )
}