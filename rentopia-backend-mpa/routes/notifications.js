const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const notifResult = await pool.query(
      `SELECT n.id, n.keyword, n.is_read, n.created_at,
              i.title AS item_title, i.price_per_day, i.image_url
       FROM notifications n
       JOIN items i ON n.item_id = i.id
       ORDER BY n.created_at DESC
       LIMIT 20`
    );
    res.json(notifResult.rows);
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

router.patch('/:id/read', async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1',
      [req.params.id]
    );
    res.json({ message: 'Notifikasi ditandai sudah dibaca' });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;
