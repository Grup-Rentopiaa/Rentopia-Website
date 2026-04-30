const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM saved_keywords ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

router.post('/', async (req, res) => {
  const { keyword } = req.body;
  if (!keyword || keyword.trim() === '') {
    return res.status(400).json({ message: 'Keyword tidak boleh kosong' });
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM saved_keywords WHERE LOWER(keyword) = LOWER($1)',
      [keyword.trim()]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Keyword sudah tersimpan' });
    }

    const result = await pool.query(
      'INSERT INTO saved_keywords (keyword) VALUES ($1) RETURNING *',
      [keyword.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM saved_keywords WHERE id = $1',
      [req.params.id]
    );
    res.json({ message: 'Keyword dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;
