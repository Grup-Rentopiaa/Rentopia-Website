# Rentopia - Web Kelompok

Rentopia adalah platform penyewaan barang (kamera, tenda, perlengkapan outdoor, dll.) yang dibangun dengan arsitektur modular menggunakan React (Frontend) dan Node.js/Express + PostgreSQL (Backend).

## Struktur Proyek

Proyek ini dipisah menjadi dua bagian utama:
- `frontend/`: Aplikasi React (menggunakan Vite) untuk antarmuka pengguna.
- `backend/`: Server Express.js untuk API dan tracking, terhubung ke PostgreSQL.

## Cara Menjalankan Aplikasi

### 1. Backend
1. Masuk ke folder backend: `cd backend`
2. Install dependencies: `npm install` (Pastikan untuk menginstall `pg` dengan `npm install pg` jika belum ada)
3. Buat database PostgreSQL bernama `pemweb` dan sesuaikan kredensial di `config/db.js`.
4. Jalankan server: `npm start`
5. Backend akan berjalan di `http://localhost:3001`

### 2. Frontend
1. Buka terminal baru dan masuk ke folder frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Jalankan development server: `npm run dev`
4. Buka URL yang muncul (biasanya `http://localhost:5173`) di browser.

## Teknologi
- **Frontend**: React, Vite, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express, PostgreSQL
