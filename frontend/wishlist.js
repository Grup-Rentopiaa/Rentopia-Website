const WISHLIST_KEY = "rentopia_wishlist";
const CART_KEY = "rentopia_cart";

let wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert("Silakan login dulu ya, Titha!");
        window.location.href = "login.html";
        return;
    }

    renderWishlist();
    updateBadge();
});

function renderWishlist() {
    const container = document.getElementById('wishlist-items');
    const countSpan = document.getElementById('wishlist-count');

    if (!container) return;
    container.innerHTML = "";

    if (countSpan) countSpan.innerText = wishlist.length;

    if (wishlist.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 100px 20px;">
                <ion-icon name="heart-dislike-outline" style="font-size: 80px; color: #555; opacity: 0.5;"></ion-icon>
                <h3 style="margin-top: 20px; color: white;">Wishlist Kosong, Titha...</h3>
                <p style="color: #888;">Yuk, cari barang keren lagi di Beranda!</p>
            </div>`;
        return;
    }

    wishlist.forEach((product) => {
        const card = document.createElement('div');
        card.className = 'product-card-premium show';
        const ratingValue = product.rate || product.rating?.rate || 0;
        const priceFormatted = Number(product.price).toLocaleString('id-ID');
        const km = product.distance || (Math.random() * 4 + 1).toFixed(1) + " km";

        card.innerHTML = `
            <div class="wishlist-container">
                <button class="love-btn active">
                    <ion-icon name="heart"></ion-icon>
                </button>
            </div>
            <div class="card-img-wrapper">
                <img src="${product.image}" alt="${product.title}" onerror="this.src='https://via.placeholder.com/150?text=Gambar+Error'">
                <span class="badge-distance">
                    <ion-icon name="location"></ion-icon> ${km}
                </span>
            </div>
            <div class="card-content">
                <div class="stats-row">
                    <span class="rating-box">
                        <ion-icon name="star"></ion-icon> ${ratingValue}
                    </span>
                    <span style="font-size:12px;color:#888;">
                        <ion-icon name="heart"></ion-icon> <span class="l-count">1</span> suka
                    </span>
                </div>
                <h4 class="card-title">${product.title}</h4>
                <p class="card-price" style="color:#2b78e4; font-weight:900;">Rp ${priceFormatted}</p>
                
                <div class="action-row" style="display: flex; gap: 10px; margin-top: 15px;">
                    <button class="rent-action-btn" onclick="chatOwner('${product.title}')" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <ion-icon name="chatbubble-ellipses-outline"></ion-icon> Chat
                    </button>
                    
                    <button class="mini-cart-btn" onclick="removeFromWishlist('${product.id}')" 
                            style="background: rgba(255, 77, 77, 0.1); border: 1px solid #ff4d4d; color: #ff4d4d;">
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                </div>
            </div>`;
        container.appendChild(card);
    });
}

window.removeFromWishlist = (id) => {
    console.log("Mencoba menghapus ID:", id);

    wishlist = wishlist.filter(item => item.id != id);

    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));

    renderWishlist();

    console.log("Sisa wishlist:", wishlist.length);
};

window.moveToCart = (id) => {
    const product = wishlist.find(item => item.id === id);
    if (product) {
        cart.push(product);
        wishlist = wishlist.filter(item => item.id !== id);
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        renderWishlist();
        updateBadge();
    }
};

function updateBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) badge.innerText = cart.length;
}

window.sortWishlist = () => {
    const sortType = document.getElementById('sort-wishlist').value;

    if (sortType === 'low') {
        wishlist.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortType === 'high') {
        wishlist.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    renderWishlist();
};
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
        alert("Halaman ini khusus member, Titha! Silakan login dulu ya.");
        window.location.href = "login.html";
    }
});

document.getElementById('clear-wishlist')?.addEventListener('click', () => {
    const modal = document.getElementById('confirm-modal');
    if (modal) modal.classList.add('active');
});

window.closeConfirmModal = function () {
    const modal = document.getElementById('confirm-modal');
    if (modal) modal.classList.remove('active');
};

window.executeClearWishlist = function () {
    wishlist = [];
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));

    renderWishlist();
    closeConfirmModal();

    if (typeof showToast === 'function') {
        showToast("Wishlist berhasil dibersihkan! 🧹");
    }
};

const exportWishlistToCSV = () => {
    const WISHLIST_KEY = "rentopia_wishlist";
    const wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];

    if (wishlist.length === 0) {
        showToast("Wishlist kosong! Tambahkan barang dulu ya. ❌");
        return;
    }

    const headers = ["Nama Produk", "Harga", "Kategori", "Rating"];

    const rows = wishlist.map(item => [
        `"${item.name || item.title}"`,
        `"${item.price}"`,
        `"${item.category || 'Umum'}"`,
        `"${item.rating || '4.9'}"`
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
        + headers.join(",") + "\n"
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Rentopia_Wishlist_Titha.csv");
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);

    showToast("Wishlist berhasil diekspor ke CSV! ✅");
};