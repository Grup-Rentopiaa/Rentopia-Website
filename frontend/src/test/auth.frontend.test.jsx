import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import '@testing-library/jest-dom'

// ─────────────────────────────────────────────
// MOCK
// ─────────────────────────────────────────────
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn()
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>
}))
vi.mock('@/components/ui/input', () => ({
  Input: ({ ...props }) => <input {...props} />
}))
vi.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }) => <label {...props}>{children}</label>
}))
vi.mock('@/components/ui/card', () => ({
  Card: ({ children }) => <div>{children}</div>,
  CardContent: ({ children }) => <div>{children}</div>
}))

import { useAuth } from '../hooks/useAuth'
import PublicRoute from '../components/PublicRoute'
import LoginPage from '../pages/LoginPage'

// ─────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────
const renderWithRouter = (ui, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  )
}

// ─────────────────────────────────────────────
// PUBLIC ROUTE
// ─────────────────────────────────────────────
describe('PublicRoute', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('menampilkan halaman jika belum ada token', () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <div>Halaman Login</div>
          </PublicRoute>
        }/>
        <Route path="/home" element={<div>Halaman Home</div>}/>
      </Routes>
    )
    expect(screen.getByText('Halaman Login')).toBeInTheDocument()
  })

  test('redirect ke /home jika sudah ada token', () => {
    localStorage.setItem('token', 'mocked_token')
    renderWithRouter(
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <div>Halaman Login</div>
          </PublicRoute>
        }/>
        <Route path="/home" element={<div>Halaman Home</div>}/>
      </Routes>
    )
    expect(screen.queryByText('Halaman Login')).not.toBeInTheDocument()
    expect(screen.getByText('Halaman Home')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────
describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuth.mockReturnValue({
      loading: false,
      error: '',
      login: vi.fn()
    })
  })

  test('menampilkan form login dengan field email dan password', () => {
    renderWithRouter(<LoginPage />)
    expect(screen.getByPlaceholderText('contoh@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Masukkan password')).toBeInTheDocument()
  })

  test('menampilkan error jika email kosong saat submit', async () => {
    renderWithRouter(<LoginPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }))
    await waitFor(() => {
      expect(screen.getByText('Email wajib diisi')).toBeInTheDocument()
    })
  })

  test('menampilkan error jika password kosong saat submit', async () => {
    renderWithRouter(<LoginPage />)
    fireEvent.change(screen.getByPlaceholderText('contoh@email.com'), {
      target: { value: 'amel@mail.com' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }))
    await waitFor(() => {
      expect(screen.getByText('Password wajib diisi')).toBeInTheDocument()
    })
  })

  test('memanggil fungsi login saat form diisi lengkap dan submit', async () => {
    const mockLogin = vi.fn().mockResolvedValue(null)
    useAuth.mockReturnValue({ loading: false, error: '', login: mockLogin })

    renderWithRouter(<LoginPage />)

    fireEvent.change(screen.getByPlaceholderText('contoh@email.com'), {
      target: { value: 'amel@mail.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Masukkan password'), {
      target: { value: '123456' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'amel@mail.com',
        password: '123456'
      })
    })
  })

  test('menyimpan token ke localStorage dan redirect ke /home setelah login berhasil', async () => {
    const mockLogin = vi.fn().mockResolvedValue({
      token: 'mocked_token',
      user: { id: 1, username: 'amel', email: 'amel@mail.com' }
    })
    useAuth.mockReturnValue({ loading: false, error: '', login: mockLogin })

    renderWithRouter(
      <Routes>
        <Route path="/" element={<LoginPage />}/>
        <Route path="/home" element={<div>Halaman Home</div>}/>
      </Routes>
    )

    fireEvent.change(screen.getByPlaceholderText('contoh@email.com'), {
      target: { value: 'amel@mail.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Masukkan password'), {
      target: { value: '123456' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }))

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('mocked_token')
      expect(screen.getByText('Halaman Home')).toBeInTheDocument()
    })
  })

  test('menampilkan pesan error dari server jika login gagal', () => {
    useAuth.mockReturnValue({
      loading: false,
      error: 'email tidak ditemukan',
      login: vi.fn()
    })
    renderWithRouter(<LoginPage />)
    expect(screen.getByText(/email tidak ditemukan/i)).toBeInTheDocument()
  })

  test('menampilkan loading saat proses login berlangsung', () => {
    useAuth.mockReturnValue({
      loading: true,
      error: '',
      login: vi.fn()
    })
    renderWithRouter(<LoginPage />)
    expect(screen.getByText('Masuk...')).toBeInTheDocument()
  })
})