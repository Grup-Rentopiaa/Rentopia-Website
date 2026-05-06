import { useState, useEffect, useCallback } from 'react'
import { api } from '../../../lib/axios'

export function useListings(userId) {
  const [listings, setListings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  const fetchListings = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const { data } = await api.get('/api/listings', { params: { userId } })
      setListings(data)
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }, [userId])

  useEffect(() => { fetchListings() }, [fetchListings])

  async function create(payload) {
    const { data } = await api.post(`/api/users/${userId}/listings`, payload)
    return data
  }

  async function update(id, payload) {
    const { data } = await api.put(`/api/users/${userId}/listings/${id}`, payload)
    return data
  }

  async function remove(id) {
    await api.delete(`/api/users/${userId}/listings/${id}`)
    setListings(prev => prev.filter(l => l.id !== id))
  }

  return { listings, loading, error, create, update, remove, refresh: fetchListings }
}