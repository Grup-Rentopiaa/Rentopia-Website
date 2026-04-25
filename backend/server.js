const http = require('http');
const pool = require('./db');
const bcrypt = require('bcrypt'); // Untuk Salt & Hashing
const jwt = require('jsonwebtoken'); // Untuk Token Mobile

const PORT = 3000;
const SECRET_KEY = "TithaRentopia2026";
const sessions = {}; // Penyimpanan Session sederhana di memori server

const server = http.createServer(async (req, res) => {
    // 1. SETTING CORS MANUAL (Penting agar Frontend bisa akses)
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); // Sesuaikan port Live Servermu
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Fungsi Pembantu: Membaca Data Body (POST)
    const getBody = (req) => new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => resolve(JSON.parse(body || '{}')));
    });

    // --- ROUTING MANUAL ---

    // A. ENDPOINT REGISTER (Mahasiswa menerapkan Salt & Hashing)
    if (req.url === '/api/register' && req.method === 'POST') {
        try {
            const { username, email, password } = await getBody(req);
            const salt = await bcrypt.genSalt(10); // Penerapan SALT
            const hashedPassword = await bcrypt.hash(password, salt); // Hashing

            await pool.query(
                "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
                [username, email, hashedPassword]
            );

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: "User Terdaftar dengan Aman!" }));
        } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ message: "Gagal Register" }));
        }
    }

    // B. ENDPOINT LOGIN (Session, Cookies, & Token)
    else if (req.url === '/api/login' && req.method === 'POST') {
        try {
            const { username, password } = await getBody(req); // Ambil username, bukan email

            // Query cari berdasarkan USERNAME
            const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

            if (result.rows.length > 0) {
                const user = result.rows[0];
                const validPassword = await bcrypt.compare(password, user.password);

                if (validPassword) {
                    const sessionId = Math.random().toString(36).substring(2);
                    sessions[sessionId] = { id: user.id, username: user.username };
                    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

                    res.writeHead(200, {
                        'Content-Type': 'application/json',
                        'Set-Cookie': `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=86400`
                    });
                    res.end(JSON.stringify({ success: true, user: { id: user.id, username: user.username }, token }));
                } else {
                    res.writeHead(401); res.end(JSON.stringify({ message: "Password Salah!" }));
                }
            } else {
                res.writeHead(404); res.end(JSON.stringify({ message: "Username tidak ditemukan!" }));
            }
        } catch (err) {
            res.writeHead(500); res.end();
        }
    }

    // C. ENDPOINT PRODUK (GET Request - Sinkronisasi Server ke Client)
    else if (req.url === '/api/products' && req.method === 'GET') {
        try {
            const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ message: "Gagal ambil produk" }));
        }
    }

    // D. ENDPOINT HOT DEALS (Limit 4)
    else if (req.url === '/api/products/hot-deals' && req.method === 'GET') {
        try {
            const result = await pool.query('SELECT * FROM products LIMIT 4');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ message: "Gagal ambil hot deals" }));
        }
    }

    // E. ENDPOINT WISHLIST (POST Request)
    else if (req.url === '/api/wishlist' && req.method === 'POST') {
        try {
            const { user_id, product_id } = await getBody(req);
            await pool.query(
                "INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
                [user_id, product_id]
            );
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: "Tersimpan di PostgreSQL!" }));
        } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ message: "Gagal simpan wishlist" }));
        }
    }

    else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Not Found" }));
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Server Native Node.js Rentopia di http://localhost:${PORT}`);
});