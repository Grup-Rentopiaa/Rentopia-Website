import { renderHook, act, waitFor } from '@testing-library/react'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import '@testing-library/jest-dom'

vi.mock('../api', () => ({
  default: vi.fn()
}))

import apiFetch from '../api'
import { useProfile } from '../hooks/useProfile'
import { useUser } from '../hooks/useUser'

// ─────────────────────────────────────────────
// USE PROFILE
// ─────────────────────────────────────────────
describe('useProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('berhasil load profil user', async () => {
    apiFetch.mockResolvedValueOnce({ id: 2, username: 'budi', followers: 10 })
    apiFetch.mockResolvedValueOnce({ isFollowing: false })

    const { result } = renderHook(() => useProfile(2, 1))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.profile).toEqual(expect.objectContaining({ username: 'budi' }))
    expect(result.current.error).toBeNull()
  })

  test('set error jika fetch profil gagal', async () => {
    apiFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useProfile(2, 1))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Network error')
    expect(result.current.profile).toBeNull()
  })

  test('berhasil load status follow', async () => {
    apiFetch.mockResolvedValueOnce({ id: 2, username: 'budi', followers: 10 })
    apiFetch.mockResolvedValueOnce({ isFollowing: true })

    const { result } = renderHook(() => useProfile(2, 1))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.isFollowing).toBe(true)
  })

  test('tidak fetch follow status jika profileId sama dengan loggedInUserId', async () => {
    apiFetch.mockResolvedValueOnce({ id: 1, username: 'amel', followers: 5 })

    const { result } = renderHook(() => useProfile(1, 1))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(apiFetch).toHaveBeenCalledTimes(1)
    expect(result.current.isFollowing).toBe(false)
  })

  test('berhasil follow user dan update jumlah followers', async () => {
    apiFetch.mockResolvedValueOnce({ id: 2, username: 'budi', followers: 10 })
    apiFetch.mockResolvedValueOnce({ isFollowing: false })
    apiFetch.mockResolvedValueOnce({})

    const { result } = renderHook(() => useProfile(2, 1))

    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.toggleFollow()
    })

    expect(result.current.isFollowing).toBe(true)
    expect(result.current.profile.followers).toBe(11)
  })

  test('berhasil unfollow user dan kurangi jumlah followers', async () => {
    apiFetch.mockResolvedValueOnce({ id: 2, username: 'budi', followers: 10 })
    apiFetch.mockResolvedValueOnce({ isFollowing: true })
    apiFetch.mockResolvedValueOnce({})

    const { result } = renderHook(() => useProfile(2, 1))

    await waitFor(() => expect(result.current.loading).toBe(false))
    await waitFor(() => expect(result.current.isFollowing).toBe(true))

    await act(async () => {
      await result.current.toggleFollow()
    })

    expect(result.current.isFollowing).toBe(false)
    expect(result.current.profile.followers).toBe(9)
  })

  test('tidak melakukan apapun jika profileId tidak ada', async () => {
    const { result } = renderHook(() => useProfile(null, 1))

    await new Promise(r => setTimeout(r, 100))

    expect(apiFetch).not.toHaveBeenCalled()
    expect(result.current.profile).toBeNull()
  })
})

// ─────────────────────────────────────────────
// USE USER
// ─────────────────────────────────────────────
describe('useUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  test('berhasil load user dari localStorage', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, username: 'amel' }))
    apiFetch.mockResolvedValueOnce({ id: 1, username: 'amel', city: 'Surabaya' })

    const { result } = renderHook(() => useUser())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.user).toEqual(expect.objectContaining({ username: 'amel' }))
    expect(result.current.userId).toBe(1)
  })

  test('tidak load user jika localStorage kosong', async () => {
    const { result } = renderHook(() => useUser())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.user).toBeNull()
    expect(apiFetch).not.toHaveBeenCalled()
  })

  test('set error jika fetch user gagal', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }))
    apiFetch.mockRejectedValueOnce(new Error('Unauthorized'))

    const { result } = renderHook(() => useUser())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Unauthorized')
  })

  test('berhasil update user dan simpan ke localStorage', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, username: 'amel' }))
    apiFetch.mockResolvedValueOnce({ id: 1, username: 'amel', city: 'Surabaya' })
    apiFetch.mockResolvedValueOnce({ id: 1, username: 'amel_new', city: 'Surabaya' })

    const { result } = renderHook(() => useUser())

    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.updateUser({ username: 'amel_new' })
    })

    expect(result.current.user.username).toBe('amel_new')
    const stored = JSON.parse(localStorage.getItem('user'))
    expect(stored.username).toBe('amel_new')
  })

  test('return null jika updateUser dipanggil tanpa userId', async () => {
    const { result } = renderHook(() => useUser())

    await waitFor(() => expect(result.current.loading).toBe(false))

    const res = await result.current.updateUser({ username: 'test' })
    expect(res).toBeNull()
  })
})