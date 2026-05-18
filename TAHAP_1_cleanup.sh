#!/bin/bash
# ============================================================
# TAHAP 1 — Hapus file mati dari project Rentopia
# Jalankan dari ROOT folder project (satu level di atas backend/ dan frontend/)
# Cara jalankan: bash TAHAP_1_cleanup.sh
# ============================================================

echo "🧹 Memulai cleanup Rentopia..."
echo ""

# -----------------------------------------------------------
# BACKEND — file mati
# -----------------------------------------------------------

echo "📦 [BACKEND] Menghapus entry point duplikat..."
rm -f backend/index.js
rm -f backend/app.js
echo "  ✓ index.js dan app.js dihapus"

echo ""
echo "📦 [BACKEND] Menghapus stack pg lama (productRepository, wishlistRepository, db.js)..."
rm -f backend/db.js
rm -f backend/repositories/productRepository.js
rm -f backend/repositories/wishlistRepository.js
rm -f backend/controllers/productController.js
rm -f backend/controllers/wishlistController.js
rm -f backend/routes/products.js
rm -f backend/routes/wishlist.js
echo "  ✓ Stack pg lama dihapus"

echo ""
echo "📦 [BACKEND] Menghapus layer services dan repositories yang tidak dipakai..."
rm -f backend/services/listing.service.js
rm -f backend/services/rental.service.js
rm -f backend/services/user.service.js
rm -f backend/repositories/listing.repository.js
rm -f backend/repositories/rental.repository.js
rm -f backend/repositories/user.repository.js

# Hapus folder kalau sudah kosong
rmdir backend/services 2>/dev/null && echo "  ✓ Folder services/ dihapus (kosong)" || echo "  ℹ Folder services/ masih ada isi lain, tidak dihapus"
rmdir backend/repositories 2>/dev/null && echo "  ✓ Folder repositories/ dihapus (kosong)" || echo "  ℹ Folder repositories/ masih ada isi lain, tidak dihapus"

echo ""
echo "📦 [BACKEND] Memindahkan seed files ke folder scripts/..."
mkdir -p backend/scripts
mv backend/seed_test_users.js backend/scripts/seed_test_users.js 2>/dev/null && echo "  ✓ seed_test_users.js dipindah ke scripts/"
mv backend/seed_test_product.js backend/scripts/seed_test_product.js 2>/dev/null && echo "  ✓ seed_test_product.js dipindah ke scripts/"

# -----------------------------------------------------------
# FRONTEND — hapus rentopia-react (frontend lama)
# -----------------------------------------------------------

echo ""
echo "🗑️  [FRONTEND] Menghapus rentopia-react/ (frontend lama yang tidak aktif)..."
rm -rf rentopia-react/
echo "  ✓ Folder rentopia-react/ dihapus"

# -----------------------------------------------------------
# FRONTEND — hapus App.css template bawaan Vite
# -----------------------------------------------------------

echo ""
echo "🗑️  [FRONTEND] Menghapus App.css (template Vite, tidak dipakai)..."
rm -f frontend/src/App.css
echo "  ✓ App.css dihapus"

# -----------------------------------------------------------
# FRONTEND — hapus komponen lama yang duplikat
# -----------------------------------------------------------

echo ""
echo "🗑️  [FRONTEND] Menghapus komponen duplikat..."

# ItemCard.jsx — digantikan ProductCard.jsx (design sistem baru)
rm -f frontend/src/pages/ItemCard.jsx
rm -f frontend/src/components/ItemCard.jsx
echo "  ✓ ItemCard.jsx dihapus (pakai ProductCard.jsx)"

# Card.jsx — hanya dipakai untuk data statis landing page
rm -f frontend/src/components/Card.jsx
echo "  ✓ Card.jsx dihapus (data statis, bukan produk real)"

# Footer.jsx — digantikan HomepageFooter.jsx yang lebih lengkap
rm -f frontend/src/components/Footer.jsx
echo "  ✓ Footer.jsx dihapus (pakai HomepageFooter.jsx)"

# GuaranteeFormPage.jsx — digantikan GuaranteeModal.jsx
rm -f frontend/src/pages/GuaranteeFormPage.jsx
echo "  ✓ GuaranteeFormPage.jsx dihapus (pakai GuaranteeModal.jsx)"

# EditProfilePage.jsx — duplikat dari EditProfileForm.jsx yang sudah ada di DashboardPage
rm -f frontend/src/pages/EditProfilePage.jsx
echo "  ✓ EditProfilePage.jsx dihapus (pakai EditProfileForm di ProfilPage)"

# lib/axios.js — tidak dipakai, semua fetch lewat api.js
rm -f frontend/src/lib/axios.js
echo "  ✓ lib/axios.js dihapus (pakai api.js)"

# -----------------------------------------------------------
# ROOT — package.json lama
# -----------------------------------------------------------

echo ""
echo "ℹ️  [ROOT] Catatan: package.json di root project masih punya dependency pg yang tidak dipakai."
echo "   Buka file root/package.json dan hapus baris: 'pg', 'bcrypt', 'cors', 'dotenv', 'express', 'jsonwebtoken'"
echo "   (dependency ini sudah ada di backend/package.json)"

# -----------------------------------------------------------
# Selesai
# -----------------------------------------------------------

echo ""
echo "✅ Tahap 1 selesai!"
echo ""
echo "📋 Ringkasan yang sudah dihapus:"
echo "   Backend  : index.js, app.js, db.js, services/, repositories/ (lama), stack pg lama"
echo "   Frontend : rentopia-react/, App.css, ItemCard.jsx, Card.jsx, Footer.jsx (lama)"
echo "              GuaranteeFormPage.jsx, EditProfilePage.jsx, lib/axios.js"
echo "   Dipindah : seed files → backend/scripts/"
echo ""
echo "⚠️  Sebelum lanjut ke Tahap 2, jalankan dulu:"
echo "   cd backend && node server.js"
echo "   Pastikan server masih bisa jalan tanpa error."
echo ""
echo "Kalau ada error 'Cannot find module', beritahu aku nama file dan baris errornya."