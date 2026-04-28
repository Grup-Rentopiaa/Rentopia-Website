const {
  saveVisitor,
  getVisitors,
} = require("../models/trackingModel");

async function trackVisitor(req, res) {
  try {
    const data = req.body;

    await saveVisitor(data);

    res.json({ message: "Tracking berhasil disimpan" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menyimpan data" });
  }
}

async function getAllVisitors(req, res) {
  try {
    const data = await getVisitors();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal ambil data" });
  }
}

module.exports = {
  trackVisitor,
  getAllVisitors,
};