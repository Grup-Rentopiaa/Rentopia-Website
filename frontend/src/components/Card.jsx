
import { Star, ChevronRight } from "lucide-react";

export default function Card({ product }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-blue-500">
      {/* Gambar produk */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold text-slate-800 shadow-sm">
          {product.category}
        </div>
      </div>

      {/* Info produk */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1 text-sm text-slate-600 mb-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-slate-800">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 line-clamp-2">{product.name}</h3>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Mulai dari</p>
            <p className="text-lg font-black text-blue-600">
              {product.price}
              <span className="text-sm font-normal text-slate-500">/hari</span>
            </p>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors hover:bg-blue-600 hover:text-white">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
