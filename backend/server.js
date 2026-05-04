const express = require("express");
const http = require("http");
const https = require("https");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { createHmac, randomBytes, pbkdf2Sync } = require("crypto");
const { Pool } = require("pg");
const WebSocket = require("ws");
const selfsigned = require("selfsigned");

const app = express();

const pems = selfsigned.generate(
  [{ name: "commonName", value: "localhost" }],
  { days: 365 }
);

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "pemweb",
  password: "Renjun23032000.",
  port: 5432
});

const wsClients = new Map();
const sseClients = new Map();
const sessions = new Map();
let latestMessage = "No new messages yet";

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5502",
  "http://localhost:5500",
  "http://localhost:5502",
  "http://20.5.29.52:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Origin tidak diizinkan oleh CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return { hash, salt };
}

function verifyPassword(storedHash, salt, password) {
  const hash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return storedHash === hash;
}

function signToken(payload) {
  const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
  const body = JSON.stringify(payload);

  const encodedHeader = Buffer.from(header).toString("base64url");
  const encodedBody = Buffer.from(body).toString("base64url");

  const secret = "secretkey";
  const signature = createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedBody}`)
    .digest("base64url");

  return `${encodedHeader}.${encodedBody}.${signature}`;
}

function verifyToken(token) {
  const [encodedHeader, encodedBody, signature] = token.split(".");
  const secret = "secretkey";

  const validSignature = createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedBody}`)
    .digest("base64url");

  if (signature !== validSignature) {
    throw new Error("Invalid token");
  }

  return JSON.parse(Buffer.from(encodedBody, "base64url").toString());
}

function generateSessionId() {
  return randomBytes(32).toString("hex");
}

function createSession(user) {
  const sessionId = generateSessionId();

  sessions.set(sessionId, {
    userId: Number(user.id),
    email: user.email,
    createdAt: Date.now()
  });

  return sessionId;
}

function getSession(req) {
  const sessionId = req.cookies?.sessionId;
  if (!sessionId) return null;
  return sessions.get(sessionId) || null;
}

function destroySession(req) {
  const sessionId = req.cookies?.sessionId;
  if (sessionId) sessions.delete(sessionId);
}

function setSessionCookie(res, sessionId) {
  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    path: "/",
    maxAge: 86400 * 1000,
    sameSite: "lax"
  });
}

function clearSessionCookie(res) {
  res.clearCookie("sessionId", {
    httpOnly: true,
    path: "/",
    sameSite: "lax"
  });
}

function getTokenFromHeaders(req) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

function getAuthPayload(req) {
  const session = getSession(req);
  if (session) {
    return {
      id: Number(session.userId),
      email: session.email,
      authType: "session"
    };
  }

  const token = getTokenFromHeaders(req);
  if (token) {
    const payload = verifyToken(token);
    return {
      id: Number(payload.id),
      email: payload.email,
      authType: "token"
    };
  }

  throw new Error("Unauthorized");
}

async function getCurrentUser(req) {
  const auth = getAuthPayload(req);

  const result = await pool.query(
    "SELECT id, name, email, address FROM users WHERE id = $1",
    [auth.id]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
}

function sendSseToUser(userId, payload) {
  const client = sseClients.get(Number(userId));
  if (!client) return;
  client.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function sendWsToUser(userId, payload) {
  const client = wsClients.get(Number(userId));
  if (!client) return;
  if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(payload));
  }
}

function generatePenawaranId() {
  return `PNW-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

app.post("/register", async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, dan password wajib diisi"
      });
    }

    const checkUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: "Email sudah terdaftar" });
    }

    const { hash, salt } = hashPassword(password);

    await pool.query(
      `INSERT INTO users (name, email, password, salt, address)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, hash, salt, address || null]
    );

    return res.status(200).json({ message: "Registrasi berhasil" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email dan password wajib diisi" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];

    if (!verifyPassword(user.password, user.salt, password)) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    const sessionId = createSession(user);
    setSessionCookie(res, sessionId);

    const token = signToken({
      id: user.id,
      email: user.email
    });

    return res.status(200).json({
      message: "Login berhasil",
      auth: {
        session: true,
        token: true
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address
      },
      token
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.get("/me", async (req, res) => {
  try {
    const auth = getAuthPayload(req);

    const result = await pool.query(
      "SELECT id, name, email, address FROM users WHERE id = $1",
      [auth.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      authType: auth.authType,
      user: result.rows[0]
    });
  } catch (err) {
    console.error("ME ERROR:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const auth = getAuthPayload(req);

    const result = await pool.query(
      `SELECT 
         u.id,
         u.name,
         u.email,
         u.address,
         (
           SELECT m.isi_pesan
           FROM messages m
           WHERE (m.sender_id = u.id AND m.receiver_id = $1)
              OR (m.sender_id = $1 AND m.receiver_id = u.id)
           ORDER BY m.waktu DESC
           LIMIT 1
         ) AS last_message
       FROM users u
       WHERE u.id <> $1
       ORDER BY u.id ASC`,
      [auth.id]
    );

    return res.status(200).json({
      authType: auth.authType,
      data: result.rows
    });
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
});

app.get("/messages/:id", async (req, res) => {
  try {
    const auth = getAuthPayload(req);
    const myId = Number(auth.id);
    const targetId = Number(req.params.id);

    if (!targetId || Number.isNaN(targetId)) {
      return res.status(400).json({ error: "Target user tidak valid" });
    }

    const result = await pool.query(
      `SELECT pesan_id, sender_id, receiver_id, isi_pesan, waktu
       FROM messages
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY waktu ASC`,
      [myId, targetId]
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("GET MESSAGES ERROR:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
});

app.post("/messages/:id", async (req, res) => {
  try {
    const auth = getAuthPayload(req);
    const myId = Number(auth.id);
    const targetId = Number(req.params.id);

    if (!targetId || Number.isNaN(targetId)) {
      return res.status(400).json({ error: "Target user tidak valid" });
    }

    const checkTarget = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [targetId]
    );

    if (checkTarget.rows.length === 0) {
      return res.status(404).json({ error: "User tujuan tidak ditemukan" });
    }

    const { text } = req.body;

    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "Pesan kosong" });
    }

    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, isi_pesan, waktu)
       VALUES ($1, $2, $3, NOW())
       RETURNING pesan_id, sender_id, receiver_id, isi_pesan, waktu`,
      [myId, targetId, String(text).trim()]
    );

    const saved = result.rows[0];
    latestMessage = saved.isi_pesan;

    const payloadMessage = {
      from: saved.sender_id,
      to: saved.receiver_id,
      text: saved.isi_pesan,
      time: saved.waktu
    };

    sendWsToUser(targetId, payloadMessage);
    sendSseToUser(targetId, payloadMessage);

    return res.status(200).json({
      message: "Pesan berhasil dikirim",
      data: saved
    });
  } catch (err) {
    console.error("POST MESSAGES ERROR:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
});

app.post("/penawaran", async (req, res) => {
  try {
    const auth = getAuthPayload(req);
    const { produk_id, harga, target_id } = req.body;

    if (!harga || Number(harga) <= 0) {
      return res.status(400).json({ error: "Harga tidak valid" });
    }

    let produkId = null;
    let ownerId = null;

    if (produk_id && String(produk_id).trim()) {
      const produkResult = await pool.query(
        "SELECT produk_id, owner_id FROM produk WHERE produk_id = $1",
        [String(produk_id).trim()]
      );

      if (produkResult.rows.length === 0) {
        return res.status(404).json({ error: "Produk tidak ditemukan" });
      }

      produkId = produkResult.rows[0].produk_id;
      ownerId = Number(produkResult.rows[0].owner_id);
    }

    let targetId = Number(target_id);

    if (!targetId && ownerId) {
      targetId = ownerId;
    }

    if (!targetId || Number.isNaN(targetId)) {
      return res.status(400).json({ error: "Target user tidak valid" });
    }

    if (targetId === Number(auth.id)) {
      return res.status(400).json({ error: "Tidak bisa mengirim ke diri sendiri" });
    }

    const checkTarget = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [targetId]
    );

    if (checkTarget.rows.length === 0) {
      return res.status(404).json({ error: "User tujuan tidak ditemukan" });
    }

    const penawaranId = generatePenawaranId();
    const hargaNumber = Number(harga);
    const hargaFormat = hargaNumber.toLocaleString("id-ID");
    const isiPesan = `Saya menawar produk dengan harga Rp ${hargaFormat}`;

    const penawaranResult = await pool.query(
      `INSERT INTO penawaran (penawaran_id, produk_id, user_id, harga)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [penawaranId, produkId, auth.id, hargaNumber]
    );

    const messageResult = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, isi_pesan, waktu)
       VALUES ($1, $2, $3, NOW())
       RETURNING pesan_id, sender_id, receiver_id, isi_pesan, waktu`,
      [auth.id, targetId, isiPesan]
    );

    const savedMessage = messageResult.rows[0];

    const payloadMessage = {
      from: savedMessage.sender_id,
      to: savedMessage.receiver_id,
      text: savedMessage.isi_pesan,
      time: savedMessage.waktu
    };

    sendWsToUser(targetId, payloadMessage);
    sendSseToUser(targetId, payloadMessage);

    return res.status(200).json({
      message: "Penawaran berhasil dikirim",
      penawaran: penawaranResult.rows[0],
      chat: savedMessage,
      target_id: targetId
    });
  } catch (err) {
    console.error("POST PENAWARAN ERROR:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
});

app.get("/poll", (req, res) => {
  try {
    return res.status(200).json({ message: latestMessage });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/sse", (req, res) => {
  try {
    const auth = getAuthPayload(req);
    const myId = Number(auth.id);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders?.();
    res.write(`data: ${JSON.stringify({ message: "SSE connected" })}\n\n`);
    sseClients.set(myId, res);

    const keepAlive = setInterval(() => {
      res.write(`: ping\n\n`);
    }, 15000);

    req.on("close", () => {
      clearInterval(keepAlive);
      sseClients.delete(myId);
    });
  } catch (err) {
    console.error("SSE ERROR:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
});

app.get("/logout", (req, res) => {
  destroySession(req);
  clearSessionCookie(res);
  return res.status(200).json({ message: "Logged out" });
});

app.use((req, res) => {
  return res.status(404).json({ error: "Not Found" });
});

const httpServer = http.createServer(app);

httpServer.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});

https.createServer(
  {
    key: pems.private,
    cert: pems.cert
  },
  app
).listen(3443, () => {
  console.log("Server is running on https://localhost:3443");
});

const wss = new WebSocket.Server({ port: 3002 });

wss.on("connection", (ws, req) => {
  try {
    const fullUrl = new URL(req.url, "ws://127.0.0.1:3002");
    const token = fullUrl.searchParams.get("token");

    if (!token) {
      ws.close();
      return;
    }

    const payload = verifyToken(token);
    const myId = Number(payload.id);

    wsClients.set(myId, ws);
    console.log("WS connected user:", myId);

    ws.on("message", async (rawMessage) => {
      try {
        const data = JSON.parse(rawMessage.toString());
        if (data.type === "init") return;

        const from = Number(data.from);
        const to = Number(data.to);
        const text = String(data.text || "").trim();

        if (!from || !to || !text || from !== myId) return;

        const payloadMessage = {
          from,
          to,
          text,
          time: new Date().toISOString()
        };

        const clientWs = wsClients.get(to);
        if (clientWs && clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(JSON.stringify(payloadMessage));
        }
      } catch (err) {
        console.error("WS MESSAGE ERROR:", err);
      }
    });

    ws.on("close", () => {
      wsClients.delete(myId);
    });

    ws.on("error", (err) => {
      console.error("WS ERROR:", err);
    });
  } catch (err) {
    console.error("WS CONNECTION ERROR:", err);
    ws.close();
  }
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});