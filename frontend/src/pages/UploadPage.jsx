import { Upload, ImagePlus, Tag, MapPin, FileText, ChevronRight } from 'lucide-react';

export default function UploadPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Upload Produk</h1>
        <p className="text-sm text-gray-500 mt-1">Sewakan barang kamu dan dapatkan penghasilan tambahan</p>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
           style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>

        {/* Upload foto */}
        <div className="p-5 border-b border-gray-100">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
            <ImagePlus size={32} className="text-blue-400 mb-2" />
            <span className="text-sm font-medium text-blue-600">Tambah Foto Produk</span>
            <span className="text-xs text-gray-400 mt-1">Maks. 5 foto, format JPG/PNG</span>
            <input type="file" accept="image/*" multiple className="hidden" />
          </label>
        </div>

        {/* Fields */}
        <div className="divide-y divide-gray-100">
          {/* Nama produk */}
          <div className="flex items-center gap-3 px-5 py-4">
            <FileText size={18} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Nama produk"
              className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>

          {/* Harga */}
          <div className="flex items-center gap-3 px-5 py-4">
            <Tag size={18} className="text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-400 flex-shrink-0">Rp</span>
            <input
              type="number"
              placeholder="Harga sewa per hari"
              className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none"
              min="0"
            />
          </div>

          {/* Lokasi */}
          <div className="flex items-center gap-3 px-5 py-4">
            <MapPin size={18} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Lokasi produk"
              className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>

          {/* Deskripsi */}
          <div className="flex gap-3 px-5 py-4">
            <FileText size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <textarea
              placeholder="Deskripsi produk (kondisi, spesifikasi, syarat sewa, dll)"
              rows={3}
              className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none resize-none"
            />
          </div>

          {/* Kategori */}
          <div className="flex items-center gap-3 px-5 py-4">
            <Tag size={18} className="text-gray-400 flex-shrink-0" />
            <select className="flex-1 text-sm text-gray-700 outline-none bg-transparent">
              <option value="">Pilih kategori</option>
              <option>Elektronik</option>
              <option>Kendaraan</option>
              <option>Pakaian</option>
              <option>Peralatan Rumah</option>
              <option>Olahraga</option>
              <option>Kamera &amp; Fotografi</option>
              <option>Alat Musik</option>
              <option>Buku &amp; Pendidikan</option>
              <option>Bayi &amp; Anak</option>
              <option>Lainnya</option>
            </select>
            <ChevronRight size={16} className="text-gray-300" />
          </div>
        </div>
      </div>

      {/* Submit button */}
      <button className="w-full mt-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm">
        <Upload size={18} />
        Upload Produk
      </button>
    </div>
  );
}
