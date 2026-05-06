const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "pemweb",
  password: "Renjun23032000.",
  port: 5432
});

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5502",
  "http://localhost:5500",
  "http://localhost:5502",
  "http://20.5.29.52:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

const secretKey = "secretkey";

module.exports = {
  pool,
  allowedOrigins,
  secretKey
};
