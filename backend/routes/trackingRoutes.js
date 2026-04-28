const express = require("express");
const router = express.Router();

const {
  trackVisitor,
  getAllVisitors,
} = require("../controllers/trackingController");

router.post("/track-visitor", trackVisitor);
router.get("/visitor-logs", getAllVisitors);

module.exports = router;