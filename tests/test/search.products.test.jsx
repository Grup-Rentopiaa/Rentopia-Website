import { render, screen, waitFor } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../api', () => ({ default: vi.fn() }))
vi.mock('../components/AppNavbar', () => ({ default: () => <nav>Navbar</nav> }))
vi.mock('../components/ProductCard', () => ({
  default: ({ item }) => <div data-testid="product-card">{item.title}</div>
}))
vi.mock('../utils/Features', () => ({
  saveCatalogToIndexedDB: vi.fn().mockResolvedValue(true),
  getCatalogFromIndexedDB: vi.fn().mockResolvedValue([]),
  triggerDataChanged: vi.fn(),
}))

import apiFetch from '../api'
import SearchPage from '../pages/SearchPage'
import useProducts from '../hooks/useProducts'

const mockProducts = [
  { id: 1, title: 'Kamera Canon', price_per_day: 75000 },
  { id: 2, title: 'Tenda Dome', price_per_day: 50000 },
]

const mockUsers = [
  { id: 1, username: 'amel', name: 'Amel', followers: 10 },
  { id: 2, username: 'budi', name: 'Budi', followers: 5 },
]

const renderSearchPage = (query = 'kamera') => render(
  <MemoryRouter initialEntries={[`/search?q=${query}`]}>
    <Routes>
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  </MemoryRouter>
)

// ─────────────────────────────────────────────
// SEARCH PAGE
// ─────────────────────────────────────────────
describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('menampilkan skeleton saat loading', () => {
    apiFetch.mockReturnValue(new Promise(() => {}))
    renderSearchPage()
    const skeletons = document.querySelectorAll('.rp-skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  test('menampilkan hasil produk setelah search', async () => {
    apiFetch.mockResolvedValueOnce(mockProducts)
    apiFetch.mockResolvedValueOnce(mockUsers)

    renderSearchPage('kamera')

    await waitFor(() => {
      expect(screen.getByText('Kamera Canon')).toBeInTheDocument()
    })
  })

  test('menampilkan tab produk dan pengguna', async () => {
    apiFetch.mockResolvedValueOnce(mockProducts)
    apiFetch.mockResolvedValueOnce(mockUsers)

    renderSearchPage('kamera')

    await waitFor(() => {
      expect(screen.getByText(/Produk/)).toBeInTheDocument()
      expect(screen.getByText(/Pengguna/)).toBeInTheDocument()
    })
  })

  test('menampilkan jumlah hasil di tab', async () => {
    apiFetch.mockResolvedValueOnce(mockProducts)
    apiFetch.mockResolvedValueOnce(mockUsers)

    renderSearchPage('kamera')

    await waitFor(() => {
      expect(screen.getByText(`Produk (${mockProducts.length})`)).toBeInTheDocument()
      expect(screen.getByText(`Pengguna (${mockUsers.length})`)).toBeInTheDocument()
    })
  })

  test('menampilkan empty state jika produk kosong', async () => {
    apiFetch.mockResolvedValueOnce([])
    apiFetch.mockResolvedValueOnce([])

    renderSearchPage('xyznotfound')

    await waitFor(() => {
      expect(screen.getByText('Tidak ada hasil')).toBeInTheDocument()
    })
  })

  test('tidak fetch jika query kosong', () => {
    renderSearchPage('')
    expect(apiFetch).not.toHaveBeenCalled()
  })

  test('menampilkan query di halaman', async () => {
    apiFetch.mockResolvedValueOnce(mockProducts)
    apiFetch.mockResolvedValueOnce(mockUsers)

    renderSearchPage('kamera')

    await waitFor(() => {
      expect(screen.getByText('kamera')).toBeInTheDocument()
    })
  })
})

// ─────────────────────────────────────────────
// USE PRODUCTS HOOK
// ─────────────────────────────────────────────
describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiFetch.mockResolvedValue(mockProducts)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('berhasil load produk', async () => {
    const { result } = renderHook(() => useProducts('', '', { sort: 'random' }, null))

    act(() => { vi.advanceTimersByTime(300) })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.items).toHaveLength(2)
  })

  test('mengirim parameter search ke API', async () => {
    renderHook(() => useProducts('kamera', '', { sort: 'random' }, null))

    act(() => { vi.advanceTimersByTime(300) })

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith(expect.stringContaining('search=kamera'))
    })
  })

  test('mengirim parameter category ke API', async () => {
    renderHook(() => useProducts('', 'elektronik', { sort: 'random' }, null))

    act(() => { vi.advanceTimersByTime(300) })

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith(expect.stringContaining('category=elektronik'))
    })
  })

  test('mengirim parameter sort trending ke API', async () => {
    renderHook(() => useProducts('', '', { sort: 'trending' }, null))

    act(() => { vi.advanceTimersByTime(300) })

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith(expect.stringContaining('sort=trending'))
    })
  })

  test('mengirim parameter harga min dan max ke API', async () => {
    renderHook(() => useProducts('', '', { sort: 'random', minPrice: '50000', maxPrice: '200000' }, null))

    act(() => { vi.advanceTimersByTime(300) })

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining('min_price=50000')
      )
    })
  })

  test('debounce — tidak fetch sebelum 300ms', () => {
    renderHook(() => useProducts('kamera', '', { sort: 'random' }, null))

    act(() => { vi.advanceTimersByTime(100) })

    expect(apiFetch).not.toHaveBeenCalled()
  })
})