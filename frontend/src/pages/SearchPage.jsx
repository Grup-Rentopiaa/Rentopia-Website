import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Users, Search } from "lucide-react";
import apiFetch from "../api";
import AppNavbar from "../components/AppNavbar";
import ProductCard from "../components/ProductCard";

function getAvatarColor(name = "") {
  const colors = ["#C9B8FF","#FFD6EC","#D6F0FF","#C9EFDC","#FFB3D9","#A8DAFF"];
  let h = 0; for (let i = 0; i < name.length; i++) h += name.charCodeAt(i);
  return colors[h % colors.length];
}

function UserCard({ u }) {
  const navigate = useNavigate();
  const initials = (u.name || u.username || "?")[0].toUpperCase();
  const color = getAvatarColor(u.username || "");
  return (
    <div className="rp-card p-4 flex items-center gap-4">
      {u.avatarB64 ? (
        <img src={u.avatarB64} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" alt="avatar" style={{ border: "2px solid #E8DCFF" }} />
      ) : (
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0"
          style={{ background: color, color: "#3D2F6B", border: "2px solid #E8DCFF" }}>
          {initials}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-black text-sm truncate" style={{ color: "#3D2F6B" }}>{u.name || u.username}</p>
        <p className="text-xs" style={{ color: "#A89CC4" }}>@{u.username}</p>
        <p className="text-xs mt-0.5" style={{ color: "#9B87D9" }}>{u.followers ?? 0} pengikut</p>
      </div>
      <button
        onClick={() => navigate(`/profile/${u.id}`)}
        className="rp-btn-outline text-xs px-3 py-2 flex-shrink-0">
        Lihat Profil
      </button>
    </div>
  );
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    Promise.all([
      apiFetch(`/api/items?search=${encodeURIComponent(query)}`).catch(() => []),
      apiFetch(`/api/search/users?q=${encodeURIComponent(query)}`).catch(() => []),
    ]).then(([p, u]) => {
      setProducts(Array.isArray(p) ? p : []);
      setUsers(Array.isArray(u) ? u : []);
    }).finally(() => setLoading(false));
  }, [query]);

  const EmptyState = ({ message }) => (
    <div className="rp-card py-20 text-center">
      <div className="text-5xl mb-4">🔍</div>
      <h3 className="font-black text-lg" style={{ color: "#3D2F6B" }}>Tidak ada hasil</h3>
      <p className="text-sm mt-1" style={{ color: "#A89CC4" }}>
        {message || `Tidak ada hasil untuk "${query}"`}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen rp-page" style={{ background: "#FAF8FF" }}>
      <AppNavbar searchValue={query} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="rp-back-btn mb-6">
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="mb-6">
          <h1 className="text-xl font-black" style={{ color: "#3D2F6B" }}>
            Hasil pencarian
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#A89CC4" }}>
            Menampilkan hasil untuk &ldquo;<strong>{query}</strong>&rdquo;
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1.5 rounded-2xl w-fit" style={{ background: "#FFFFFF", border: "1px solid #E8DCFF" }}>
          {[
            { id: "products", label: `Produk (${products.length})`, icon: <Package size={15} /> },
            { id: "users",    label: `Pengguna (${users.length})`,  icon: <Users    size={15} /> },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: tab === t.id ? "linear-gradient(135deg, #C9B8FF, #B09FEF)" : "transparent",
                color: tab === t.id ? "#3D2F6B" : "#A89CC4",
              }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => <div key={i} className="rp-skeleton h-48 rounded-2xl" />)}
          </div>
        ) : tab === "products" ? (
          products.length === 0
            ? <EmptyState />
            : <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(item => <ProductCard key={item.id} item={item} />)}
              </div>
        ) : (
          users.length === 0
            ? <EmptyState message={`Tidak ada pengguna dengan nama "${query}"`} />
            : <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {users.map(u => <UserCard key={u.id} u={u} />)}
              </div>
        )}
      </main>
    </div>
  );
}
