const jwt = require('jsonwebtoken');
const WebSocket = require('ws');

const wsClients = new Map();
const sseClients = new Map();
let latestMessage = "No new messages yet";

function getAuthPayload(req) {
    // Accept token from both Authorization header and ?token= query param
    // (EventSource cannot set custom headers, so query param is needed for SSE)
    const queryToken = req.query?.token;
    const authHeader = req.headers.authorization || "";
    const token = queryToken || (authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null);
    if (!token) throw new Error("Unauthorized");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { id: decoded.userId };
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
    getAuthPayload,
    sendSseToUser,
    sendWsToUser,
    generatePenawaranId,
    getLatestMessage: () => latestMessage,
    setLatestMessage: (msg) => { latestMessage = msg; }
};
