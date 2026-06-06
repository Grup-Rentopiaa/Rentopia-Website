import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function NotFoundPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const timer = setTimeout(() => {
      if (token) {
        navigate("/home", { replace: true })
      } else {
        navigate("/", { replace: true })
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "#FFFFFF" }}>
      <h1 className="text-5xl font-black mb-3" style={{ color: "#3D2F6B" }}>404</h1>
      <h2 className="text-2xl font-black mb-2" style={{ color: "#3D2F6B" }}>Halaman Tidak Ditemukan</h2>
      <p className="text-sm mb-8 max-w-sm" style={{ color: "#A89CC4" }}>
        Halaman yang kamu cari tidak ada. Kamu akan dialihkan secara otomatis...
      </p>
      <img src="/error-404.png" alt="404" style={{ width: 320, maxWidth: "100%" }} />
    </div>
  )
}