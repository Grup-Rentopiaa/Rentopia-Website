import { useState, useEffect, useCallback } from 'react'
import apiFetch from '../api'

export function useRentals(userId) {
  const [rentals, setRentals] = useState([])  
  const [loading,  setLoading]  = useState(true) 
  const [error,    setError]    = useState(null)  
  const fetchRentals = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const data = await apiFetch(`/api/rentals?userId=${userId}`)  
      setRentals(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)  
    }
  }, [userId])

  useEffect(() => {
    fetchRentals()
  }, [fetchRentals])  
  async function create(payload) {
    const data = await apiFetch(`/api/users/${userId}/rentals`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    return data
  }

  async function remove(id) {
    await apiFetch(`/api/users/${userId}/rentals/${id}`, {
      method: 'DELETE'
    })
  }

  return { rentals, loading, error, create, remove, refresh: fetchRentals }
}