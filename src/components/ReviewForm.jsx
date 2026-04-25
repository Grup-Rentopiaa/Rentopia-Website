import React, { useState } from 'react';

const ReviewForm = () => {
  const [ulasan, setUlasan] = useState('');

  return (
    <section id="user-panel" className="module-section">
      <h3>User: Berikan Ulasan</h3>
      <div className="card">
        <textarea 
          value={ulasan}
          onChange={(e) => setUlasan(e.target.value)}
          placeholder="Tulis ulasan Anda di sini..."
        ></textarea>
        <div className="btn-group">
          <button type="button" onClick={() => console.log('Kirim Rating')}>Kirim Rating</button>
        </div>
      </div>
    </section>
  );
};