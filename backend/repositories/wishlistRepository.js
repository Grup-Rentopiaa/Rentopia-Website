const pool = require('../db');

const add = async (user_id, product_id) => {
  await pool.query(
    'INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [user_id, product_id]
  );
};

const remove = async (user_id, product_id) => {
  await pool.query(
    'DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2',
    [user_id, product_id]
  );
};

module.exports = { add, remove };
