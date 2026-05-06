const express = require("express");
const router = express.Router();
const { pool } = require("../config");
const {
  hashPassword,
  verifyPassword,
  createSession,
  setSessionCookie,
  signToken,
  getAuthPayload,
  destroySession,
  clearSessionCookie
} = require("../utils");

router.post("/register", async (req, res) => {
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

router.post("/login", async (req, res) => {
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

router.get("/me", async (req, res) => {
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

router.get("/logout", (req, res) => {
  destroySession(req);
  clearSessionCookie(res);
  return res.status(200).json({ message: "Logged out" });
});

module.exports = router;
