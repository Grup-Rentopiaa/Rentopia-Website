const express = require("express");
const router = express.Router();
const { pool } = require("../config");
const {
  getAuthPayload,
  sendWsToUser,
  sendSseToUser,
  setLatestMessage,
  getLatestMessage,
  sseClients
} = require("../utils");

router.get("/users", async (req, res) => {
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

router.get("/messages/:id", async (req, res) => {
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

router.post("/messages/:id", async (req, res) => {
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
    setLatestMessage(saved.isi_pesan);

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

router.get("/poll", (req, res) => {
  try {
    return res.status(200).json({ message: getLatestMessage() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/sse", (req, res) => {
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

module.exports = router;
