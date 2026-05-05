const pool = require('../db');

const findAll = async () => {
  const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
  return result.rows;
};

const findHotDeals = async () => {
  const result = await pool.query('SELECT * FROM products LIMIT 4');
  return result.rows;
};

module.exports = { findAll, findHotDeals };
