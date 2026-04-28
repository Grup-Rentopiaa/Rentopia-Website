const express = require("express");
const cors = require("cors");

const trackingRoutes = require("./routes/trackingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", trackingRoutes);

module.exports = app;