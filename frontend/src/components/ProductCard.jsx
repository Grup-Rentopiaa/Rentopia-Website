import React from 'react';
import { formatRupiah } from '../utils/format';

const IMG_BASE = 'http://localhost:5000/uploads/';

function ProductCard({ product, onLikeToggle, isLiked, onCardClick, hideLikeCount, actionButton }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.07)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] hover:-translate-y-[3px] transition-all duration-200 cursor-pointer" onClick={() => onCardClick && onCardClick(product)}>
      {product.first_photo ? (
        <img
          className="w-full h-[180px] object-cover bg-[#f3f4f6]"
          src={IMG_BASE + product.first_photo}
          alt={product.name}
        />
      ) : (
        <div className="w-full h-[180px] bg-gradient-to-br from-[#dbeafe] to-[#eff6ff] flex items-center justify-center text-[40px]">📦</div>
      )}

      <div className="p-[14px]">
        <div className="font-semibold text-[14px] mb-1 text-[#1a1a2e] whitespace-nowrap overflow-hidden text-ellipsis">{product.name}</div>
        <div className="text-[#1d6bcf] font-bold text-[15px] mb-1">{formatRupiah(product.price)}/hari</div>
        <div className="text-[12px] text-[#6b7280] flex items-center gap-1 mb-[10px]">📍 {product.location}</div>

        <div className={`text-[11px] font-bold mb-2 ${(product.status === 'tidak tersedia' || product.status === 'sudah disewa') ? 'text-[#dc2626]' : 'text-[#16a34a]'}`}>
          ● {(product.status === 'tidak tersedia' || product.status === 'sudah disewa') ? 'Sudah Disewa' : 'Tersedia'}        </div>

        <span className="inline-flex items-center px-[10px] py-[2px] rounded-[20px] text-[12px] font-medium bg-[#dbeafe] text-[#1d6bcf]">{product.category}</span>

        <div className="flex items-center justify-between pt-[10px] mt-[10px] border-t border-[#f3f4f6]">
          <span className="text-[12px] text-[#9ca3af]">
            👁 {product.view_count} dilihat
          </span>
          {actionButton ? actionButton : (
            <button
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[13px] transition-colors ${isLiked ? 'text-[#ef4444]' : 'text-[#6b7280] hover:bg-[#fef2f2] hover:text-[#ef4444]'}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onLikeToggle) onLikeToggle(product.id);
              }}
            >
              {isLiked ? '❤️' : '🤍'} {!hideLikeCount && product.like_count}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
