import { useState, useEffect, useCallback } from 'react'
import apiFetch from '../api'

export function useProfile(profileId, loggedInUserId) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  const fetchProfile = useCallback(async () => {
    if (!profileId) return
    setLoading(true)
    try {
      const data = await apiFetch(`/api/users/${profileId}`)
      setProfile(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [profileId])

  const fetchFollowStatus = useCallback(async () => {
    if (!profileId || !loggedInUserId || profileId === loggedInUserId) return
    try {
      const { isFollowing } = await apiFetch(`/api/users/${profileId}/follow-status?followerId=${loggedInUserId}`)
      setIsFollowing(isFollowing)
    } catch (err) {
      console.error('Failed to fetch follow status:', err)
    }
  }, [profileId, loggedInUserId])

  useEffect(() => {
    fetchProfile()
    fetchFollowStatus()
  }, [fetchProfile, fetchFollowStatus])

  const toggleFollow = async () => {
    if (!profileId || !loggedInUserId || profileId === loggedInUserId) return
    setFollowLoading(true)
    try {
      if (isFollowing) {
        await apiFetch(`/api/users/${profileId}/follow`, {
          method: 'DELETE',
          body: JSON.stringify({ followerId: loggedInUserId })
        })
        setIsFollowing(false)
        setProfile(prev => ({ ...prev, followers: Math.max(0, prev.followers - 1) }))
      } else {
        await apiFetch(`/api/users/${profileId}/follow`, {
          method: 'POST',
          body: JSON.stringify({ followerId: loggedInUserId })
        })
        setIsFollowing(true)
        setProfile(prev => ({ ...prev, followers: prev.followers + 1 }))
      }
    } catch (err) {
      console.error('Failed to toggle follow:', err)
      alert('Gagal mengubah status follow')
    } finally {
      setFollowLoading(false)
    }
  }

  return { profile, loading, error, isFollowing, followLoading, toggleFollow, refresh: fetchProfile }
}
