export default function WishlistModal({ type, onClose }) {
  if (!type) return null
  const isAdd = type === 'add'

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]" onClick={onClose}>
      <div className="bg-[#02214b] rounded-3xl p-8 max-w-xs w-full mx-4 text-center border border-white/10" onClick={e => e.stopPropagation()}>
        <div className="text-5xl mb-4">{isAdd ? '❤️' : '💔'}</div>
        <h3 className="text-white font-black text-lg mb-2">
          {isAdd ? 'Terpikat di Hati!' : 'Melepas Favorit'}
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          {isAdd ? 'Produk impianmu berhasil masuk ke daftar favorit ✨' : 'Produk telah dihapus. Cari barang lainnya ya! 🚀'}
        </p>
        <button onClick={onClose} className="w-full bg-[#00d4ff] text-[#0d0232] font-black py-3 rounded-xl hover:bg-cyan-300 transition-all">
          Oke, OKE LANJUT
        </button>
      </div>
    </div>
  )
}