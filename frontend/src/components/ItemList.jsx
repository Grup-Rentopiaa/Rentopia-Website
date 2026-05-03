import { PackageSearch } from 'lucide-react';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';

const SKELETON_COUNT = 8;

export default function ItemList({ items, loading }) {
  if (loading) {
    return (
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div className="skeleton h-4 w-32 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <PackageSearch size={36} className="text-gray-300" />
        </div>
        <h3 className="text-base font-semibold text-gray-700 mb-1">
          Produk tidak ditemukan
        </h3>
        <p className="text-sm text-gray-400 max-w-xs">
          Coba ubah kata kunci, pilih kategori lain, atau sesuaikan filter pencarian kamu.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0">
      {/* Header hasil */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          Menampilkan <span className="font-semibold text-gray-800">{items.length}</span> produk
        </p>
      </div>

      {/* Grid produk */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(item => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
