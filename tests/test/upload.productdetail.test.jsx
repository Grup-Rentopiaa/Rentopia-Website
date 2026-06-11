import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../api', () => ({ default: vi.fn() }))
vi.mock('../components/AppNavbar', () => ({ default: () => <nav>Navbar</nav> }))
vi.mock('../hooks/useUser', () => ({
  useUser: vi.fn().mockReturnValue({ userId: 1, user: { id: 1, username: 'amel' }, loading: false, error: null, updateUser: vi.fn() })
}))
vi.mock('../hooks/useItems', () => ({
  useItems: vi.fn().mockReturnValue({
    items: [], loading: false, error: null,
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn(), remove: vi.fn(), refresh: vi.fn()
  })
}))
vi.mock('../services/itemService', () => ({
  getItemByIdService: vi.fn(),
  updateItemService: vi.fn(),
  likeItemService: vi.fn(),
}))
vi.mock('../constants/categories', () => ({
  CATEGORY_NAMES: ['Kamera & Foto', 'Elektronik', 'Camping & Outdoor'],
  CATEGORIES: []
}))

import apiFetch from '../api'
import { getItemByIdService, likeItemService } from '../services/itemService'
import { useItems } from '../hooks/useItems'
import UploadPage from '../pages/UploadPage'
import ProductDetailPage from '../pages/ProductDetailPage'

const mockItem = {
  id: 1,
  title: 'Kamera Canon EOS',
  price_per_day: 75000,
  description: 'Kamera bagus untuk photography',
  location: 'Surabaya',
  status: 'available',
  image: null,
  category_name: 'Kamera & Foto',
  owner_id: 2,
  owner: { id: 2, username: 'budi', avatarB64: null },
  likes: [],
  views: 10,
  created_at: new Date().toISOString(),
}

const renderUploadPage = () => render(
  <MemoryRouter initialEntries={['/upload']}>
    <Routes>
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/profile" element={<div>Profile Page</div>} />
    </Routes>
  </MemoryRouter>
)

const renderDetailPage = (id = '1') => render(
  <MemoryRouter initialEntries={[`/product/${id}`]}>
    <Routes>
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/login" element={<div>Login Page</div>} />
      <Route path="/chat" element={<div>Chat Page</div>} />
    </Routes>
  </MemoryRouter>
)

// ─────────────────────────────────────────────
// UPLOAD PAGE
// ─────────────────────────────────────────────
describe('UploadPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  test('menampilkan form upload produk', () => {
    renderUploadPage()
    expect(screen.getByPlaceholderText(/nama produk/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/harga sewa/i)).toBeInTheDocument()
  })

  test('menampilkan error jika field wajib kosong saat submit', async () => {
    renderUploadPage()
    fireEvent.click(screen.getByText(/upload produk sekarang/i))
    await waitFor(() => {
      expect(screen.getByText(/nama, harga, dan kategori wajib diisi/i)).toBeInTheDocument()
    })
  })

  test('berhasil submit form dan redirect ke profile', async () => {
    const mockCreate = vi.fn().mockResolvedValue({})
    useItems.mockReturnValue({
      items: [], loading: false, error: null,
      create: mockCreate, update: vi.fn(), remove: vi.fn(), refresh: vi.fn()
    })

    renderUploadPage()

    fireEvent.change(screen.getByPlaceholderText(/nama produk/i), {
      target: { value: 'Kamera Canon' }
    })
    fireEvent.change(screen.getByPlaceholderText(/harga sewa/i), {
      target: { value: '75000' }
    })
    fireEvent.change(document.querySelector('select[name="category"]'), {
      target: { value: 'Kamera & Foto' }
    })

    fireEvent.click(screen.getByText(/upload produk sekarang/i))

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled()
    })
  })

  test('menampilkan loading saat menyimpan', async () => {
    const mockCreate = vi.fn().mockReturnValue(new Promise(() => {}))
    useItems.mockReturnValue({
      items: [], loading: false, error: null,
      create: mockCreate, update: vi.fn(), remove: vi.fn(), refresh: vi.fn()
    })

    renderUploadPage()

    fireEvent.change(screen.getByPlaceholderText(/nama produk/i), {
      target: { value: 'Kamera Canon' }
    })
    fireEvent.change(screen.getByPlaceholderText(/harga sewa/i), {
      target: { value: '75000' }
    })
    fireEvent.change(document.querySelector('select[name="category"]'), {
      target: { value: 'Kamera & Foto' }
    })

    fireEvent.click(screen.getByText(/upload produk sekarang/i))

    await waitFor(() => {
      expect(screen.getByText(/mengupload/i)).toBeInTheDocument()
    })
  })
})

// ─────────────────────────────────────────────
// PRODUCT DETAIL PAGE
// ─────────────────────────────────────────────
describe('ProductDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('user', JSON.stringify({ id: 1, username: 'amel' }))
  })

  test('menampilkan loading saat fetch item', () => {
    getItemByIdService.mockReturnValue(new Promise(() => {}))
    renderDetailPage()
    expect(screen.getByText(/memuat detail produk/i)).toBeInTheDocument()
  })

  test('menampilkan detail produk setelah fetch', async () => {
    getItemByIdService.mockResolvedValue(mockItem)
    apiFetch.mockResolvedValueOnce([])

    renderDetailPage()

    await waitFor(() => {
      expect(screen.getByText('Kamera Canon EOS')).toBeInTheDocument()
    })
  })

  test('menampilkan harga produk', async () => {
    getItemByIdService.mockResolvedValue(mockItem)
    apiFetch.mockResolvedValueOnce([])

    renderDetailPage()

    await waitFor(() => {
      expect(screen.getByText(/75\.000/)).toBeInTheDocument()
    })
  })

  test('menampilkan pesan error jika produk tidak ditemukan', async () => {
    getItemByIdService.mockRejectedValue(new Error('Not found'))

    renderDetailPage()

    await waitFor(() => {
      expect(screen.getByText(/produk tidak ditemukan/i)).toBeInTheDocument()
    })
  })

  test('menampilkan tombol chat untuk buyer', async () => {
    getItemByIdService.mockResolvedValue(mockItem)
    apiFetch.mockResolvedValueOnce([])

    renderDetailPage()

    await waitFor(() => {
      expect(screen.getByText(/chat & sewa sekarang/i)).toBeInTheDocument()
    })
  })

  test('menampilkan tombol edit untuk owner', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 2, username: 'budi' }))
    getItemByIdService.mockResolvedValue(mockItem)
    apiFetch.mockResolvedValueOnce([])

    renderDetailPage()

    await waitFor(() => {
      expect(screen.getByText(/edit/i)).toBeInTheDocument()
    })
  })

  test('menampilkan ulasan kosong jika tidak ada review', async () => {
    getItemByIdService.mockResolvedValue(mockItem)
    apiFetch.mockResolvedValueOnce([])

    renderDetailPage()

    await waitFor(() => {
      expect(screen.getByText('Belum ada ulasan')).toBeInTheDocument()
    })
  })

  test('menampilkan ulasan jika ada review', async () => {
    getItemByIdService.mockResolvedValue(mockItem)
    apiFetch.mockResolvedValueOnce([
      { id: 1, rating: 5, comment: 'Bagus sekali!', user: { username: 'citra' }, created_at: new Date().toISOString() }
    ])

    renderDetailPage()

    await waitFor(() => {
      expect(screen.getByText('Bagus sekali!')).toBeInTheDocument()
    })
  })

  test('toggle like item', async () => {
    getItemByIdService.mockResolvedValue(mockItem)
    apiFetch.mockResolvedValueOnce([])
    likeItemService.mockResolvedValue({})

    renderDetailPage()

    await waitFor(() => {
      expect(screen.getByText(/tambah ke wishlist/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText(/tambah ke wishlist/i))

    await waitFor(() => {
      expect(screen.getByText(/hapus dari wishlist/i)).toBeInTheDocument()
    })
  })
})