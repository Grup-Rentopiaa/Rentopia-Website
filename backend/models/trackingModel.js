const pool = require("../config/db");

async function saveVisitor(data) {
  const query = `
    INSERT INTO visitors 
    (visitor_id, page, path, browser, language, screen_width, screen_height, visited_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
  `;

  const values = [
    data.visitorId,
    data.page,
    data.path,
    data.browser,
    data.language,
    data.screenWidth,
    data.screenHeight,
    data.visitedAt,
  ];

  await pool.query(query, values);
}

async function getVisitors() {
  const result = await pool.query("SELECT * FROM visitors ORDER BY id DESC");
  return result.rows;
}

module.exports = {
  saveVisitor,
  getVisitors,
};