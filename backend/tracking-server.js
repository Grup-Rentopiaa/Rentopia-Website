const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

const visitorLogs = [];

app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.post("/track-visitor", (req, res) => {
  const data = req.body;

  const log = {
    visitorId: data.visitorId,
    page: data.page,
    path: data.path,
    browser: data.browser,
    language: data.language,
    screenWidth: data.screenWidth,
    screenHeight: data.screenHeight,
    visitedAt: data.visitedAt,
    receivedAt: new Date().toISOString(),
    ip: req.ip
  };

  visitorLogs.push(log);

  console.log("Visitor tracked:", log);

  res.status(200).json({
    message: "Data tracking berhasil diterima server",
    data: log
  });
});

app.get("/visitor-logs", (req, res) => {
  res.json({
    total: visitorLogs.length,
    data: visitorLogs
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Tracking server aktif"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Tracking server running on http://0.0.0.0:${PORT}`);
});