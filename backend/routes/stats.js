const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { visitorId } = req.query;

    if (!visitorId) return res.status(400).json({ message: 'Visitor ID required' });

    const productResult = await pool.query(
      'SELECT id, name, visitor_id FROM products WHERE id = $1',
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    if (productResult.rows[0].visitor_id !== visitorId) {
      return res.status(403).json({ message: 'Tidak punya akses ke statistik produk ini' });
    }

    const viewsResult = await pool.query(
      'SELECT COUNT(*) AS total_views FROM product_views WHERE product_id = $1',
      [productId]
    );

    const likesResult = await pool.query(
      'SELECT COUNT(*) AS total_likes FROM likes WHERE product_id = $1',
      [productId]
    );

    res.json({
      product_id: parseInt(productId),
      product_name: productResult.rows[0].name,
      total_views: parseInt(viewsResult.rows[0].total_views),
      total_likes: parseInt(likesResult.rows[0].total_likes),
    });
  } catch (error) {
    console.error('Error get stats:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;
