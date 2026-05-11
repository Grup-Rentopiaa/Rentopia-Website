const prisma = require('../lib/prisma');
const { getAuthPayload, sseClients, setLatestMessage, sendWsToUser, sendSseToUser, getLatestMessage } = require('../utils/chatUtils');

const getUsers = async (req, res) => {
    try {
        const auth = getAuthPayload(req);
        const users = await prisma.users.findMany({
            where: { id: { not: auth.id } },
            orderBy: { id: 'asc' },
            include: {
                sentMessages: {
                    where: { receiver_id: auth.id },
                    orderBy: { waktu: 'desc' },
                    take: 1
                },
                receivedMessages: {
                    where: { sender_id: auth.id },
                    orderBy: { waktu: 'desc' },
                    take: 1
                }
            }
        });

        const data = users.map(u => {
            const lastSent = u.sentMessages[0];
            const lastReceived = u.receivedMessages[0];
            let lastMsg = null;
            if (lastSent && lastReceived) {
                lastMsg = lastSent.waktu > lastReceived.waktu ? lastSent : lastReceived;
            } else {
                lastMsg = lastSent || lastReceived;
            }

            return {
                id: u.id,
                name: u.username,
                email: u.email,
                last_message: lastMsg ? lastMsg.isi_pesan : null,
                last_time: lastMsg ? lastMsg.waktu : null
            };
        });

        res.status(200).json({ data });
    } catch (err) {
        res.status(401).json({ error: "Unauthorized" });
    }
};

const getMessages = async (req, res) => {
    try {
        const auth = getAuthPayload(req);
        const targetId = Number(req.params.id);
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { sender_id: auth.id, receiver_id: targetId },
                    { sender_id: targetId, receiver_id: auth.id }
                ]
            },
            orderBy: { waktu: 'asc' }
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(401).json({ error: "Unauthorized" });
    }
};

const sendMessage = async (req, res) => {
    try {
        const auth = getAuthPayload(req);
        const targetId = Number(req.params.id);
        const { text } = req.body;

        const saved = await prisma.message.create({
            data: {
                sender_id: auth.id,
                receiver_id: targetId,
                isi_pesan: text.trim()
            }
        });

        setLatestMessage(saved.isi_pesan);
        const payload = { from: auth.id, to: targetId, text: saved.isi_pesan, time: saved.waktu };
        sendWsToUser(targetId, payload);
        sendSseToUser(targetId, payload);

        res.status(200).json({ message: "Pesan berhasil dikirim", data: saved });
    } catch (err) {
        res.status(401).json({ error: "Unauthorized" });
    }
};

const pollMessage = (req, res) => {
    res.status(200).json({ message: getLatestMessage() });
};

const sseConnect = (req, res) => {
    try {
        const auth = getAuthPayload(req);
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache, no-transform");
        res.setHeader("Connection", "keep-alive");
        if (res.flushHeaders) res.flushHeaders();
        res.write(`data: ${JSON.stringify({ message: "SSE connected" })}\n\n`);
        sseClients.set(auth.id, res);

        const keepAlive = setInterval(() => res.write(`: ping\n\n`), 15000);
        req.on("close", () => {
            clearInterval(keepAlive);
            sseClients.delete(auth.id);
        });
    } catch (err) {
        res.status(401).json({ error: "Unauthorized" });
    }
};

module.exports = { getUsers, getMessages, sendMessage, pollMessage, sseConnect };
