const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "pemweb",
  password: process.env.DB_PASSWORD || "Renjun23032000.",
  port: parseInt(process.env.DB_PORT || "5432")
});

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",");

const secretKey = process.env.SECRET_KEY || "secretkey";

module.exports = {
  pool,
  allowedOrigins,
  secretKey
};

