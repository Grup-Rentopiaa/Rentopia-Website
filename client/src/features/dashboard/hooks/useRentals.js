import { useState, useEffect, useCallback } from 'react'
import { api } from '../../../lib/axios'

export function useRentals(userId) {
  const [rentals, setRentals] = useState([])  
  const [loading,  setLoading]  = useState(true) 
  const [error,    setError]    = useState(null)  
  const fetchRentals = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const { data } = await api.get('/api/rentals', { params: { userId } })  
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
    const { data } = await api.post(`/api/users/${userId}/rentals`, payload)
    return data
  }

  async function remove(id) {
    await api.delete(`/api/users/${userId}/rentals/${id}`)
  }

  return { rentals, loading, error, create, remove, refresh: fetchRentals }
}