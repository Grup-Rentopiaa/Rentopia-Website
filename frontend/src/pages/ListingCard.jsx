export default function ListingCard({ listing, onEdit, onDelete }) {
  const statusColor = {
    available: 'bg-green-50 text-green-700 border-green-200',
    rented:    'bg-amber-50 text-amber-700 border-amber-200',
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-purple-500">
      {/* Image */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {listing.image ? (
          <img src={listing.image} alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 gap-2">
        <div>
          <p className="font-bold text-slate-900 leading-tight text-sm">{listing.title}</p>
          <p className="text-xs text-slate-400 mt-0.5">{listing.brand}</p>
            {listing.category && (
    <span className="mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
      {listing.category}
    </span>
  )}
        </div>
        <p className="text-sm font-bold text-purple-600">{listing.price}</p>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor[listing.status]}`}>
            {listing.status === 'available' ? 'Tersedia' : 'Disewa'}
          </span>
          <div className="flex gap-2">
            <button onClick={onEdit}
              className="text-[11px] font-semibold text-purple-500 hover:text-purple-700 transition-colors">
              Edit
            </button>
            <button onClick={onDelete}
              className="text-[11px] font-semibold text-red-400 hover:text-red-600 transition-colors">
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}