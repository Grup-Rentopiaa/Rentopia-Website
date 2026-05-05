import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import WishlistPage from './pages/WishlistPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
