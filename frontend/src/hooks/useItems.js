import { useState, useEffect, useCallback } from 'react'
import apiFetch from '../api'

export function useItems(userId) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchItems = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const data = await apiFetch(`/api/items?ownerId=${userId}`)
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }, [userId])

  useEffect(() => { fetchItems() }, [fetchItems])

  async function create(payload) {
    const data = await apiFetch(`/api/users/${userId}/items`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    return data
  }

  async function update(id, payload) {
    const data = await apiFetch(`/api/users/${userId}/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
    return data
  }

  async function remove(id) {
    await apiFetch(`/api/users/${userId}/items/${id}`, {
      method: 'DELETE'
    })
    setItems(prev => prev.filter(l => l.id !== id))
  }

  return { items, loading, error, create, update, remove, refresh: fetchItems }
}
