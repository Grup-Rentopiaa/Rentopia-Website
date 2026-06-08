import { useState, useEffect, useRef, useCallback } from 'react';
import apiFetch from '../api';
import { saveCatalogToIndexedDB, getCatalogFromIndexedDB, triggerDataChanged } from '../utils/Features';

const DEBOUNCE_MS = 300;

export default function useProducts(search, category, filter, userId) {
  const [items,       setItems]       = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [noCityError, setNoCityError] = useState(false);
  const debounceTimer = useRef(null);

  const loadItems = useCallback(async (searchVal, categoryVal, filterVal, uid) => {
    setLoading(true);
    setNoCityError(false);
    try {
      const params = new URLSearchParams();
      if (searchVal?.trim()) params.set('search', searchVal.trim());
      if (categoryVal)       params.set('category', categoryVal);
      if (filterVal?.sort)   params.set('sort', filterVal.sort);

      if (filterVal?.filter === 'following' && uid) {
        params.set('followerId', uid);
      }

      if (filterVal?.minPrice) params.set('min_price', filterVal.minPrice);
      if (filterVal?.maxPrice) params.set('max_price', filterVal.maxPrice);

      // Nearest — pakai userId + kota, bukan GPS
      if (filterVal?.sort === 'nearest') {
        if (uid) params.set('userId', uid);
        const data = await apiFetch(`/api/items?${params.toString()}`);
        if (data?.empty) {
          setNoCityError(data.reason || 'no_city');
          setItems([]);
        } else {
          setItems(Array.isArray(data) ? data : []);
        }
        return;
      }

      const data = await apiFetch(`/api/items?${params.toString()}`);
      setItems(Array.isArray(data) ? data : []);
      await saveCatalogToIndexedDB(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      loadItems(search, category, filter, userId);
    }, DEBOUNCE_MS);
    return () => clearTimeout(debounceTimer.current);
  }, [search, category, filter, userId, loadItems]);

  return { items, loading, noCityError };
}