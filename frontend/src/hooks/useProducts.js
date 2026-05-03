import { useState, useEffect, useRef, useCallback } from 'react';
import apiFetch from '../api';
import { saveCatalogToIndexedDB, getCatalogFromIndexedDB, triggerDataChanged } from '../utils/Features';

const DEBOUNCE_MS = 300;

export default function useProducts(search, category, filter) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef(null);

  const loadItems = useCallback(async (searchVal, categoryVal, filterVal) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchVal?.trim()) params.set('search', searchVal.trim());
      if (categoryVal) params.set('category', categoryVal);
      if (filterVal?.sort && filterVal.sort !== 'best_match') params.set('sort', filterVal.sort);
      if (filterVal?.minPrice) params.set('min_price', filterVal.minPrice);
      if (filterVal?.maxPrice) params.set('max_price', filterVal.maxPrice);

      const data = await apiFetch(`/api/items?${params.toString()}`);
      setItems(data);

      await saveCatalogToIndexedDB(data);
      triggerDataChanged('rentopia:toast', {
        message: 'Katalog berhasil dimuat',
        type: 'success',
      });
    } catch {
      try {
        const cached = await getCatalogFromIndexedDB();
        if (cached?.length > 0) {
          setItems(cached);
          triggerDataChanged('rentopia:toast', {
            message: 'Offline: Menampilkan data cache',
            type: 'warning',
          });
        }
      } catch {
        triggerDataChanged('rentopia:toast', {
          message: 'Gagal memuat katalog',
          type: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      loadItems(search, category, filter);
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceTimer.current);
  }, [search, category, filter, loadItems]);

  return { items, loading };
}
