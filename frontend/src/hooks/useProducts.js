import { useState, useEffect, useRef, useCallback } from 'react';
import apiFetch from '../api';
import { saveCatalogToIndexedDB, getCatalogFromIndexedDB, triggerDataChanged } from '../utils/Features';

const DEBOUNCE_MS = 300;

export default function useProducts(search, category, filter, followerId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef(null);

  const loadItems = useCallback(async (searchVal, categoryVal, filterVal, follower) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchVal?.trim()) params.set('search', searchVal.trim());
      if (categoryVal) params.set('category', categoryVal);
      
      // Handle recommendation tabs
      if (filterVal?.sort) {
        params.set('sort', filterVal.sort);
      }
      
      if (filterVal?.filter === 'following' && follower) {
        params.set('followerId', follower);
      }

      if (filterVal?.minPrice) params.set('min_price', filterVal.minPrice);
      if (filterVal?.maxPrice) params.set('max_price', filterVal.maxPrice);
      
      // Handle location for 'nearest'
      if (filterVal?.sort === 'nearest' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          params.set('lat', pos.coords.latitude);
          params.set('lng', pos.coords.longitude);
          const data = await apiFetch(`/api/items?${params.toString()}`);
          setItems(data);
        });
      }

      const data = await apiFetch(`/api/items?${params.toString()}`);
      setItems(data);

      await saveCatalogToIndexedDB(data);
    } catch {
      // ... fallback to indexedDB ...
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      loadItems(search, category, filter, followerId);
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceTimer.current);
  }, [search, category, filter, followerId, loadItems]);

  return { items, loading };
}
