import { renderHook, act, waitFor } from '@testing-library/react'
import { vi, describe, test, expect, beforeEach } from 'vitest'

vi.mock('../services/chatService', () => ({
  getUsersService: vi.fn(),
  getMessagesService: vi.fn(),
  sendMessageService: vi.fn(),
}))

// Mock EventSource global
class MockEventSource {
  constructor() {
    this.onmessage = null
    this.onerror = null
    MockEventSource.instance = this
  }
  close() {}
}
global.EventSource = MockEventSource

import { useChat } from '../hooks/useChat'
import {
  getUsersService,
  getMessagesService,
  sendMessageService,
} from '../services/chatService'

const mockUsers = [
  { id: 2, username: 'budi', email: 'budi@mail.com', last_message: null }
]

const mockMessages = [
  { pesan_id: 1, sender_id: 1, receiver_id: 2, isi_pesan: 'Halo', waktu: new Date().toISOString() }
]

describe('useChat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock_token')
    getUsersService.mockResolvedValue(mockUsers)
    getMessagesService.mockResolvedValue(mockMessages)
    sendMessageService.mockResolvedValue({})
  })

  test('berhasil load daftar users saat pertama kali', async () => {
    const { result } = renderHook(() => useChat(1))

    await waitFor(() => {
      expect(result.current.usersLoading).toBe(false)
    })

    expect(result.current.users).toHaveLength(1)
    expect(result.current.users[0].username).toBe('budi')
  })

  test('tidak ada targetUser saat pertama kali', async () => {
    const { result } = renderHook(() => useChat(1))

    await waitFor(() => {
      expect(result.current.usersLoading).toBe(false)
    })

    expect(result.current.targetUser).toBeNull()
  })

  test('berhasil pilih user dan load pesan', async () => {
    const { result } = renderHook(() => useChat(1))

    await waitFor(() => {
      expect(result.current.usersLoading).toBe(false)
    })

    act(() => {
      result.current.chooseUser(mockUsers[0])
    })

    await waitFor(() => {
      expect(result.current.targetUser).toEqual(mockUsers[0])
    })

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(1)
    })

    expect(result.current.messages[0].isi_pesan).toBe('Halo')
  })

  test('berhasil kirim pesan dan tambah ke list optimistis', async () => {
    const { result } = renderHook(() => useChat(1))

    await waitFor(() => expect(result.current.usersLoading).toBe(false))

    act(() => { result.current.chooseUser(mockUsers[0]) })
    await waitFor(() => expect(result.current.messages).toHaveLength(1))

    await act(async () => {
      await result.current.sendMessage('Pesan baru')
    })

    expect(result.current.messages).toHaveLength(2)
    expect(result.current.messages[1].isi_pesan).toBe('Pesan baru')
  })

  test('tidak kirim pesan jika text kosong', async () => {
    const { result } = renderHook(() => useChat(1))

    await waitFor(() => expect(result.current.usersLoading).toBe(false))

    act(() => { result.current.chooseUser(mockUsers[0]) })
    await waitFor(() => expect(result.current.messages).toHaveLength(1))

    await act(async () => {
      const result2 = await result.current.sendMessage('   ')
      expect(result2).toBe(false)
    })

    expect(sendMessageService).not.toHaveBeenCalled()
  })

  test('rollback pesan jika kirim gagal', async () => {
    sendMessageService.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useChat(1))

    await waitFor(() => expect(result.current.usersLoading).toBe(false))

    act(() => { result.current.chooseUser(mockUsers[0]) })
    await waitFor(() => expect(result.current.messages).toHaveLength(1))

    await act(async () => {
      await result.current.sendMessage('Pesan gagal')
    })

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(1)
    })
  })

  test('simpan targetChatId ke localStorage saat chooseUser', async () => {
    const { result } = renderHook(() => useChat(1))

    await waitFor(() => expect(result.current.usersLoading).toBe(false))

    act(() => { result.current.chooseUser(mockUsers[0]) })

    expect(localStorage.getItem('targetChatId')).toBe('2')
  })

  test('messages kosong saat tidak ada targetUser', async () => {
    const { result } = renderHook(() => useChat(1))

    await waitFor(() => expect(result.current.usersLoading).toBe(false))

    expect(result.current.messages).toHaveLength(0)
  })

  test('tidak load apapun jika myId tidak ada', () => {
    const { result } = renderHook(() => useChat(null))
    expect(result.current.users).toHaveLength(0)
    expect(getUsersService).not.toHaveBeenCalled()
  })
})