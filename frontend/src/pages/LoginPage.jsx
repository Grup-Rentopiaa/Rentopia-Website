import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useUserContext } from "../context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loading, error, login: authLogin } = useAuth();
  const { login } = useUserContext();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  function validate() {
    const errs = {};
    if (!email.trim())    errs.email    = "Email wajib diisi";
    if (!password)        errs.password = "Password wajib diisi";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    const result = await authLogin({ email, password });
    if (result) {
      login(result.user, result.token);
      navigate("/home", { replace: true });
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Kiri */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden" style={{background: '#7C4DFF'}}>
        <div style={{position:'absolute', top:'-60px', left:'-60px', width:'250px', height:'250px', background:'rgba(255,255,255,0.06)', borderRadius:'50%'}}></div>
        <div style={{position:'absolute', bottom:'-80px', right:'-80px', width:'300px', height:'300px', background:'rgba(255,255,255,0.06)', borderRadius:'50%'}}></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background:'rgba(255,255,255,0.2)'}}>
              <img src="/logo.png" alt="Rentopia" style={{width: 28, height: 28, objectFit: 'contain'}} />
            </div>
            <span className="font-black text-xl text-white">Rentopia</span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <svg width="320" height="360" viewBox="0 0 320 360">
            <ellipse cx="160" cy="348" rx="110" ry="12" fill="rgba(0,0,0,0.15)"/>
            <path d="M105 185 Q90 148 103 128 Q113 112 126 125 Q120 155 123 183 Z" fill="#fff" stroke="#E0E0E0" strokeWidth="1"/>
            <path d="M215 185 Q230 148 217 128 Q207 112 194 125 Q200 155 197 183 Z" fill="#fff" stroke="#E0E0E0" strokeWidth="1"/>
            <path d="M105 185 Q90 148 103 128 Q113 112 126 125 Q120 155 123 183 Z" fill="#FFB6C1" opacity="0.45"/>
            <path d="M215 185 Q230 148 217 128 Q207 112 194 125 Q200 155 197 183 Z" fill="#FFB6C1" opacity="0.45"/>
            <ellipse cx="160" cy="242" rx="67" ry="76" fill="#E8E8E8"/>
            <ellipse cx="160" cy="232" rx="61" ry="68" fill="#F0F0F0"/>
            <ellipse cx="160" cy="221" rx="50" ry="52" fill="#fff"/>
            <circle cx="143" cy="208" r="8" fill="#2D1B69"/>
            <circle cx="177" cy="208" r="8" fill="#2D1B69"/>
            <circle cx="145.5" cy="206" r="3.2" fill="#fff"/>
            <circle cx="179.5" cy="206" r="3.2" fill="#fff"/>
            <ellipse cx="160" cy="221" rx="7" ry="5" fill="#FFB6C1"/>
            <path d="M153 228 Q160 233 167 228" stroke="#E8956D" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <ellipse cx="145" cy="232" rx="9.5" ry="5" fill="#FFB6C1"/>
            <ellipse cx="175" cy="232" rx="9.5" ry="5" fill="#FFB6C1"/>
            <rect x="115" y="284" width="90" height="65" rx="26" fill="#7C4DFF" opacity="0.8"/>
            <rect x="121" y="290" width="78" height="53" rx="20" fill="#9C6FFF" opacity="0.8"/>
            <path d="M102 272 Q83 247 97 218 Q110 192 123 202 Q116 233 119 268 Z" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
            <path d="M218 272 Q237 247 223 218 Q210 192 197 202 Q204 233 201 268 Z" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
            <path d="M76 308 Q62 332 71 350 Q80 360 94 350 Q103 332 94 308 Z" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
            <path d="M244 308 Q258 332 249 350 Q240 360 226 350 Q217 332 226 308 Z" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="0.5"/>
          </svg>
        </div>

        <div className="relative z-10">
          <h2 className="font-black text-3xl text-white mb-2" style={{letterSpacing: '-0.5px'}}>
            Selamat datang<br/>kembali!
          </h2>
          <p className="text-sm" style={{color: 'rgba(255,255,255,0.65)'}}>
            Masuk dan lanjutkan pengalamanmu bersama Rentopia.
          </p>
        </div>
      </div>

      {/* Kanan - Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12" style={{background: '#fff'}}>
        <div className="w-full max-w-sm">

          <div className="lg:hidden flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/logo.png" alt="Rentopia" style={{width: 32, height: 32, objectFit: 'contain'}} />
            <span className="font-black text-lg" style={{color: '#7C4DFF'}}>Rentopia</span>
          </div>

          <h1 className="font-black text-3xl mb-1" style={{color: '#1A1A2E', letterSpacing: '-0.5px'}}>Masuk</h1>
          <p className="text-sm mb-8" style={{color: '#888'}}>
            Belum punya akun?{" "}
            <Link to="/register" className="font-black" style={{color: '#7C4DFF'}}>Daftar gratis</Link>
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm font-semibold" style={{background: '#FFF0F0', color: '#C0394A', border: '1.5px solid #FFB3B3'}}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="space-y-1.5">
              <Label className="font-bold text-sm" style={{color: '#1A1A2E'}}>Email</Label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{color: '#9C6FFF'}}/>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="contoh@email.com"
                  autoComplete="email"
                  className="pl-10 rounded-xl h-11"
                  style={{borderColor: fieldErrors.email ? '#FFB3B3' : '#E0D5FF', borderWidth: '2px'}}
                />
              </div>
              {fieldErrors.email && <p className="text-xs font-semibold" style={{color: '#C0394A'}}>{fieldErrors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="font-bold text-sm" style={{color: '#1A1A2E'}}>Password</Label>
                <Link to="/forgot-password" className="text-xs font-bold" style={{color: '#7C4DFF'}}>Lupa password?</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{color: '#9C6FFF'}}/>
                <Input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  className="pl-10 pr-10 rounded-xl h-11"
                  style={{borderColor: fieldErrors.password ? '#FFB3B3' : '#E0D5FF', borderWidth: '2px'}}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{color: '#9C6FFF'}}>
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {fieldErrors.password && <p className="text-xs font-semibold" style={{color: '#C0394A'}}>{fieldErrors.password}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl font-black text-base"
              style={{background: '#7C4DFF', color: '#fff'}}
            >
              {loading ? (
                <><span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"/>Masuk...</>
              ) : "Masuk"}
            </Button>
          </form>

          <button
            onClick={() => navigate("/")}
            className="w-full mt-6 text-sm font-semibold flex items-center justify-center gap-2"
            style={{color: '#888'}}
          >
            Kembali ke Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}