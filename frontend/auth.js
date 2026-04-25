const API_URL = "http://localhost:3000/api";

// 1. FUNGSI DAFTAR (Mengirim data ke Server untuk di-SALT)
async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPass = document.getElementById('reg-confirm-password').value;

    if (password !== confirmPass) return alert("Password nggak cocok nih!");

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (data.success) {
            alert("Berhasil Daftar dengan Salt & Hashing! ✨ Silakan Login.");
            window.location.href = 'login.html';
        } else {
            alert(data.message || "Gagal Daftar!");
        }
    } catch (err) {
        console.error("Error:", err);
        alert("Server belum jalan, Titha! 🛠️");
    }
}

// 2. FUNGSI LOGIN (Mengambil Session & Token dari Server Native)
async function handleLogin(event) {
    event.preventDefault();

    // Ambil data dari Form Login
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');

    if (!usernameInput || !passwordInput) {
        return console.error("ID login-username atau login-password tidak ditemukan di HTML!");
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    try {
        // Mahasiswa menerapkan request POST dengan protocol HTTP
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }) // Kirim username ke Server Native
        });

        const data = await response.json();

        if (data.success) {
            // 1. Simpan Data User & Token JWT untuk Mobile
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            localStorage.setItem('userToken', data.token);

            // 2. Notifikasi Berhasil (Verifikasi Akun Sukses)
            alert(`Halo ${data.user.username}, login berhasil! ✨`);

            // 3. Pindah ke Halaman Dashboard (Arsitektur MPA)
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message || "Username atau Password salah! ❌");
        }
    } catch (err) {
        console.error("Error Koneksi Server:", err);
        alert("Server Rentopia belum nyala, Titha! Jalankan 'node server.js' di terminal ya. 🛠️");
    }
}

// 3. LOGIKA COOKIES (Tetap dipertahankan untuk Verifikasi)
function acceptCookies() {
    localStorage.setItem('rentopia_cookies', 'true');
    // Set cookie manual sebagai tanda persetujuan
    document.cookie = "rentopia_consent=true; max-age=86400; path=/";
    closeCookieBanner();
}

function closeCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.style.display = 'none';
}