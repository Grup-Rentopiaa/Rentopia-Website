import React, { useState } from 'react';

const JaminanForm = () => {
  const [nama, setNama] = useState('');
  const [idBarang, setIdBarang] = useState('');

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
            <button type="button" onClick={() => console.log('Simpan Success')}>Simpan Jaminan</button>
            <button type="button" className="btn-alt" onClick={() => console.log('Gagal Simpan')}>Gagal Simpan</button>
          </div>
        </form>
      </div>
    </section>
  );
};