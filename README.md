#  Rentopia Website

##  Instalasi

### Prasyarat

Pastikan perangkat kamu telah menginstal:

- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---
 
## Library yang Digunakan
 
### Frontend
 
| Library | Versi | Kegunaan |
|---|---|---|
| react | ^19.2.4 | Library utama antarmuka pengguna |
| react-dom | ^19.2.4 | Render komponen React ke DOM |
| react-router-dom | ^7.14.1 | Routing dan navigasi antar halaman |
| axios | ^1.7.2 | HTTP client untuk komunikasi dengan API |
| zod | ^3.23.8 | Validasi skema data di sisi klien |
| lucide-react | ^1.16.0 | Ikon berbasis SVG |
| radix-ui | ^1.4.3 | Komponen UI accessible tanpa styling bawaan |
| shadcn | ^4.8.1 | Komponen UI siap pakai berbasis Radix + Tailwind |
| tailwindcss | ^4.2.4 | Utility-first CSS framework |
| tailwind-merge | ^3.6.0 | Menggabungkan class Tailwind tanpa konflik |
| class-variance-authority | ^0.7.1 | Membuat varian komponen berbasis class |
| clsx | ^2.1.1 | Menggabungkan kondisi class secara dinamis |
| tw-animate-css | ^1.4.0 | Animasi CSS untuk Tailwind |
| @fontsource/inter | ^5.2.8 | Font Inter (static) |
| @fontsource-variable/inter | ^5.2.8 | Font Inter (variable) |
| vite | ^8.0.4 | Build tool dan dev server |
| vitest | ^4.1.8 | Framework pengujian unit |
| @testing-library/react | ^16.3.2 | Utilitas pengujian komponen React |
| @testing-library/jest-dom | ^6.9.1 | Matcher tambahan untuk pengujian DOM |
 
### Backend
 
| Library | Versi | Kegunaan |
|---|---|---|
| express | ^5.2.1 | Framework HTTP server |
| @prisma/client | ^5.22.0 | ORM untuk query database PostgreSQL |
| prisma | ^5.22.0 | CLI Prisma untuk migrasi dan generate client |
| jsonwebtoken | ^9.0.3 | Membuat dan memverifikasi token JWT |
| bcrypt | ^6.0.0 | Hash dan verifikasi password |
| cors | ^2.8.6 | Mengatur kebijakan Cross-Origin Resource Sharing |
| dotenv | ^16.6.1 | Memuat environment variable dari file `.env` |
| helmet | ^8.1.0 | Mengatur HTTP security headers |
| express-rate-limit | ^8.4.1 | Membatasi jumlah request per IP |
| zod | ^3.25.76 | Validasi skema data di sisi server |
| ws | ^8.20.0 | WebSocket server untuk komunikasi real-time |
| nodemailer | ^8.0.5 | Mengirim email dari server |
| idn-area-data | ^4.0.0 | Data wilayah Indonesia (provinsi, kota, kecamatan) |
| jest | ^29.7.0 | Framework pengujian backend |
| jest-mock-extended | ^3.0.7 | Utilitas mock untuk pengujian dengan TypeScript/Jest |
 
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

## Fitur Aplikasi
# Fitur Aplikasi

## 1. Beranda dan Pencarian

Halaman beranda berfungsi sebagai pusat eksplorasi produk yang tersedia untuk disewa. Saat halaman dimuat, frontend mengambil data produk melalui endpoint:

http
GET /api/items


Pengguna dapat melakukan pencarian produk menggunakan parameter search, memfilter berdasarkan kategori menggunakan parameter category, serta mengurutkan hasil berdasarkan mode tertentu seperti trending, terdekat, dan produk dari pengguna yang diikuti.

Pencarian pengguna dilakukan melalui endpoint:

http
GET /api/search/users?q=


Hasil pencarian ditampilkan dalam dua tab, yaitu tab Produk dan tab Pengguna.

---

## 2. Manajemen Produk

Fitur ini memungkinkan pengguna menambahkan, mengubah, dan melihat detail produk.

Saat menambahkan produk, pengguna mengisi informasi berupa:

* Nama produk
* Harga sewa
* Lokasi
* Deskripsi
* Kategori
* Foto produk

Gambar yang dipilih akan dikonversi menjadi format Base64 sebelum dikirim ke server.

Data dikirim melalui endpoint:

http
POST /api/users/:id/items


Detail produk dapat diakses melalui:

http
GET /api/items/:id


Halaman detail menampilkan informasi produk, profil pemilik, statistik produk, serta daftar ulasan yang terkait.

---

## 3. Profil Pengguna

Halaman profil mengambil beberapa data secara paralel menggunakan Promise.all() untuk mengurangi waktu tunggu.

Data yang diambil meliputi:

http
GET /api/users/:id
GET /api/items?ownerId=:id
GET /api/rental/active/:id


Informasi yang ditampilkan meliputi identitas pengguna, daftar produk milik pengguna, jumlah pengikut, jumlah mengikuti, dan daftar penyewaan aktif.

Pengguna juga dapat memperbarui profil melalui:

http
PUT /api/users/:id


---

## 4. Chat

Fitur chat digunakan sebagai media komunikasi antara penyewa dan pemilik barang.

Daftar percakapan diambil melalui:

http
GET /api/chat/users


Sedangkan riwayat pesan diambil melalui:

http
GET /api/chat/messages/:userId


Saat pengguna mengirim pesan, frontend mengirimkan data ke:

http
POST /api/chat/messages/:userId


Data pesan disimpan pada tabel MESSAGES yang memiliki relasi dengan tabel USERS melalui kolom sender_id dan receiver_id.

Sistem melakukan polling setiap 8 detik untuk mengambil pesan baru dan memperbarui status transaksi secara otomatis.

---

## 5. Proses Sewa

Proses sewa merupakan fitur utama yang menghubungkan penyewa dan pemilik barang melalui tabel RENTAL_AGREEMENTS.

### Tahap 1 — Pending

Saat penyewa membuka chat dari halaman detail produk, sistem membuat data rental baru:

http
POST /api/rental/initiate


Data yang disimpan meliputi:

* buyer_id
* seller_id
* item_id
* status = pending

### Tahap 2 — Approved

Pemilik barang menyetujui permintaan sewa:

http
POST /api/rental/approve


Status berubah menjadi:

text
approved


### Tahap 3 — Guaranteed

Penyewa mengirim data jaminan berupa:

* Nama lengkap
* Nomor telepon
* Alamat
* Durasi sewa
* Foto KTP

Data disimpan ke tabel GUARANTEES melalui:

http
POST /api/rental/guarantee


Status berubah menjadi:

text
guaranteed


### Tahap 4 — Received

Setelah barang diterima:

http
POST /api/rental/:id/confirm-received


Status berubah menjadi:

text
received


Pada tahap ini sistem mulai menghitung masa sewa berdasarkan start_date, end_date, dan duration_days.

### Tahap 5 — Returned

Setelah barang dikembalikan:

http
POST /api/rental/:id/confirm-returned


Status berubah menjadi:

text
returned


### Tahap 6 — Reviewed

Penyewa memberikan penilaian dan ulasan:

http
POST /api/rental/:id/review


Data disimpan pada tabel REVIEWS dan status berubah menjadi:

text
reviewed


Setiap perubahan status juga menghasilkan pesan sistem yang disimpan pada tabel MESSAGES dengan atribut:

text
is_system = true


---

## 6. Wishlist

Wishlist digunakan untuk menyimpan produk favorit pengguna.

Relasi wishlist disimpan pada tabel WISHLISTS yang menghubungkan tabel USERS dan ITEMS.

Fitur yang tersedia meliputi:

* Menambahkan produk ke wishlist
* Menghapus produk dari wishlist
* Menampilkan seluruh wishlist pengguna

---

## 7. Rating dan Ulasan

Setelah transaksi selesai, penyewa dapat memberikan ulasan terhadap pemilik atau produk yang disewa.

Data ulasan disimpan pada tabel:

text
REVIEWS


Data yang tersimpan meliputi:

* rental_id
* reviewer_id
* reviewed_user_id
* item_id
* rating
* comment

Nilai rating digunakan untuk menghitung rata-rata penilaian yang ditampilkan pada halaman detail produk.

---

## 8. Notifikasi

Sistem notifikasi menggunakan tabel NOTIFICATIONS.

Notifikasi dibuat secara otomatis ketika terjadi:

* Permintaan sewa baru
* Perubahan status rental
* Ulasan baru
* Aktivitas sosial tertentu

Setiap notifikasi menyimpan informasi:

* user_id
* title
* message
* type
* is_read

Pengguna dapat menandai notifikasi sebagai telah dibaca maupun menghapus seluruh riwayat notifikasi.

---

## Struktur Database Utama

Sistem menggunakan beberapa tabel utama yang saling berelasi:

* USERS → data pengguna
* ITEMS → data barang
* RENTAL_AGREEMENTS → transaksi penyewaan
* GUARANTEES → data jaminan penyewa
* MESSAGES → pesan antar pengguna
* REVIEWS → ulasan transaksi
* NOTIFICATIONS → notifikasi sistem
* WISHLISTS → daftar favorit pengguna
* OTP_CODES → verifikasi akun dan reset password

Seluruh tabel tersebut diakses melalui REST API berbasis Express.js dan dikelola menggunakan Prisma ORM sebagai penghubung antara backend dan database.