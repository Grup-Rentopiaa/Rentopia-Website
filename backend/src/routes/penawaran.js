const express = require("express");
const router = express.Router();
const { pool } = require("../config");
const {
  getAuthPayload,
  generatePenawaranId,
  sendWsToUser,
  sendSseToUser
} = require("../utils");

router.post("/penawaran", async (req, res) => {
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

module.exports = router;
