import { useNavigate } from "react-router-dom";
import { Tag, ExternalLink } from "lucide-react";

export default function ProductPin({ product }) {
  const navigate = useNavigate();

  if (!product) return null;

  return (
    <div
      className="flex-shrink-0 px-4 py-3 flex items-center gap-3"
      style={{
        background: "linear-gradient(135deg,#E8DCFF,#FFD6EC)",
        borderBottom: "1px solid #C9B8FF",
      }}
    >
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#C9B8FF" }}>
        {product.image
          ? <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <Tag size={10} style={{ color: "#9B87D9" }} />
          <span className="text-[10px] font-bold uppercase" style={{ color: "#9B87D9" }}>Produk Terkait</span>
        </div>
        <p className="text-sm font-black truncate" style={{ color: "#3D2F6B" }}>{product.title}</p>
        <p className="text-xs font-bold" style={{ color: "#9B87D9" }}>
          {new Intl.NumberFormat("id-ID", {
            style: "currency", currency: "IDR", maximumFractionDigits: 0,
          }).format(product.price)}
          <span className="font-normal" style={{ color: "#A89CC4" }}>/hari</span>
        </p>
      </div>
      <button
        onClick={() => navigate(`/product/${product.id}`)}
        className="flex-shrink-0 p-2 rounded-xl"
        style={{ background: "#E8DCFF" }}
      >
        <ExternalLink size={14} style={{ color: "#9B87D9" }} />
      </button>
    </div>
  );
}
