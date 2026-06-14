import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, SlidersHorizontal, X } from "lucide-react";
import useProducts from "../hooks/useProducts";
import AppNavbar from "../components/AppNavbar";
import ProductCard from "../components/ProductCard";
import { CATEGORIES } from "../constants/categories";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [search,       setSearch]       = useState("");
  const [category,     setCategory]     = useState(searchParams.get("category") || "");
  const [filter,       setFilter]       = useState({ sort: "random", minPrice: "", maxPrice: "" });
  const [showFilter,   setShowFilter]   = useState(false);
  const [wishlistCount,setWishlistCount]= useState(0);

  const { items, loading } = useProducts(search, category, filter, user?.id);

 
  useEffect(() => {
    setCategory(searchParams.get("category") || "");
  }, [searchParams]);

  
  useEffect(() => {
    if (!user) return;
    const count = () => {
      const l = JSON.parse(localStorage.getItem(`rentopia_wishlist_${user.id}`) || "[]");
      setWishlistCount(l.length);
    };
    count();
    window.addEventListener("likeChanged", count);
    return () => window.removeEventListener("likeChanged", count);
  }, []);

  return (
    <div className="min-h-screen rp-page" style={{ background: "#FAF8FF" }}>
      <AppNavbar
        wishlistCount={wishlistCount}
        onSearch={setSearch}
        searchValue={search}
        onSearchSubmit={setSearch}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 pb-16">
        <button onClick={() => navigate(-1)} className="rp-back-btn mb-6">
          <ArrowLeft size={16} /> Kembali
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black" style={{ color: "#3D2F6B" }}>
              {category || "Semua Produk"}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#A89CC4" }}>
              {!loading ? `${items.length} produk ditemukan` : "Memuat..."}
            </p>
          </div>
          <button
            onClick={() => setShowFilter(v => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold"
            style={{ background: showFilter ? "#E8DCFF" : "#FFFFFF", color: "#9B87D9", border: "1px solid #E8DCFF" }}
          >
            <SlidersHorizontal size={14} /> Filter
          </button>
        </div>

        {/* Category pills — pakai cat.id dan cat.name */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 mb-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(category === cat.id ? "" : cat.id)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all"
              style={{
                background: category === cat.id
                  ? "linear-gradient(135deg, #C9B8FF, #B09FEF)" : "#FFFFFF",
                color: category === cat.id ? "#3D2F6B" : "#A89CC4",
                border: category === cat.id ? "none" : "1px solid #E8DCFF",
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filter panel */}
        {showFilter && (
          <div className="rp-card p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm" style={{ color: "#3D2F6B" }}>Filter &amp; Urutkan</h3>
              <button onClick={() => setShowFilter(false)}>
                <X size={16} style={{ color: "#A89CC4" }} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: "#7B6AAA" }}>Harga Min (Rp)</label>
                <input type="number" value={filter.minPrice}
                  onChange={e => setFilter(p => ({ ...p, minPrice: e.target.value }))}
                  placeholder="0" className="rp-input text-sm py-2" />
              </div>
              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: "#7B6AAA" }}>Harga Max (Rp)</label>
                <input type="number" value={filter.maxPrice}
                  onChange={e => setFilter(p => ({ ...p, maxPrice: e.target.value }))}
                  placeholder="∞" className="rp-input text-sm py-2" />
              </div>
              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: "#7B6AAA" }}>Urutkan</label>
                <select value={filter.sort}
                  onChange={e => setFilter(p => ({ ...p, sort: e.target.value }))}
                  className="rp-input text-sm py-2">
                  <option value="random">Default</option>
                  <option value="price_asc">Harga Terendah</option>
                  <option value="price_desc">Harga Tertinggi</option>
                  <option value="trending">Paling Populer</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setFilter({ sort: "random", minPrice: "", maxPrice: "" })}
                className="rp-btn-outline text-sm py-2 flex-1">Reset</button>
              <button onClick={() => setShowFilter(false)}
                className="rp-btn-primary text-sm py-2 flex-1">Terapkan</button>
            </div>
          </div>
        )}

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="rp-card overflow-hidden">
                <div className="rp-skeleton aspect-square w-full" />
                <div className="p-3 space-y-2">
                  <div className="rp-skeleton h-4 w-3/4" />
                  <div className="rp-skeleton h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rp-card py-20 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-black text-lg mb-2" style={{ color: "#3D2F6B" }}>Tidak ada produk</h3>
            <p className="text-sm mb-6" style={{ color: "#A89CC4" }}>Coba kategori atau filter lain</p>
            <button
              onClick={() => { setCategory(""); setSearch(""); setFilter({ sort: "random", minPrice: "", maxPrice: "" }); }}
              className="rp-btn-primary">
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map(item => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}