document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser && (window.location.pathname.includes('index.html') || window.location.pathname === '/')) {
        window.location.href = 'dashboard.html';
        return;
    }

    fetchHotDeals();
    checkCookieConsent();
});

function handleProtectedAction() {
    const modal = document.getElementById('login-warning-modal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLoginModal() {
    const modal = document.getElementById('login-warning-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

async function fetchHotDeals() {
    const container = document.getElementById('index-hot-deals');
    if (!container) return;

    try {
        const response = await axios.get('http://localhost:3000/api/products/hot-deals');
        const products = response.data;

        if (products.length > 0) {
            container.innerHTML = products.map(item => `
                <div class="product-card-premium">
                    <div class="card-header">
                        
                        <img src="${item.image_url || item.image || 'https://via.placeholder.com/300x200?text=Rentopia+Product'}" 
                             alt="${item.name || item.title || 'Barang Sewa'}" 
                             onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
                        
                        <button class="love-btn" onclick="handleProtectedAction()">
                            <ion-icon name="heart-outline"></ion-icon>
                        </button>
                    </div>
                    
                    <div class="card-body">
                        <div class="stats-row" style="display:flex; justify-content:space-between; margin-bottom:10px;">
                            <span class="rating-box" style="color:#ffc107; font-weight:700;">⭐ ${item.rating || '4.9'}</span>
                            <span class="like-count" style="color:#aaa; font-size:12px;">❤️ ${item.loves || 0}</span>
                        </div>
                        
                        <h4 class="card-title">${item.name || item.title || 'Produk Rentopia'}</h4>
                        
                        <p class="card-price">Rp ${parseInt(item.price || 0).toLocaleString('id-ID')}</p>
                        
                        <button class="rent-action-btn" onclick="handleProtectedAction()">
                            SEWA SEKARANG
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = `<p style="text-align:center; grid-column:1/-1; color:#aaa;">Belum ada penawaran populer di database.</p>`;
        }
    } catch (err) {
        console.error("Gagal load data dari PostgreSQL:", err);
        container.innerHTML = `<p style="color:#ff4d4d; text-align:center; grid-column:1/-1;">Gagal memuat data. Pastikan Server (Node.js) sudah jalan di terminal.</p>`;
    }
}

function checkCookieConsent() {
    const banner = document.getElementById('cookie-banner');

    if (banner) {
        banner.style.display = 'block';
        console.log("Banner paksa muncul");
    } else {
        console.error("ID 'cookie-banner' tidak  ketemu di HTML-mu!");
    }
}

const isAccepted = localStorage.getItem('rentopia_cookies');
const banner = document.getElementById('cookie-banner');

console.log("Status cookies saat ini:", isAccepted);

if (!isAccepted && banner) {
    setTimeout(() => {
        banner.style.display = 'block';
        console.log("Banner Cookies Muncul Otomatis!");
    }, 2000);
}

function acceptCookies() {
    localStorage.setItem('rentopia_cookies', 'true');
    closeCookieBanner();
}

function closeCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', checkCookieConsent);