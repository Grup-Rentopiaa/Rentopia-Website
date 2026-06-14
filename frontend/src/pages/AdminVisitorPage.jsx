import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Users, MapPin, TrendingUp, Globe, BarChart2 } from "lucide-react";
import apiFetch from "../api";

function StatCard({ icon, label, value, color }) {
  return (
    <div className="rp-card p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: color + "20", color }}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black" style={{ color: "#3D2F6B" }}>{value}</p>
        <p className="text-xs" style={{ color: "#A89CC4" }}>{label}</p>
      </div>
    </div>
  )
}

function BarChart({ data, labelKey, valueKey, color = "#7C4DFF" }) {
  if (!data || data.length === 0) return (
    <p className="text-center py-8 text-sm" style={{ color: "#A89CC4" }}>Belum ada data</p>
  )
  const max = Math.max(...data.map(d => d[valueKey]))
  return (
    <div className="space-y-2">
      {data.slice(0, 10).map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs font-bold w-24 truncate flex-shrink-0" style={{ color: "#7B6AAA" }}>
            {item[labelKey]}
          </span>
          <div className="flex-1 h-7 rounded-xl overflow-hidden" style={{ background: "#F0EDF8" }}>
            <div
              className="h-full rounded-xl flex items-center px-3 transition-all duration-700"
              style={{
                width: `${(item[valueKey] / max) * 100}%`,
                background: `linear-gradient(90deg, ${color}, ${color}99)`,
                minWidth: 32,
              }}
            >
              <span className="text-xs font-black text-white">{item[valueKey]}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function LineChart({ data }) {
  if (!data || data.length === 0) return (
    <p className="text-center py-8 text-sm" style={{ color: "#A89CC4" }}>Belum ada data</p>
  )
  const max = Math.max(...data.map(d => d.count))
  const width = 600
  const height = 160
  const padX = 40
  const padY = 20
  const chartW = width - padX * 2
  const chartH = height - padY * 2

  const points = data.map((d, i) => ({
    x: padX + (i / Math.max(data.length - 1, 1)) * chartW,
    y: padY + (1 - d.count / (max || 1)) * chartH,
    ...d
  }))

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padY + chartH} L ${padX} ${padY + chartH} Z`

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ minWidth: 300 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C4DFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7C4DFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <line key={i}
            x1={padX} y1={padY + t * chartH}
            x2={padX + chartW} y2={padY + t * chartH}
            stroke="#E8DCFF" strokeWidth="1" strokeDasharray="4,4" />
        ))}
        <path d={areaD} fill="url(#areaGrad)" />
        <path d={pathD} fill="none" stroke="#7C4DFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#7C4DFF" stroke="white" strokeWidth="2" />
          </g>
        ))}
        {points.filter((_, i) => i % Math.ceil(points.length / 6) === 0).map((p, i) => (
          <text key={i} x={p.x} y={height - 4} textAnchor="middle" fontSize="9" fill="#A89CC4">
            {p.date?.slice(5)}
          </text>
        ))}
      </svg>
    </div>
  )
}

export default function AdminVisitorPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    apiFetch("/api/admin/visitor-stats")
      .then(data => setStats(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleExportCSV() {
    setExporting(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/admin/visitor-export", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "rentopia-visitors.csv"
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert("Gagal export CSV: " + err.message)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAF8FF" }}>

      {/* Navbar ungu */}
      <nav style={{
        background: '#7C4DFF',
        borderBottom: '1px solid rgba(255,255,255,0.15)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <img src="/logo.png" alt="Rentopia" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          <span className="font-black text-lg text-white" style={{ letterSpacing: '-0.5px' }}>Rentopia</span>
          <span className="text-xs font-bold px-3 py-1 rounded-full ml-1"
            style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
            Admin Panel
          </span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="rp-back-btn">
            <ArrowLeft size={16} /> Kembali
          </button>
          <button
            onClick={handleExportCSV}
            disabled={exporting || loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={{ background: "#7C4DFF", color: "#fff" }}
          >
            <Download size={15} />
            {exporting ? "Mengekspor..." : "Export CSV"}
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <BarChart2 size={24} style={{ color: "#7C4DFF" }} />
          <h1 className="text-xl font-black" style={{ color: "#3D2F6B" }}>Data Pengunjung</h1>
        </div>

        {error && (
          <div className="rp-card p-6 text-center mb-6">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="font-bold" style={{ color: "#3D2F6B" }}>Gagal memuat data</p>
            <p className="text-sm mt-1" style={{ color: "#A89CC4" }}>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array(4).fill(0).map((_, i) => <div key={i} className="rp-skeleton h-24 rounded-2xl" />)}
            </div>
            <div className="rp-skeleton h-48 rounded-2xl" />
          </div>
        ) : stats && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <StatCard icon={<Users size={20} />} label="Total Pengunjung" value={stats.total} color="#7C4DFF" />
              <StatCard icon={<TrendingUp size={20} />} label="Hari Aktif" value={stats.perDay.length} color="#2D7A55" />
              <StatCard icon={<MapPin size={20} />} label="Kota Unik" value={stats.perCity.length} color="#C9873D" />
              <StatCard icon={<Globe size={20} />} label="Negara Unik" value={stats.perCountry.length} color="#2660A4" />
            </div>

            {/* Grafik per hari */}
            <div className="rp-card p-6 mb-4">
              <h2 className="font-black mb-4" style={{ color: "#3D2F6B" }}>Grafik Pengunjung per Hari</h2>
              <LineChart data={stats.perDay} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="rp-card p-6">
                <h2 className="font-black mb-4" style={{ color: "#3D2F6B" }}>Top Kota</h2>
                <BarChart data={stats.perCity} labelKey="city" valueKey="count" color="#7C4DFF" />
              </div>
              <div className="rp-card p-6">
                <h2 className="font-black mb-4" style={{ color: "#3D2F6B" }}>Top Negara</h2>
                <BarChart data={stats.perCountry} labelKey="country" valueKey="count" color="#C9B8FF" />
              </div>
            </div>

            {/* Tabel */}
            <div className="rp-card overflow-hidden">
              <div className="px-6 py-4 border-b" style={{ borderColor: "#E8DCFF" }}>
                <h2 className="font-black" style={{ color: "#3D2F6B" }}>Tabel Pengunjung</h2>
                <p className="text-xs mt-0.5" style={{ color: "#A89CC4" }}>
                  {stats.visitors.length} record ·{" "}
                  <button onClick={handleExportCSV} className="font-bold" style={{ color: "#7C4DFF" }}>
                    Download CSV
                  </button>
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "#FAF8FF", borderBottom: "2px solid #E8DCFF" }}>
                      {["Visitor ID", "Halaman", "Kota", "Negara", "Browser", "Waktu"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-black" style={{ color: "#7B6AAA" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.visitors.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center" style={{ color: "#A89CC4" }}>
                          Belum ada data pengunjung
                        </td>
                      </tr>
                    ) : stats.visitors.slice(0, 50).map(v => (
                      <tr key={v.id} style={{ borderBottom: "1px solid #E8DCFF" }}>
                        <td className="px-4 py-3 text-xs font-mono" style={{ color: "#7C4DFF" }}>
                          {v.visitor_id?.slice(0, 20)}...
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#3D2F6B" }}>{v.page}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#7B6AAA" }}>{v.city || "—"}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#7B6AAA" }}>{v.country || "—"}</td>
                        <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: "#A89CC4" }}>
                          {v.browser?.split(' ')[0] || "—"}
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#A89CC4" }}>
                          {new Date(v.created_at).toLocaleDateString("id-ID", {
                            day: "numeric", month: "short", year: "numeric"
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}