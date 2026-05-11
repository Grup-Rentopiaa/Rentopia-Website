import { useState, useEffect, useCallback } from 'react'
import apiFetch from '../api'

export function useListings(userId) {
  const [listings, setListings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  const fetchListings = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const data = await apiFetch(`/api/listings?userId=${userId}`)
      setListings(data)
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }, [userId])

  useEffect(() => { fetchListings() }, [fetchListings])

  async function create(payload) {
    const data = await apiFetch(`/api/users/${userId}/listings`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    return data
  }

  async function update(id, payload) {
    const data = await apiFetch(`/api/users/${userId}/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
    return data
  }

  async function remove(id) {
    await apiFetch(`/api/users/${userId}/listings/${id}`, {
      method: 'DELETE'
    })
    setListings(prev => prev.filter(l => l.id !== id))
  }

  return { listings, loading, error, create, update, remove, refresh: fetchListings }
}