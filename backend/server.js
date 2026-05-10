const express = require("express");
require("dotenv").config();
const http = require("http");
const https = require("https");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const WebSocket = require("ws");
const selfsigned = require("selfsigned");

const { allowedOrigins } = require("./src/config");
const { wsClients, verifyToken } = require("./src/utils");


const chatRoutes = require("./src/routes/chat");
const penawaranRoutes = require("./src/routes/penawaran");

const app = express();

const pems = selfsigned.generate(
  [{ name: "commonName", value: "localhost" }],
  { days: 365 }
);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Origin tidak diizinkan oleh CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());


app.use("/", chatRoutes);
app.use("/", penawaranRoutes);

app.use((req, res) => {
  return res.status(404).json({ error: "Not Found" });
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(
  {
    key: pems.private,
    cert: pems.cert
  },
  app
);


if (require.main === module) {
  const wss = new WebSocket.Server({ port: process.env.WS_PORT || 3002 });

  wss.on("connection", (ws, req) => {
    try {
      const fullUrl = new URL(req.url, `ws://127.0.0.1:${process.env.WS_PORT || 3002}`);
      const token = fullUrl.searchParams.get("token");

      if (!token) {
        ws.close();
        return;
      }

      const payload = verifyToken(token);
      const myId = Number(payload.id);

      wsClients.set(myId, ws);
      console.log("WS connected user:", myId);

      ws.on("message", async (rawMessage) => {
        try {
          const data = JSON.parse(rawMessage.toString());
          if (data.type === "init") return;

          const from = Number(data.from);
          const to = Number(data.to);
          const text = String(data.text || "").trim();

          if (!from || !to || !text || from !== myId) return;

          const payloadMessage = {
            from,
            to,
            text,
            time: new Date().toISOString()
          };

          const clientWs = wsClients.get(to);
          if (clientWs && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify(payloadMessage));
          }
        } catch (err) {
          console.error("WS MESSAGE ERROR:", err);
        }
      });

      ws.on("close", () => {
        wsClients.delete(myId);
      });

      ws.on("error", (err) => {
        console.error("WS ERROR:", err);
      });
    } catch (err) {
      console.error("WS CONNECTION ERROR:", err);
      ws.close();
    }
  });

  httpServer.listen(process.env.HTTP_PORT || 3001, () => {
    console.log(`Server is running on http://localhost:${process.env.HTTP_PORT || 3001}`);
  });

  httpsServer.listen(process.env.HTTPS_PORT || 3443, () => {
    console.log(`Server is running on https://localhost:${process.env.HTTPS_PORT || 3443}`);
  });
}

module.exports = app;

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});