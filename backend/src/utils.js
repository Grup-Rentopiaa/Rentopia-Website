const { createHmac, randomBytes, pbkdf2Sync } = require("crypto");
const WebSocket = require("ws");
const { secretKey } = require("./config");

const wsClients = new Map();
const sseClients = new Map();
const sessions = new Map();
let latestMessage = "No new messages yet";

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return { hash, salt };
}

function verifyPassword(storedHash, salt, password) {
  const hash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return storedHash === hash;
}

function signToken(payload) {
  const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
  const body = JSON.stringify(payload);

  const encodedHeader = Buffer.from(header).toString("base64url");
  const encodedBody = Buffer.from(body).toString("base64url");

  const signature = createHmac("sha256", secretKey)
    .update(`${encodedHeader}.${encodedBody}`)
    .digest("base64url");

  return `${encodedHeader}.${encodedBody}.${signature}`;
}

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

function generateSessionId() {
  return randomBytes(32).toString("hex");
}

function createSession(user) {
  const sessionId = generateSessionId();
  sessions.set(sessionId, {
    userId: Number(user.id),
    email: user.email,
    createdAt: Date.now()
  });
  return sessionId;
}

function getSession(req) {
  const sessionId = req.cookies?.sessionId;
  if (!sessionId) return null;
  return sessions.get(sessionId) || null;
}

function destroySession(req) {
  const sessionId = req.cookies?.sessionId;
  if (sessionId) sessions.delete(sessionId);
}

function setSessionCookie(res, sessionId) {
  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    path: "/",
    maxAge: 86400 * 1000,
    sameSite: "lax"
  });
}

function clearSessionCookie(res) {
  res.clearCookie("sessionId", {
    httpOnly: true,
    path: "/",
    sameSite: "lax"
  });
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
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  createSession,
  getSession,
  destroySession,
  setSessionCookie,
  clearSessionCookie,
  getAuthPayload,
  sendSseToUser,
  sendWsToUser,
  generatePenawaranId,
  getLatestMessage: () => latestMessage,
  setLatestMessage: (msg) => { latestMessage = msg; }
};
