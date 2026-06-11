#  Rentopia Website

##  Instalasi

### Prasyarat

Pastikan perangkat kamu telah menginstal:

- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

### Clone Repositori

```bash
git clone https://github.com/Grup-Rentopiaa/Rentopia-Website.git
cd Rentopia-Website
```

---

### Jalankan Database dengan Docker

```bash
docker compose up -d
```

---

### Jalankan Backend

```bash
cd backend
npm install
npx prisma db push
npm start
```

API berjalan di `http://localhost:3000`.

---

### Jalankan Web Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplikasi web dapat diakses di `http://localhost:5173`.

---

## ✨ Fitur Aplikasi

### 1. Beranda

Halaman beranda adalah titik masuk utama bagi pengguna untuk menjelajahi dan menemukan barang yang ingin disewa.

**Fitur yang tersedia:**
- **Banner Hero** — tampilan visual promosi di bagian atas halaman
- **Filter Kategori** — daftar kategori yang dapat digeser secara horizontal, menyaring produk melalui `GET /api/items?category=...`
- **Tab Pengurutan** — menyaring produk berdasarkan:
  - *Semua* — menampilkan seluruh produk secara acak
  - *Trending* — produk yang sedang populer
  - *Terdekat* — produk terdekat berdasarkan kota pengguna (kalkulasi jarak Haversine)
  - *Diikuti* — produk dari penjual yang diikuti melalui `GET /api/feed/following/:userId`
- **Bilah Pencarian** — pencarian dengan dua mode yang dapat dialihkan:
  - Cari produk → `GET /api/items?search=...`
  - Cari pengguna → `GET /api/search/users?q=...`
- **Kartu Produk** — klik kartu untuk membuka halaman detail produk

---

### 2. Manajemen Produk

Pengguna dapat menambahkan dan mengelola produk yang ingin disewakan.

**Fitur yang tersedia:**
- **Tambah Produk** — mengisi form dengan:
  - Gambar produk, nama produk, lokasi, deskripsi, kategori, dan status ketersediaan
  - Data tersimpan setelah menekan tombol **Upload Produk Sekarang**
- **Detail Produk** — menampilkan informasi lengkap produk:
  - Foto, nama, kategori, status ketersediaan, harga sewa, lokasi, tanggal unggah, informasi pemilik, jumlah dilihat, dan ulasan
- **Aksi pada Produk:**
  - Melihat profil pemilik
  - Menghubungi pemilik melalui chat
  - Mengedit produk (khusus pemilik)

---

### 3. Profil & Sosial

Mengelola identitas pengguna, pengeditan profil, dan sistem sosial (follow/unfollow).

**Fitur yang tersedia:**
- **Halaman Profil** — menampilkan nama, username, kota, deskripsi, avatar, serta statistik barang, rental aktif, pengikut, dan yang diikuti
  - `frontend/src/pages/ProfilePage.jsx`
- **Edit Profil** — mengubah nama lengkap, kota, nomor HP, deskripsi, dan foto profil (dikonversi ke format Base64)
  - Web: Form edit di `ProfilePage.jsx` · Backend: `PUT /api/users/:id`
- **Ikuti / Berhenti Mengikuti** — mengikuti atau berhenti mengikuti pengguna lain; jumlah pengikut dan yang diikuti diperbarui otomatis
  - Backend: `POST /api/users/:id/follow` · `DELETE /api/users/:id/follow`
- **Daftar Pengikut** — melihat daftar pengikut dan yang diikuti; setiap pengguna dapat dikunjungi profilnya, di-follow/unfollow, atau diajak chat

---

### 4. Chat & Alur Sewa

Chat privat secara real-time antara penyewa dan pemilik barang, terintegrasi dengan alur transaksi sewa.

**Fitur yang tersedia:**
- **Daftar Percakapan** — menampilkan semua pengguna yang pernah bertukar pesan melalui `GET /api/chat/users`
- **Ruang Obrolan** — riwayat pesan antar pengguna melalui `GET /api/chat/messages/:userId`
- **Inisiasi Chat** — dari halaman detail produk, klik *"Hubungi Pemilik"* untuk membuka ruang chat privat dengan konteks produk yang termuat otomatis (nama, foto, harga dasar)
- **Form Penawaran Sewa** — penyewa menekan *"Buat Penawaran"* untuk mengisi durasi sewa dan data jaminan
- **Status Tombol Dinamis** — setelah penawaran dikirim, tombol *"Buat Penawaran"* berganti menjadi *"Ubah Penawaran"* dan *"Batalkan Penawaran"*
- **Hitung Mundur Masa Sewa** — periode sewa dilacak dengan `start_time` dan `end_time`; kedua pihak mendapat notifikasi saat masa sewa berakhir
- **Badge Pesan Belum Dibaca (SSE)** — penghitung pesan belum dibaca secara real-time menggunakan Server-Sent Events

**Alur Transaksi Sewa (6 Tahap):**

| Tahap | Status | Aksi |
|---|---|---|
| 1 | `pending` | Pembeli buka chat → sistem kirim permintaan sewa otomatis via `POST /api/rental/initiate` |
| 2 | `approved` | Penjual tekan "Setujui Sewa" → `POST /api/rental/approve` |
| 3 | `guaranteed` | Pembeli isi form jaminan (nama, HP, alamat, durasi, foto KTP Base64) → `POST /api/rental/guarantee` |
| 4 | `received` | Pembeli konfirmasi barang diterima → `POST /api/rental/:id/confirm-received`; hitung mundur aktif |
| 5 | `returned` | Penjual konfirmasi barang kembali → `POST /api/rental/:id/confirm-returned` |
| 6 | `reviewed` | Pembeli tulis ulasan (bintang 1–5 + komentar) → `POST /api/rental/:id/review` |

---

### 5. Wishlist & Rekomendasi

Membantu pengguna menyimpan produk favorit dan menemukan produk yang relevan.

**Fitur yang tersedia:**
- **Wishlist** — menambahkan produk ke daftar favorit dengan menekan tombol **Wishlist/Favorit** pada halaman produk
  - Aksi yang tersedia: tambah, lihat daftar, hapus dari wishlist, dan buka detail produk langsung dari halaman Wishlist
- **Rekomendasi Produk** — sistem menampilkan produk serupa di halaman detail berdasarkan kategori, jenis barang, dan preferensi pengguna; klik rekomendasi untuk langsung membuka halaman Detail Produk

---

### 6. Rating & Ulasan

Sistem umpan balik pasca-transaksi untuk menjaga transparansi dan kualitas katalog produk.

**Fitur yang tersedia:**
- **Pemicu Ulasan** — tombol *"Beri Ulasan"* hanya aktif ketika status transaksi berubah menjadi `Selesai`
- **Form Ulasan (Modal)** — muncul sebagai pop-up tanpa meninggalkan halaman riwayat pesanan:
  - Input bintang (skala 1–5)
  - Kolom teks ulasan / testimoni
- **Sinkronisasi Katalog Langsung** — setelah ulasan dikirim:
  - Data ulasan tersimpan melalui `POST /api/reviews`
  - Halaman detail produk memuat ulasan terbaru secara real-time
  - Badge rating produk diperbarui otomatis berdasarkan rata-rata terbaru (contoh: `4.2★ → 4.5★`)

---

### 7. Pusat Notifikasi

Sistem notifikasi real-time untuk aktivitas-aktivitas penting di platform.

**Fitur yang tersedia:**
- **Pemicu Otomatis** — backend membuat notifikasi baru setiap kali ada aktivitas penting (ulasan baru masuk, pesanan sewa baru diterima)
- **Ikon Lonceng dengan Counter** — badge jumlah notifikasi belum dibaca ditampilkan pada ikon lonceng di navbar
- **Status Baca / Belum Dibaca** — notifikasi tampil tebal saat belum dibaca (`isRead: false`); mengkliknya mengubah status menjadi sudah dibaca (`isRead: true`) dan mengurangi counter
- **Aksi Massal:**
  - *"Tandai Semua Telah Dibaca"* — menandai semua notifikasi sekaligus
  - *"Hapus Riwayat Notifikasi"* — membersihkan seluruh riwayat notifikasi

---

> "Sewa lebih mudah, hidup lebih efisien." — **Grup Rentopiaa**, Sistem Informasi UINSA