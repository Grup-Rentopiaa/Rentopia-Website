const API_URL_BASE = "http://localhost:3000/api"; 
let allProducts = [];
let cartTotal = 0;

document.addEventListener('DOMContentLoaded', () => {
    // A. Tampilkan Nama User & Avatar
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        const nameElem = document.getElementById('display-user-name');
        const avatarElem = document.getElementById('user-avatar');
        if (nameElem) nameElem.innerText = `HALO, ${user.username.toUpperCase()}! ✨`;
        if (avatarElem) avatarElem.src = `https://ui-avatars.com/api/?name=${user.username}&background=00d4ff&color=fff`;
    }

    fetchProducts();
    updateWishlistBadge();
    setupEventListeners();
});

const fetchProducts = async () => {
    try {
        console.log("Menghubungkan ke Server Native Rentopia... 🚀");
        
        // Mahasiswa menerapkan request GET dengan protocol HTTP Native Fetch
        const response = await fetch(`${API_URL_BASE}/products`);
        
        if (!response.ok) throw new Error("Gagal mengambil data dari server");

        const data = await response.json();

        // Mapping data dari PostgreSQL ke format Dashboard
        allProducts = data.map(p => ({
            id: p.id,
            title: p.name || p.title, // Handle jika di DB kolomnya 'name'
            price: p.price,
            image: p.image,
            rate: p.rating || p.rate || "4.5",
            distance: p.distance || "1.2 km",
            likes: parseInt(p.loves || p.likes || 0), // Sinkron dengan kolom 'loves' di server.js
            category: p.category
        }));

        console.log("Data Berhasil Disinkronkan:", allProducts);

        // Render ke UI
        renderCatalog(allProducts);
        
        // Jalankan filter default agar tidak kosong
        if (allProducts.length > 0) {
            applyFilter('Peringkat Atas');
        }

    } catch (err) {
        console.error("Gagal sinkron database PostgreSQL!", err);
        showToast("Database Offline - Pastikan 'node server.js' jalan! ❌");
    }
};

function renderCatalog(products) {
    const list = document.getElementById('main-product-list');
    if (!list) return;

    list.innerHTML = products.length === 0 ?
        `<div style="grid-column:1/-1;text-align:center;padding:50px;color:#aaa;">Barang tidak ditemukan</div>` : '';

    products.forEach(p => list.appendChild(createCard(p)));
    applyScrollAnimation();
}

function createCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card-premium';
    // Gunakan data-attribute untuk memudahkan seleksi DOM nanti
    card.setAttribute('data-product-id', product.id);

    // 1. Ambil data user yang sedang login
    const user = JSON.parse(localStorage.getItem('currentUser')) || {};
    
    // 2. Ambil wishlist lokal
    const wishlist = JSON.parse(localStorage.getItem('rentopia_wishlist')) || [];

    // 3. LOGIKA PERBAIKAN: Cek status favorit dengan perbandingan tipe data yang aman (toString)
    // Kita juga bisa pastikan produk tersebut milik user yang aktif jika datanya ada
    const isLoved = wishlist.some(item => String(item.id) === String(product.id)) ? 'active' : '';

    card.innerHTML = `
        <div class="card-img-wrapper">
            <button class="love-btn ${isLoved}" onclick="syncToggleLove(this, ${product.id})">
                <ion-icon name="heart"></ion-icon>
            </button>
            <img src="${product.image}" 
                 onerror="this.onerror=null;this.src='https://placehold.co/300x200/2b78e4/ffffff?text=No+Image';">
            <span class="badge-distance"><ion-icon name="location"></ion-icon> ${product.distance || '1.2 km'}</span>
        </div>
        <div class="card-content">
            <div style="display:flex; justify-content:space-between; font-size:12px; color:#888;">
                <span>⭐ ${product.rate || '4.5'}</span>
                <span>❤️ <span class="l-count">${product.likes || 0}</span> suka</span>
            </div>
            <h4 class="card-title">${product.title}</h4>
            <p class="card-price">Rp ${Number(product.price).toLocaleString('id-ID')}</p>
            <div class="action-row">
                <button class="rent-action-btn" onclick="addToCart(event)">Sewa</button>
                <button class="mini-cart-btn" onclick="addToCart(event)">
                    <ion-icon name="cart-outline"></ion-icon>
                </button>
            </div>
        </div>`;
        
    return card;
}

window.syncToggleLove = async function (btn, productId) {
    const product = allProducts.find(p => p.id === productId);
    const user = JSON.parse(localStorage.getItem('currentUser'));

    // 1. Verifikasi Akun (Keamanan Sisi Klien)
    if (!user) {
        return alert("Titha, kamu harus Login dulu untuk menyimpan favorit ke server! ✨");
    }
    if (!product) return;

    const isAdding = !btn.classList.contains('active');

    try {
        // 2. Mahasiswa menerapkan sinkronisasi ke server dengan request POST
        // Menggunakan Native fetch (Tanpa framework/library axios)
        const response = await fetch(`http://localhost:3000/api/wishlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Opsional: Kirim Token JWT jika ingin verifikasi lebih ketat
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            },
            body: JSON.stringify({
                user_id: user.id,
                product_id: productId,
                action: isAdding ? 'add' : 'remove' // Memberi tahu server aksi yang dilakukan
            })
        });

        const resData = await response.json();

        if (resData.success) {
            // 3. Update State Lokal (Sinkronisasi UI)
            let wishlist = JSON.parse(localStorage.getItem('rentopia_wishlist')) || [];

            if (isAdding) {
                if (!wishlist.find(item => item.id === productId)) wishlist.push(product);
                product.likes++;
                showWishlistModal('add');
            } else {
                wishlist = wishlist.filter(item => item.id !== productId);
                product.likes = Math.max(0, product.likes - 1);
                showWishlistModal('remove');
            }

            // Update semua kartu di UI (Multi-Page Consistency)
            const allMatchingCards = document.querySelectorAll(`[data-product-id="${productId}"]`);
            allMatchingCards.forEach(card => {
                const loveBtn = card.querySelector('.love-btn');
                const countSpan = card.querySelector('.l-count');
                if (isAdding) loveBtn.classList.add('active');
                else loveBtn.classList.remove('active');
                if (countSpan) countSpan.innerText = product.likes;
            });

            // Simpan cache lokal & update badge
            localStorage.setItem('rentopia_wishlist', JSON.stringify(wishlist));
            updateWishlistBadge();

            console.log("Sinkronisasi Berhasil: Data tersimpan di PostgreSQL! 🚀");
        }
    } catch (err) {
        console.error("Gagal sinkron ke database:", err);
        alert("Gagal koneksi ke server. Pastikan 'node server.js' sudah jalan! 🛠️");
    }
};

window.applyFilter = function (type, element) {
    const container = document.getElementById('reco-product-list');
    if (!container) return;

    if (element) {
        document.querySelectorAll('.reco-tab').forEach(t => t.classList.remove('active'));
        element.classList.add('active');
    }

    if (type === 'Ikuti') {
        container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:30px;color:#aaa;"><p>Ikuti toko dulu untuk melihat rekomendasi ini.</p></div>`;
        return;
    }

    let recommended = [...allProducts];
    if (type === 'Peringkat Atas') recommended.sort((a, b) => b.rate - a.rate);
    if (type === 'Terdekat') recommended.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    container.innerHTML = "";
    recommended.slice(0, 4).forEach(p => container.appendChild(createCard(p)));
    applyScrollAnimation();
};

function toggleFilterMenu() {
    const menu = document.getElementById('filter-dropdown');
    const btn = document.querySelector('.filter-trigger-btn');

    menu.classList.toggle('open');
    btn.classList.toggle('active');
}

function performFilter() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const cat = document.getElementById('categoryFilter').value.toLowerCase();
    const sort = document.getElementById('sortOptions').value;

    let filtered = allProducts.filter(p => p.title.toLowerCase().includes(query));
    if (cat !== 'all') filtered = filtered.filter(p => p.category === cat);

    if (sort === 'priceLowHigh') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'priceHighLow') filtered.sort((a, b) => b.price - a.price);

    renderCatalog(filtered);
}

function setupEventListeners() {
    document.getElementById('searchInput')?.addEventListener('input', performFilter);
    document.getElementById('categoryFilter')?.addEventListener('change', performFilter);
    document.getElementById('sortOptions')?.addEventListener('change', performFilter);
}

window.showWishlistModal = function (type) {
    const modal = document.getElementById('wishlist-modal');
    const title = document.getElementById('modal-title');
    const msg = document.getElementById('modal-message');
    const icon = document.getElementById('modal-icon');

    if (!modal) return;

    if (type === 'add') {
        icon.innerHTML = "❤️";
        title.innerText = "Terpikat di Hati!";
        msg.innerText = "Produk impianmu berhasil masuk ke daftar favorit. Siap untuk disewa nanti, Titha? ✨";
    } else {
        icon.innerHTML = "💔";
        title.innerText = "Melepas Favorit";
        msg.innerText = "Produk telah dihapus. Jangan ragu buat cari barang keren lainnya ya! 🚀";
    }
    modal.classList.add('active');
};

window.closeWishlistModal = function () {
    const modal = document.getElementById('wishlist-modal');
    if (modal) modal.classList.remove('active');
};

function updateWishlistBadge() {
    const badge = document.getElementById('wishlist-badge');
    const wishlist = JSON.parse(localStorage.getItem('rentopia_wishlist')) || [];
    if (badge) badge.innerText = wishlist.length;
}

window.addToCart = (e) => {
    e.stopPropagation();
    cartTotal++;
    const badge = document.getElementById('cart-count');
    if (badge) badge.innerText = cartTotal;
    showToast("Berhasil simpan ke keranjang! 🛒");
};

function showToast(m) {
    const container = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = 'toast-msg';
    t.innerHTML = `<span>${m}</span>`;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function applyScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card-premium').forEach(card => observer.observe(card));
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
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