// 1. Letakkan import axios paling atas
import React, { useState } from 'react';
import axios from 'axios';

const JaminanForm = () => {
  const [nama, setNama] = useState('');
  const [idBarang, setIdBarang] = useState('');

  // 2. Letakkan fungsi handleSubmit di sini (setelah state, sebelum return)
  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/jaminan', {
        nama_penyewa: nama,
        id_barang: idBarang
      });
      alert('Data Jaminan Berhasil Tersimpan di PostgreSQL!');
    } catch (error) {
      console.error('Gagal menyimpan data', error);
      alert('Gagal menyimpan ke database');
    }
  };

  return (
    <section id="admin-panel" className="module-section">
      <h3>Admin: Pengelolaan Jaminan</h3>
      <div className="card">
        <form className="rentopia-form">
          <div className="input-group">
            <label>Nama Penyewa</label>
            <input 
              type="text" 
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Input nama lengkap..." 
            />
          </div>
          <div className="input-group">
            <label>ID Barang</label>
            <input 
              type="text" 
              value={idBarang}
              onChange={(e) => setIdBarang(e.target.value)}
              placeholder="Contoh: RT-102" 
            />
          </div>
          <div className="btn-group">
            {/* 3. Panggil handleSubmit di onClick tombol */}
            <button type="button" onClick={handleSubmit}>
              Simpan Jaminan
            </button>
            <button type="button" className="btn-alt" onClick={() => console.log('Gagal Simpan')}>
              Gagal Simpan
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default JaminanForm;