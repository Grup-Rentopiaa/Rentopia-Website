import React, { useState } from 'react';
import { formatRupiah } from '../utils/format';

const IMG_BASE = 'http://localhost:5000/uploads/';

function ProductModal({ product, isLiked, onLikeToggle, onClose }) {
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!product) return null;

  const photos = product.photos || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-base">{product.name}</h3>
          <button className="bg-transparent border-none text-2xl cursor-pointer text-gray-500 p-1 rounded-md transition-colors hover:bg-gray-100" onClick={onClose}>✕</button>
        </div>
        <div className="p-6">
          {photos.length > 0 ? (
            <>
              <div className="w-full h-[260px] overflow-hidden rounded-xl bg-gray-100 mb-4 relative">
                <img className="w-full h-full object-cover" src={IMG_BASE + photos[photoIndex]} alt={product.name} />
              </div>
              {photos.length > 1 && (
                <div className="flex gap-1.5 justify-center mb-4">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      className={`w-2 h-2 rounded-full border-none cursor-pointer p-0 transition-colors ${i === photoIndex ? 'bg-[#1d6bcf]' : 'bg-gray-300'}`}
                      onClick={() => setPhotoIndex(i)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="h-[200px] bg-gray-100 rounded-xl flex items-center justify-center text-5xl mb-4">
              📦
            </div>
          )}

          <div className="flex justify-between items-center mb-3">
            <span className="text-[20px] font-bold text-[#1d6bcf]">
              {formatRupiah(product.price)}/hari
            </span>
            <button
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-base transition-colors ${isLiked ? 'text-red-500 hover:bg-red-50' : 'text-gray-500 hover:bg-red-50 hover:text-red-500'}`}
              onClick={() => onLikeToggle(product.id)}
            >
              {isLiked ? '❤️' : '🤍'} Suka
            </button>
          </div>

          <div className="mb-3">
            <span className={`px-3 py-1 rounded-md text-xs font-bold border ${product.status === 'tersedia' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
             {product.status === 'tersedia' ? '🟢 Tersedia' : '🔴 Sudah Disewa'}
            </span>
          </div>

          <div className="mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-[#1d6bcf]">{product.category}</span>
          </div>

          <p className="text-[13px] text-gray-500 my-2">
            📍 {product.location}
          </p>
          <p className="text-[13px] text-gray-500 mb-3">
            👁 {product.view_count} dilihat • ❤️ {product.like_count} suka
          </p>

          {product.description && (
            <p className="text-[14px] text-gray-700 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
