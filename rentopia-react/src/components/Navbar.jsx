import { useNavigate } from 'react-router-dom'

export default function Navbar({ wishlistCount = 0, cartCount = 0, onCartClick, onLogout }) {
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 w-full h-[70px] flex items-center justify-between px-5
                    bg-[#02214b]/90 backdrop-blur-md border-b border-white/10 z-[1000]">
      <div className="flex items-center gap-3">
        <div className="cursor-pointer text-[#00d4ff]">
          <ion-icon name="menu-outline" style={{ fontSize: '28px' }}></ion-icon>
        </div>
        <h3 className="text-[#00d4ff] font-black text-xl tracking-widest">RENTOPIA</h3>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative cursor-pointer text-[#00d4ff]" onClick={() => navigate('/wishlist')}>
          <ion-icon name="heart-outline" style={{ fontSize: '24px' }}></ion-icon>
          {wishlistCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px]
                             font-bold px-1.5 py-0.5 rounded-full border-2 border-[#02214b]">
              {wishlistCount}
            </span>
          )}
        </div>

        <div className="relative cursor-pointer text-[#00d4ff]" onClick={onCartClick}>
          <ion-icon name="cart-outline" style={{ fontSize: '24px' }}></ion-icon>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px]
                             font-bold px-1.5 py-0.5 rounded-full border-2 border-[#02214b]">
              {cartCount}
            </span>
          )}
        </div>

        <div className="relative cursor-pointer text-[#00d4ff]">
          <ion-icon name="notifications-outline" style={{ fontSize: '24px' }}></ion-icon>
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>

        {onLogout && (
          <button
            id="logout-btn"
            onClick={onLogout}
            title="Logout"
            className="cursor-pointer text-[#00d4ff] hover:text-red-400 transition-colors"
          >
            <ion-icon name="log-out-outline" style={{ fontSize: '24px' }}></ion-icon>
          </button>
        )}
      </div>
    </nav>
  )
}