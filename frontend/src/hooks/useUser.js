import { useState, useEffect } from 'react'
import apiFetch from '../api'

const TEMP_USER_ID = 1

export function useUser() {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    apiFetch(`/api/users/${TEMP_USER_ID}`)
      .then(data => setUser(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function updateUser(payload) {
    const data = await apiFetch(`/api/users/${TEMP_USER_ID}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
    setUser(prev => ({ ...prev, ...data }))
    return data
  }

  return { user, loading, error, userId: TEMP_USER_ID, updateUser }
}