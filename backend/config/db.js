const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "pemweb",
  password: "Renjun23032000.",
  port: 5432,
});

module.exports = pool;