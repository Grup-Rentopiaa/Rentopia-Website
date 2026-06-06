import { useNavigate } from "react-router-dom"

export default function NotFoundPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  function handleBack() {
  if (token) {
    navigate("/home", { replace: true })
  } else {
    navigate("/", { replace: true })
  }
}

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "#FFFFFF" }}>
      <h1 className="text-5xl font-black mb-3" style={{ color: "#3D2F6B" }}>404</h1>
      <h2 className="text-2xl font-black mb-2" style={{ color: "#3D2F6B" }}>Halaman Tidak Ditemukan</h2>
      <p className="text-sm mb-8 max-w-sm" style={{ color: "#A89CC4" }}>
        Halaman yang kamu cari tidak ada atau sudah dipindahkan.
      </p>
      <img src="/error-404.png" alt="404" style={{ width: 320, maxWidth: "100%", marginBottom: 32 }} />
      <button onClick={handleBack} className="rp-btn-primary px-6 py-3">
        Kembali
      </button>
    </div>
  )
}