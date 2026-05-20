
import {
  LayoutGrid, Zap, Tent, Bike, Car,
  Shirt, Baby, Home, Camera, BookOpen, Tag,
} from 'lucide-react';


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

export const CATEGORY_NAMES = CATEGORIES
  .filter(c => c.id !== '')   
  .map(c => c.name);
