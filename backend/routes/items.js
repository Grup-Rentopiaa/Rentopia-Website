const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const { search, category, sort, min_price, max_price, lat, lng } = req.query;

  let query = `
    SELECT i.id, i.title, i.description, i.price_per_day, i.location,
           i.latitude, i.longitude, i.created_at,
           c.name AS category_name, u.name AS owner_name
    FROM items i
    LEFT JOIN categories c ON i.category_id = c.id
    LEFT JOIN users u ON i.owner_id = u.id
    WHERE 1=1
  `;
  const params = [];
  let paramIndex = 1;

  if (search && search.trim() !== '') {
    query += ` AND (LOWER(i.title) LIKE LOWER($${paramIndex}) OR LOWER(i.description) LIKE LOWER($${paramIndex}))`;
    params.push(`%${search.trim()}%`);
    paramIndex++;
  }

  if (category) {
    query += ` AND i.category_id = $${paramIndex}`;
    params.push(category);
    paramIndex++;
  }

  if (min_price) {
    query += ` AND i.price_per_day >= $${paramIndex}`;
    params.push(min_price);
    paramIndex++;
  }

  if (max_price) {
    query += ` AND i.price_per_day <= $${paramIndex}`;
    params.push(max_price);
    paramIndex++;
  }


  if (sort === 'price_asc') {
    query += ' ORDER BY i.price_per_day ASC';
  } else if (sort === 'price_desc') {
    query += ' ORDER BY i.price_per_day DESC';
  } else if (sort === 'nearest' && lat && lng) {
    query += ` ORDER BY (
      (i.latitude - $${paramIndex})^2 + (i.longitude - $${paramIndex + 1})^2
    ) ASC`;
    params.push(parseFloat(lat), parseFloat(lng));
    paramIndex += 2;
  } else {
    query += ' ORDER BY i.created_at DESC';
  }

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.*, c.name AS category_name, u.name AS owner_name
       FROM items i
       LEFT JOIN categories c ON i.category_id = c.id
       LEFT JOIN users u ON i.owner_id = u.id
       WHERE i.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item tidak ditemukan' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
