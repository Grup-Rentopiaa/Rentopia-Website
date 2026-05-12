import { useNavigate } from "react-router-dom"

export default function ItemCard({ item }) {
  const navigate = useNavigate()
  const isAvailable = item.status !== 'rented'
  
  return (
    <div 
      onClick={() => navigate(`/product/${item.id}`)}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-blue-500 cursor-pointer"
    >
      {/* Image */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {item.image ? (
          <img src={item.image} alt={item.title}
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
          <p className="font-bold text-slate-900 leading-tight text-sm">{item.title}</p>
          <p className="text-xs text-slate-400 mt-0.5">{item.location || 'Lokasi tidak tersedia'}</p>
          {item.category_name && (
            <span className="mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              {item.category_name}
            </span>
          )}
        </div>
        <p className="text-sm font-bold text-blue-600">Rp {Number(item.price_per_day).toLocaleString('id-ID')}<span className="text-xs text-slate-400 font-normal">/hari</span></p>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isAvailable ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
            {isAvailable ? 'Tersedia' : 'Disewa'}
          </span>
        </div>
      </div>
    </div>
  )
}
