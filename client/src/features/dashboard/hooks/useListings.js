import { useState, useEffect, useCallback } from 'react'
import { api } from '../../../lib/axios'

export function useListings(userId) {
  const [listings, setListings] = useState(???)  // nilai awal array kosong
  const [loading,  setLoading]  = useState(???)  // nilai awal true
  const [error,    setError]    = useState(???)  // nilai awal null

  const fetchListings = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const { data } = await api.get(???)  // endpoint GET listings
      setListings(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(???)  // setelah selesai, loading jadi apa?
    }
  }, [userId])

  useEffect(() => {
    fetchListings()
  }, [???])  // dependency array — kapan fetchListings dipanggil ulang?

  async function create(payload) {
    const { data } = await api.post(`/api/users/${userId}/listings`, payload)
    return data
  }

  async function remove(id) {
    await api.delete(`/api/users/${userId}/listings/${id}`)
  }

  return { listings, loading, error, create, remove, refresh: fetchListings }
}