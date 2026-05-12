import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Heart, 
  Eye, 
  MapPin, 
  User, 
  MessageCircle, 
  Edit3, 
  Trash2, 
  ChevronLeft,
  Calendar,
  Tag,
  ShieldCheck,
  Package
} from "lucide-react";
import { getItemByIdService, likeItemService, deleteItemService } from "../services/itemService";
import Navbar from "../components/Navbar";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    fetchItem();
  }, [id]);

  async function fetchItem() {
    try {
      setLoading(true);
      const data = await getItemByIdService(id);
      setItem(data);
      setLikesCount(data.likes?.length || 0);
      setLiked(data.likes?.some(l => l.user_id === user?.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLike() {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const res = await likeItemService(id, user.id);
      setLiked(res.liked);
      setLikesCount(prev => res.liked ? prev + 1 : prev - 1);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
    try {
      await deleteItemService(id, user.id);
      navigate("/home");
    } catch (err) {
      alert(err.message);
    }
  }

  function handleChat() {
    if (!user) {
      navigate("/login");
      return;
    }
    localStorage.setItem("targetChatId", item.owner_id);
    localStorage.setItem("targetChatProduct", JSON.stringify({
      id: item.id,
      title: item.title,
      price: item.price_per_day,
      image: item.image
    }));
    navigate("/chat");
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Memuat detail produk...</p>
      </div>
    </div>
  );

  if (error || !item) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trash2 className="text-red-500" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Produk Tidak Ditemukan</h2>
        <p className="text-slate-500 mb-8">{error || "Maaf, produk yang Anda cari mungkin sudah dihapus atau tidak tersedia."}</p>
        <button onClick={() => navigate("/home")} className="primary-pill-button w-full">Kembali ke Beranda</button>
      </div>
    </div>
  );

  const isOwner = user?.id === item.owner_id;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-slate-100">
            <ChevronLeft size={20} />
          </div>
          <span className="font-medium">Kembali</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Side: Images */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl border border-slate-100 sticky top-24">
              <div className="aspect-[4/3] w-full relative">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <Package size={80} className="text-slate-300" />
                  </div>
                )}
                
                {/* Stats Overlay */}
                <div className="absolute top-6 right-6 flex flex-col gap-3">
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20 flex items-center gap-2">
                    <Eye size={18} className="text-slate-600" />
                    <span className="font-bold text-slate-900 text-sm">{item.views}</span>
                  </div>
                  <button 
                    onClick={handleLike}
                    className={`px-4 py-2 rounded-full shadow-lg border border-white/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${liked ? 'bg-red-500 text-white' : 'bg-white/90 backdrop-blur-md text-slate-900'}`}
                  >
                    <Heart size={18} fill={liked ? "currentColor" : "none"} className={liked ? "text-white" : "text-red-500"} />
                    <span className="font-bold text-sm">{likesCount}</span>
                  </button>
                </div>

                {/* Status Badge */}
                <div className="absolute bottom-6 left-6">
                  <span className={`px-5 py-2 rounded-full shadow-lg font-bold text-sm tracking-wide uppercase ${item.status === 'rented' ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white'}`}>
                    {item.status === 'rented' ? 'Sedang Disewa' : 'Tersedia'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Details */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                  {item.category_name || "Lainnya"}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <Calendar size={14} />
                  Ditambahkan {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">{item.title}</h1>
              
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-4xl font-black text-blue-600">
                  Rp {parseFloat(item.price_per_day).toLocaleString('id-ID')}
                </span>
                <span className="text-slate-400 font-medium">/ hari</span>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-slate-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Lokasi Pengambilan</h4>
                    <p className="text-slate-700 font-semibold">{item.location || "Lokasi tidak ditentukan"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                    <Tag className="text-slate-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Deskripsi Produk</h4>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{item.description || "Tidak ada deskripsi untuk produk ini."}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-8 mt-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-200 border-4 border-white shadow-md overflow-hidden">
                      {item.owner?.avatarB64 ? (
                        <img src={item.owner.avatarB64} alt={item.owner_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-xl uppercase">
                          {item.owner_name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Pemilik</h4>
                      <p className="text-slate-900 font-bold text-lg">{item.owner_name}</p>
                    </div>
                  </div>
                  
                  {!isOwner && (
                    <button className="text-blue-600 font-bold text-sm hover:underline">Lihat Profil</button>
                  )}
                </div>

                <div className="flex gap-3">
                  {isOwner ? (
                    <>
                      <button 
                        onClick={() => navigate(`/upload?edit=${id}`)}
                        className="flex-1 bg-slate-900 text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Edit3 size={20} /> Edit Produk
                      </button>
                      <button 
                        onClick={handleDelete}
                        className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center transition-transform hover:scale-[1.02] active:scale-[0.98] border border-red-100"
                        title="Hapus Produk"
                      >
                        <Trash2 size={24} />
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={handleChat}
                      disabled={item.status === 'rented'}
                      className={`flex-1 h-14 rounded-2xl font-extrabold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-200 ${item.status === 'rented' ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      <MessageCircle size={22} /> {item.status === 'rented' ? 'Produk Sedang Disewa' : 'Chat Penjual'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics & Interactions Lists */}
            <div className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-100 overflow-hidden">
              <div className="flex items-center gap-3 mb-8">
                <ShieldCheck className="text-blue-600" size={24} />
                <h3 className="text-xl font-bold text-slate-900">Interaksi & Peminat</h3>
              </div>

              <div className="space-y-8">
                {/* Likers List */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
                    <span>Disukai oleh</span>
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-xs">{item.likes?.length || 0} orang</span>
                  </h4>
                  {item.likes?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {item.likes.map((like) => (
                        <div key={like.user_id} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-default" title={like.user.username}>
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 overflow-hidden">
                            {like.user.avatarB64 ? <img src={like.user.avatarB64} className="w-full h-full object-cover" /> : like.user.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs font-semibold text-slate-700 max-w-[80px] truncate">{like.user.username}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Belum ada yang menyukai produk ini</p>
                  )}
                </div>

                {/* Renters List (Offers) */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
                    <span>Peminat Sewa</span>
                    <span className="bg-orange-100 text-orange-600 px-2.5 py-0.5 rounded-full text-xs">{item.penawaran?.length || 0} orang</span>
                  </h4>
                  {item.penawaran?.length > 0 ? (
                    <div className="space-y-3">
                      {item.penawaran.map((offer) => (
                        <div key={offer.penawaran_id} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-2xl group hover:border-orange-200 hover:bg-orange-50/30 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-sm font-bold text-slate-600 overflow-hidden">
                              {offer.user.avatarB64 ? <img src={offer.user.avatarB64} className="w-full h-full object-cover" /> : offer.user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{offer.user.username}</p>
                              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Menawar Rp {offer.harga.toLocaleString('id-ID')}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              localStorage.setItem("targetChatId", offer.user.id);
                              navigate("/chat");
                            }}
                            className="bg-white p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:shadow-md transition-all active:scale-95"
                          >
                            <MessageCircle size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-2xl p-6 text-center border border-dashed border-slate-200">
                      <p className="text-xs text-slate-400 italic mb-1">Belum ada yang membuat penawaran</p>
                      <p className="text-[10px] text-slate-300">Bagikan produk ini untuk mendapatkan peminat!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
