# Installation 
### Make sure the following are installed on your machine:
 
- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
---
 
### 1. Clone the Repository
 
```bash
git clone https://github.com/Grup-Rentopiaa/Rentopia-Website.git
cd Rentopia-Website
```
 
 
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
---
# Use an application

### 1. Beranda & Pencarian
 
Halaman beranda adalah titik masuk utama bagi pengguna untuk menjelajahi dan menemukan barang yang ingin disewa.
 
**Fitur yang tersedia:**
- **Banner Hero** — tampilan visual promosi di bagian atas layar
- **Filter Kategori** — daftar kategori yang dapat digeser secara horizontal, menyaring produk melalui `GET /api/items?category=...`
- **Tab Pengurutan** — menyaring produk berdasarkan:
  - *Semua* — menampilkan seluruh produk secara acak
  - *Trending* — produk yang sedang populer
  - *Terdekat* — produk terdekat berdasarkan kota pengguna (kalkulasi jarak Haversine)
  - *Diikuti* — produk dari penjual yang diikuti melalui `GET /api/feed/following/:userId`
- **Bilah Pencarian** — pencarian dengan dua mode yang dapat dialihkan:
  - Cari produk → `GET /api/items?search=...`
  - Cari pengguna → `GET /api/search/users?q=...`
- **Kartu Produk** — ketuk kartu mana pun untuk membuka halaman detail produk
---
 
### 2. Profil & Sosial
 
Mengelola identitas pengguna, pengeditan profil, dan sistem sosial (follow/unfollow).
 
**Fitur yang tersedia:**
- **Lihat Profil** — menampilkan nama, username, kota, bio, avatar, serta statistik barang, rental aktif, pengikut, dan yang diikuti
  - Profil sendiri: `app/(app)/profile/index.jsx`
  - Profil pengguna lain: `app/(app)/profile/[id].jsx`
- **Edit Profil** — mengubah nama lengkap, kota, nomor HP, bio, dan foto profil (dikonversi ke format Base64)
  - Mobile: `app/(app)/edit-profile.jsx`
  - Backend: `PUT /api/users/:id`
- **Ikuti / Berhenti Mengikuti** — mengikuti atau berhenti mengikuti pengguna lain; jumlah pengikut dan yang diikuti diperbarui secara otomatis
  - Backend: `POST /api/users/:id/follow` · `DELETE /api/users/:id/follow`
- **Daftar Pengikut** — melihat daftar pengikut dan yang diikuti; setiap pengguna dapat dikunjungi profilnya, di-follow/unfollow, atau diajak chat
  - Mobile: `app/(app)/profile/follow-list.jsx`
---
 
### 3. Chat & Alur Sewa
 
Chat privat secara real-time antara penyewa dan pemilik barang, terintegrasi dengan siklus transaksi sewa.
 
**Fitur yang tersedia:**
- **Mulai Chat** — dari halaman detail produk, ketuk *"Hubungi Pemilik"* untuk membuka ruang chat privat dengan konteks produk yang sudah termuat otomatis (nama, foto, harga dasar)
- **Form Penawaran Sewa** — penyewa menekan *"Buat Penawaran"* untuk mengisi:
  - Durasi sewa (dalam hari)
  - Jaminan sewa / verifikasi identitas
- **Status Tombol Dinamis** — setelah penawaran dikirim, tombol *"Buat Penawaran"* digantikan oleh *"Ubah Penawaran"* dan *"Batalkan Penawaran"*
- **Hitung Mundur Masa Sewa** — periode sewa aktif dilacak dengan `start_time` dan `end_time`; sistem memberi notifikasi kepada kedua pihak ketika masa sewa berakhir
- **Badge Pesan Belum Dibaca (SSE)** — penghitung pesan belum dibaca secara real-time pada ikon tab chat menggunakan Server-Sent Events
---
 
### 4. Rating & Ulasan
 
Sistem umpan balik pasca-transaksi untuk menjaga transparansi dan kualitas katalog produk.
 
**Fitur yang tersedia:**
- **Pemicu Ulasan** — tombol *"Beri Ulasan"* hanya aktif ketika status transaksi berubah menjadi `Selesai`
- **Form Ulasan (Modal)** — muncul sebagai pop-up tanpa meninggalkan halaman riwayat pesanan:
  - Input bintang (skala 1–5)
  - Kolom teks ulasan / testimoni
- **Sinkronisasi Katalog Langsung** — setelah ulasan dikirim:
  - Data ulasan langsung tersimpan melalui `POST /api/reviews`
  - Halaman detail produk memuat ulasan terbaru secara real-time
  - Badge rating produk diperbarui otomatis berdasarkan rata-rata terbaru (contoh: `4.2★ → 4.5★`)
---
 
### 5. Pusat Notifikasi
 
Sistem notifikasi real-time untuk aktivitas-aktivitas penting di platform.
 
**Fitur yang tersedia:**
- **Pemicu Otomatis** — backend membuat baris notifikasi baru secara otomatis setiap kali ada aktivitas penting (ulasan baru masuk, pesanan sewa baru diterima)
- **Ikon Lonceng dengan Counter** — badge jumlah notifikasi belum dibaca ditampilkan pada ikon lonceng di navbar
- **Status Baca / Belum Dibaca** — notifikasi tampil tebal saat belum dibaca (`isRead: false`); mengkliknya akan mengubah status menjadi sudah dibaca (`isRead: true`) dan mengurangi angka counter
- **Aksi Massal:**
  - *"Tandai Semua Telah Dibaca"* — menandai semua notifikasi sebagai sudah dibaca sekaligus
  - *"Hapus Riwayat Notifikasi"* — membersihkan seluruh riwayat notifikasi
---