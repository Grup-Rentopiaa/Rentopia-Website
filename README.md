# Rentopia Web Application
## Instalasi

### Prasyarat

- Docker Desktop
- Node.js 18 atau lebih baru
- Git

### Langkah Instalasi

Clone repository:

```bash
git clone https://github.com/username/rentopia-website.git
cd rentopia-website
```

Jalankan seluruh layanan dengan Docker Compose:

```bash
docker compose up --build -d
```

Jalankan migrasi database:

```bash
docker compose exec backend npx prisma migrate deploy
```

Akses aplikasi:

| Layanan | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |

## Library yang Digunakan

### Frontend

| Library | Versi | Kegunaan |
|---------|-------|----------|
| React | 18 | Framework UI |
| Vite | 5 | Build tool dan dev server |
| React Router DOM | 6 | Client-side routing |
| Tailwind CSS | 3 | Utility-first CSS framework |
| shadcn/ui | latest | Komponen UI berbasis Radix UI |
| Lucide React | latest | Icon library |
| clsx + tailwind-merge | latest | Utility untuk class merging |

### Backend

| Library | Versi | Kegunaan |
|---------|-------|----------|
| Express | 4 | Web framework |
| Prisma | 5 | ORM untuk PostgreSQL |
| jsonwebtoken | latest | JWT authentication |
| bcrypt | latest | Password hashing |
| zod | latest | Validasi schema input |
| helmet | latest | Security HTTP headers |
| cors | latest | Cross-origin resource sharing |
| express-rate-limit | latest | Rate limiting per endpoint |
| nodemailer | latest | Pengiriman email OTP |
| ws | latest | WebSocket server |


## Penjelasan Teknis Fitur

### Landing Page dengan Cookie Consent

Landing page terdiri dari komponen terpisah: `HeroSection`, `HowItWorksSection`, `StatsSection`, `TestimoniSection`, dan `CTASection`. Cookie consent menggunakan hook `useCookieConsent` yang menyimpan status persetujuan ke cookie browser dengan masa berlaku 180 hari. Cookie dijadikan sumber kebenaran utama dibanding localStorage. Saat pengguna menerima consent, data pengunjung dikirim ke endpoint `POST /api/tracking/track-visitor` beserta informasi browser, layar, dan lokasi (jika diizinkan).

### Authentication

Registrasi menghasilkan OTP 6 digit yang dikirim ke email menggunakan Nodemailer. Password di-hash menggunakan bcrypt dengan salt 10 rounds. Login menghasilkan JWT dengan masa berlaku 1 hari yang dikirim melalui cookie HttpOnly sekaligus di response body. Seluruh request ke endpoint yang dilindungi harus menyertakan token di header `Authorization: Bearer`.

### Admin Tracking Visitor

Endpoint `GET /api/admin/visitor-stats` hanya dapat diakses oleh akun dengan field `isAdmin: true`. Data pengunjung disimpan di tabel `Visitor` dan dapat diekspor ke CSV melalui endpoint `GET /api/admin/visitor-export`.

### Filter Kategori, Search Produk dan Pengguna

Pencarian menggunakan query parameter `search` yang diteruskan ke Prisma dengan filter `contains` dan mode `insensitive`. Hasil pencarian produk dan pengguna diambil secara paralel menggunakan `Promise.all`.

### Filter Trending, Terdekat, Diikuti dan Wishlist

Trending diurutkan berdasarkan kolom `views` yang bertambah setiap kali produk dibuka. Terdekat menggunakan kalkulasi jarak Haversine antara kota pengguna dan kota produk melalui utilitas `cityCoords.js`. Diikuti mengambil produk dari pengguna yang ada di tabel `Follows`. Wishlist disimpan di tabel `ItemLike` dan disinkronkan dengan localStorage browser.

### Notifikasi dan Review

Notifikasi dibuat melalui fungsi `createNotification` yang dipanggil di setiap tahap rental flow. Notifikasi dikirim secara real-time menggunakan SSE ke endpoint `GET /api/chat/sse`. Ulasan disimpan ke tabel `Review` dan memperbarui rating rata-rata pemilik produk secara otomatis.

### Upload Produk dan Follow/Unfollow

Foto produk dikonversi ke Base64 di frontend sebelum dikirim ke backend. Kategori disimpan di tabel `Category` dan dibuat otomatis jika belum ada. Follow/unfollow menggunakan tabel `Follows` dengan relasi self-referencing pada model `User`.

### Detail Produk dan Jumlah Like

Setiap kali halaman detail produk dibuka, kolom `views` bertambah 1 melalui Prisma `increment`. Like disimpan di tabel `ItemLike` dengan constraint unique pada kombinasi `item_id` dan `user_id`, sehingga like bersifat toggle.

### Chat dan Rental Flow

Chat menggunakan SSE untuk menerima pesan real-time dan WebSocket untuk mengirim notifikasi agreement. Pesan disimpan di tabel `Message`. Rental flow dikelola melalui tabel `RentalAgreement` dengan status: `pending`, `approved`, `guarantee_submitted`, `handover_confirmed`, `received`, `returned`, `reviewed`. Data jaminan (KTP, alamat) dienkripsi menggunakan AES-256-CBC sebelum disimpan ke database.

Konfirmasi sebelum menghapus data diimplementasikan menggunakan hook `useConfirm` dan komponen `ConfirmDialog` berbasis shadcn/ui Dialog, sehingga tidak menggunakan `window.confirm` bawaan browser.