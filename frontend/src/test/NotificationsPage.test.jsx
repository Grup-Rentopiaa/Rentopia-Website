import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../api', () => ({ default: vi.fn() }))
vi.mock('../components/AppNavbar', () => ({ default: () => <nav>Navbar</nav> }))

import apiFetch from '../api'
import NotificationsPage from '../pages/NotificationsPage'

const renderPage = () => render(
  <MemoryRouter><NotificationsPage /></MemoryRouter>
)

const mockNotifications = [
  { id: 1, type: 'rental_request', message: 'Penyewaan baru masuk', is_read: false, created_at: new Date().toISOString() },
  { id: 2, type: 'general', message: 'Selamat datang di Rentopia', is_read: true, created_at: new Date().toISOString() },
]

describe('NotificationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  test('menampilkan skeleton saat loading', () => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }))
    apiFetch.mockReturnValue(new Promise(() => {}))

    renderPage()
    const skeletons = document.querySelectorAll('.rp-skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  test('menampilkan pesan kosong jika tidak ada notifikasi', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }))
    apiFetch.mockResolvedValueOnce([])
    apiFetch.mockResolvedValueOnce({})

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Belum ada notifikasi')).toBeInTheDocument()
    })
  })

  test('menampilkan daftar notifikasi dengan benar', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }))
    apiFetch.mockResolvedValueOnce(mockNotifications)
    apiFetch.mockResolvedValueOnce({})

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Penyewaan baru masuk')).toBeInTheDocument()
      expect(screen.getByText('Selamat datang di Rentopia')).toBeInTheDocument()
    })
  })

  test('menampilkan jumlah notifikasi di header', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }))
    apiFetch.mockResolvedValueOnce(mockNotifications)
    apiFetch.mockResolvedValueOnce({})

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('2 notifikasi')).toBeInTheDocument()
    })
  })

  test('tidak fetch jika user tidak ada di localStorage', () => {
    renderPage()
    expect(apiFetch).not.toHaveBeenCalled()
  })

  test('menampilkan notifikasi kosong jika fetch gagal', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }))
    apiFetch.mockRejectedValueOnce(new Error('Network error'))

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Belum ada notifikasi')).toBeInTheDocument()
    })
  })
})