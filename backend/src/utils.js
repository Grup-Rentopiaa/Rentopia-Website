const { createHmac, randomBytes, pbkdf2Sync } = require("crypto");
const WebSocket = require("ws");
const { secretKey } = require("./config");

const wsClients = new Map();
const sseClients = new Map();
const sessions = new Map();
let latestMessage = "No new messages yet";





function verifyToken(token) {
  const [encodedHeader, encodedBody, signature] = token.split(".");

  const validSignature = createHmac("sha256", secretKey)
    .update(`${encodedHeader}.${encodedBody}`)
    .digest("base64url");

  if (signature !== validSignature) {
    throw new Error("Invalid token");
  }

  return JSON.parse(Buffer.from(encodedBody, "base64url").toString());
}







function getTokenFromHeaders(req) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

function getAuthPayload(req) {
  const session = getSession(req);
  if (session) {
    return {
      id: Number(session.userId),
      email: session.email,
      authType: "session"
    };
  }

  const token = getTokenFromHeaders(req);
  if (token) {
    const payload = verifyToken(token);
    return {
      id: Number(payload.id),
      email: payload.email,
      authType: "token"
    };
  }

  throw new Error("Unauthorized");
}

function sendSseToUser(userId, payload) {
  const client = sseClients.get(Number(userId));
  if (!client) return;
  client.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function sendWsToUser(userId, payload) {
  const client = wsClients.get(Number(userId));
  if (!client) return;
  if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(payload));
  }
}

function generatePenawaranId() {
  return `PNW-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

module.exports = {
  wsClients,
  sseClients,
  sessions,
  verifyToken,
  getAuthPayload,
  sendSseToUser,
  sendWsToUser,
  generatePenawaranId,
  getLatestMessage: () => latestMessage,
  setLatestMessage: (msg) => { latestMessage = msg; }
};
