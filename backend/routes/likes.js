const express = require('express');
const pool = require('../db');

const router = express.Router();

router.post('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { visitorId } = req.body;

    if (!visitorId) return res.status(400).json({ message: 'Visitor ID required' });

    const existing = await pool.query(
      'SELECT id FROM likes WHERE visitor_id = $1 AND product_id = $2',
      [visitorId, productId]
    );

    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM likes WHERE visitor_id = $1 AND product_id = $2', [visitorId, productId]);
      res.json({ liked: false, message: 'Unlike berhasil' });
    } else {
      await pool.query('INSERT INTO likes (visitor_id, product_id) VALUES ($1, $2)', [visitorId, productId]);
      res.json({ liked: true, message: 'Like berhasil' });
    }
  } catch (error) {
    console.error('Error toggle like:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { visitorId } = req.query;
    if (!visitorId) return res.status(400).json({ message: 'Visitor ID required' });

    const result = await pool.query(
      `SELECT 
        p.id, p.name, p.category, p.price, p.location, p.description, p.created_at,
        p.visitor_id,
        (SELECT COUNT(*) FROM likes l2 WHERE l2.product_id = p.id) AS like_count,
        (SELECT COUNT(*) FROM product_views pv WHERE pv.product_id = p.id) AS view_count,
        (SELECT filename FROM product_photos pp WHERE pp.product_id = p.id LIMIT 1) AS first_photo
      FROM likes l
      JOIN products p ON l.product_id = p.id
      WHERE l.visitor_id = $1
      ORDER BY l.created_at DESC`,
      [visitorId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error get likes:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

router.get('/check/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { visitorId } = req.query;

    if (!visitorId) return res.json({ liked: false });

    const result = await pool.query(
      'SELECT id FROM likes WHERE visitor_id = $1 AND product_id = $2',
      [visitorId, productId]
    );
    res.json({ liked: result.rows.length > 0 });
  } catch (error) {
    console.error('Error check like:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;
