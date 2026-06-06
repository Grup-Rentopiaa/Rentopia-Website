import { Component } from "react"

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
          style={{ background: "#FAF8FF" }}>
          <h1 className="text-5xl font-black mb-3" style={{ color: "#3D2F6B" }}>500</h1>
          <h2 className="text-2xl font-black mb-2" style={{ color: "#3D2F6B" }}>Terjadi Kesalahan</h2>
          <p className="text-sm mb-8 max-w-sm" style={{ color: "#A89CC4" }}>
            Terjadi kesalahan yang tidak terduga. Tim kami sedang memperbaikinya.
          </p>
          <img src="/error-500.png" alt="Error" style={{ width: 320, maxWidth: "100%", marginBottom: 32 }} />
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.href = "/home"; }}
            className="rp-btn-primary px-6 py-3">
            Kembali ke Beranda
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
