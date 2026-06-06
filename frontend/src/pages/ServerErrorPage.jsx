import { useNavigate } from "react-router-dom"

export default function ServerErrorPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "#ffffff" }}>
      <h1 className="text-5xl font-black mb-3" style={{ color: "#3D2F6B" }}>500</h1>
      <h2 className="text-2xl font-black mb-2" style={{ color: "#3D2F6B" }}>Server Sedang Bermasalah</h2>
      <p className="text-sm mb-8 max-w-sm" style={{ color: "#A89CC4" }}>
        Server kami sedang mengalami gangguan. Tim kami sudah diberitahu dan sedang memperbaikinya. Coba beberapa saat lagi.
      </p>
      <img src="/error-500.png" alt="500" style={{ width: 320, maxWidth: "100%", marginBottom: 32 }} />
    </div>
  )
}
