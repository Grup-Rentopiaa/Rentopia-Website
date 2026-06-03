import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function validate(values) {
  const errs = {};
  if (!values.username.trim())  errs.username = "Username wajib diisi";
  if (!values.email.trim())     errs.email    = "Email wajib diisi";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errs.email = "Format email tidak valid";
  if (!values.password)         errs.password = "Password wajib diisi";
  else if (values.password.length < 6) errs.password = "Minimal 6 karakter";
  if (values.password !== values.confirmPassword) errs.confirmPassword = "Password tidak sama";
  return errs;
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const { loading, error, signup } = useAuth();
  const [values, setValues]   = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors]   = useState({});
  const [showPass, setShowPass] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const result = await signup({ username: values.username, email: values.email, password: values.password });
    if (result) navigate("/verify-otp", { state: { email: values.email, from: "register" } });
  }

  return (
    <div className="min-h-screen flex">

      {/* Kiri - Ungu dengan Reni */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden" style={{background: '#7C4DFF'}}>

        <div style={{position:'absolute', top:'-60px', left:'-60px', width:'250px', height:'250px', background:'rgba(255,255,255,0.06)', borderRadius:'50%'}}></div>
        <div style={{position:'absolute', bottom:'-80px', right:'-80px', width:'300px', height:'300px', background:'rgba(255,255,255,0.06)', borderRadius:'50%'}}></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background:'rgba(255,255,255,0.2)'}}>
              <svg width="28" height="28" viewBox="0 0 28 28">
                <ellipse cx="14" cy="17" rx="8" ry="6" fill="#E0E0E0"/>
                <ellipse cx="14" cy="15" rx="7" ry="5" fill="#fff"/>
                <circle cx="11" cy="13" r="1.5" fill="#2D1B69"/>
                <circle cx="17" cy="13" r="1.5" fill="#2D1B69"/>
                <ellipse cx="14" cy="15" rx="2" ry="1.2" fill="#FFB6C1"/>
                <ellipse cx="10.5" cy="16.5" rx="2.5" ry="1.2" fill="#FFB6C1"/>
                <ellipse cx="17.5" cy="16.5" rx="2.5" ry="1.2" fill="#FFB6C1"/>
                <path d="M6 8 Q4 2 10 5 Q12 6 10 9 Z" fill="#fff" stroke="#E0E0E0" strokeWidth="0.5"/>
                <path d="M22 8 Q24 2 18 5 Q16 6 18 9 Z" fill="#fff" stroke="#E0E0E0" strokeWidth="0.5"/>
                <path d="M6 8 Q4 2 10 5 Q12 6 10 9 Z" fill="#FFB6C1" opacity="0.5"/>
                <path d="M22 8 Q24 2 18 5 Q16 6 18 9 Z" fill="#FFB6C1" opacity="0.5"/>
              </svg>
            </div>
            <span className="font-black text-xl text-white">Rentopia</span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <svg width="300" height="320" viewBox="0 0 300 320">
            <ellipse cx="150" cy="310" rx="100" ry="10" fill="rgba(0,0,0,0.15)"/>
            <path d="M98 172 Q84 138 96 120 Q105 105 117 117 Q112 144 114 170 Z" fill="#fff" stroke="#E0E0E0" strokeWidth="1"/>
            <path d="M202 172 Q216 138 204 120 Q195 105 183 117 Q188 144 186 170 Z" fill="#fff" stroke="#E0E0E0" strokeWidth="1"/>
            <path d="M98 172 Q84 138 96 120 Q105 105 117 117 Q112 144 114 170 Z" fill="#FFB6C1" opacity="0.45"/>
            <path d="M202 172 Q216 138 204 120 Q195 105 183 117 Q188 144 186 170 Z" fill="#FFB6C1" opacity="0.45"/>
            <ellipse cx="150" cy="226" rx="63" ry="72" fill="#E8E8E8"/>
            <ellipse cx="150" cy="217" rx="57" ry="64" fill="#F0F0F0"/>
            <ellipse cx="150" cy="207" rx="47" ry="49" fill="#fff"/>
            <circle cx="134" cy="195" r="7.5" fill="#2D1B69"/>
            <circle cx="166" cy="195" r="7.5" fill="#2D1B69"/>
            <circle cx="136.5" cy="193" r="3" fill="#fff"/>
            <circle cx="168.5" cy="193" r="3" fill="#fff"/>
            <ellipse cx="150" cy="207" rx="6.5" ry="4.5" fill="#FFB6C1"/>
            <path d="M143 215 Q150 221 157 215" stroke="#E8956D" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <ellipse cx="136" cy="218" rx="9" ry="4.5" fill="#FFB6C1"/>
            <ellipse cx="164" cy="218" rx="9" ry="4.5" fill="#FFB6C1"/>
            <rect x="108" y="268" width="84" height="60" rx="24" fill="#7C4DFF" opacity="0.8"/>
            <rect x="114" y="274" width="72" height="48" rx="18" fill="#9C6FFF" opacity="0.8"/>
            <path d="M96 257 Q78 233 91 206 Q103 181 115 190 Q108 219 111 253 Z" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
            <path d="M204 257 Q222 233 209 206 Q197 181 185 190 Q192 219 189 253 Z" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
            <path d="M72 292 Q59 314 67 330 Q75 339 88 330 Q96 314 88 292 Z" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
            <path d="M228 292 Q241 314 233 330 Q225 339 212 330 Q204 314 212 292 Z" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
            <circle cx="60" cy="160" r="18" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <text x="60" y="166" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.8)">✨</text>
            <circle cx="245" cy="200" r="14" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <text x="245" y="205" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.8)">🎉</text>
          </svg>
        </div>

        <div className="relative z-10">
          <h2 className="font-black text-3xl text-white mb-2" style={{letterSpacing: '-0.5px'}}>
            Gabung sekarang,<br/>gratis!
          </h2>
          <p className="text-sm" style={{color: 'rgba(255,255,255,0.65)'}}>
            Sewa atau sewakan barang dengan mudah bersama ribuan pengguna Rentopia.
          </p>
        </div>
      </div>

      {/* Kanan - Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 overflow-y-auto" style={{background: '#fff'}}>
        <div className="w-full max-w-sm">

          <div className="lg:hidden flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background: '#7C4DFF'}}>
              <span className="text-white font-black text-sm">R</span>
            </div>
            <span className="font-black text-lg" style={{color: '#7C4DFF'}}>Rentopia</span>
          </div>

          <h1 className="font-black text-3xl mb-1" style={{color: '#1A1A2E', letterSpacing: '-0.5px'}}>Buat Akun</h1>
          <p className="text-sm mb-8" style={{color: '#888'}}>
            Sudah punya akun?{" "}
            <Link to="/login" className="font-black" style={{color: '#7C4DFF'}}>Masuk sekarang</Link>
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm font-semibold" style={{background: '#FFF0F0', color: '#C0394A', border: '1.5px solid #FFB3B3'}}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            <div className="space-y-1.5">
              <Label className="font-bold text-sm" style={{color: '#1A1A2E'}}>Username</Label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{color: '#9C6FFF'}}/>
                <Input name="username" value={values.username} onChange={handleChange}
                  placeholder="username_kamu" autoComplete="username"
                  className="pl-10 rounded-xl h-11"
                  style={{borderColor: errors.username ? '#FFB3B3' : '#E0D5FF', borderWidth: '2px'}}/>
              </div>
              {errors.username && <p className="text-xs font-semibold" style={{color: '#C0394A'}}>{errors.username}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-sm" style={{color: '#1A1A2E'}}>Email</Label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{color: '#9C6FFF'}}/>
                <Input name="email" type="email" value={values.email} onChange={handleChange}
                  placeholder="contoh@email.com" autoComplete="email"
                  className="pl-10 rounded-xl h-11"
                  style={{borderColor: errors.email ? '#FFB3B3' : '#E0D5FF', borderWidth: '2px'}}/>
              </div>
              {errors.email && <p className="text-xs font-semibold" style={{color: '#C0394A'}}>{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-sm" style={{color: '#1A1A2E'}}>Password</Label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{color: '#9C6FFF'}}/>
                <Input name="password" type={showPass ? "text" : "password"} value={values.password} onChange={handleChange}
                  placeholder="Min. 6 karakter" autoComplete="new-password"
                  className="pl-10 pr-10 rounded-xl h-11"
                  style={{borderColor: errors.password ? '#FFB3B3' : '#E0D5FF', borderWidth: '2px'}}/>
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{color: '#9C6FFF'}}>
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {errors.password && <p className="text-xs font-semibold" style={{color: '#C0394A'}}>{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-sm" style={{color: '#1A1A2E'}}>Konfirmasi Password</Label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{color: '#9C6FFF'}}/>
                <Input name="confirmPassword" type="password" value={values.confirmPassword} onChange={handleChange}
                  placeholder="Ulangi password" autoComplete="new-password"
                  className="pl-10 rounded-xl h-11"
                  style={{borderColor: errors.confirmPassword ? '#FFB3B3' : '#E0D5FF', borderWidth: '2px'}}/>
              </div>
              {errors.confirmPassword && <p className="text-xs font-semibold" style={{color: '#C0394A'}}>{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" disabled={loading}
              className="w-full h-11 rounded-xl font-black text-base"
              style={{background: '#7C4DFF', color: '#fff'}}>
              {loading ? (
                <><span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"/>Mendaftarkan...</>
              ) : "Daftar Sekarang"}
            </Button>
          </form>

          <button onClick={() => navigate("/")}
            className="w-full mt-6 text-sm font-semibold flex items-center justify-center gap-2"
            style={{color: '#888'}}>
            ← Kembali ke Landing Page
          </button>

        </div>
      </div>
    </div>
  );
}