// ── constants/categories.js ──────────────────────────────────────────────────
// SATU tempat untuk daftar kategori.
// Dipakai oleh: HomePage, ProductsPage, UploadPage, SearchPage,
//               Categories component, dan filter backend.
// Jangan buat daftar kategori baru di tempat lain.

import {
  LayoutGrid, Zap, Tent, Bike, Car,
  Shirt, Baby, Home, Camera, BookOpen, Tag,
} from 'lucide-react';

// Array lengkap dengan id, name, dan icon
// id string kosong = "Semua" (tidak ada filter kategori)
export const CATEGORIES = [
  { id: '',                  name: 'Semua',            Icon: LayoutGrid },
  { id: 'Elektronik',        name: 'Elektronik',       Icon: Zap        },
  { id: 'Camping & Outdoor', name: 'Camping & Outdoor',Icon: Tent       },
  { id: 'Olahraga',          name: 'Olahraga',         Icon: Bike       },
  { id: 'Kendaraan',         name: 'Kendaraan',        Icon: Car        },
  { id: 'Pakaian & Kostum',  name: 'Pakaian & Kostum', Icon: Shirt      },
  { id: 'Bayi & Anak',       name: 'Bayi & Anak',      Icon: Baby       },
  { id: 'Peralatan Rumah',   name: 'Peralatan Rumah',  Icon: Home       },
  { id: 'Kamera & Foto',     name: 'Kamera & Foto',    Icon: Camera     },
  { id: 'Buku & Alat Belajar', name: 'Buku & Alat Belajar', Icon: BookOpen },
  { id: 'Lainnya',           name: 'Lainnya',          Icon: Tag        },
];

// Array nama saja — dipakai di UploadPage dropdown dan filter yang tidak butuh icon
export const CATEGORY_NAMES = CATEGORIES
  .filter(c => c.id !== '')   // hapus "Semua"
  .map(c => c.name);
