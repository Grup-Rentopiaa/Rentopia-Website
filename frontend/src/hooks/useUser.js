import { useState, useEffect } from 'react'
import apiFetch from '../api'

export function useUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const storedUserStr = localStorage.getItem('user')
    if (storedUserStr) {
      try {
        const parsed = JSON.parse(storedUserStr)
        setUserId(parsed.id)
        apiFetch(`/api/users/${parsed.id}`)
          .then(data => {
             setUser(data)
             
             localStorage.setItem('user', JSON.stringify({ ...parsed, ...data }))
          })
          .catch(err => setError(err.message))
          .finally(() => setLoading(false))
      } catch (err) {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  async function updateUser(payload) {
    if (!userId) return null;
    const data = await apiFetch(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
    setUser(prev => ({ ...prev, ...data }))
    
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...storedUser, ...data }));

    return data
  }

  return { user, loading, error, userId, updateUser }
}