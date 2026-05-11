const prisma = require('../lib/prisma');
const { getAuthPayload, generatePenawaranId, sendWsToUser, sendSseToUser } = require('../utils/chatUtils');

const createPenawaran = async (req, res) => {
    try {
        const auth = getAuthPayload(req);
        const { produk_id, harga, target_id } = req.body;

        let targetId = Number(target_id);
        let itemId = produk_id ? Number(produk_id) : null;

        if (itemId) {
            const item = await prisma.item.findUnique({ where: { id: itemId } });
            if (!item) return res.status(404).json({ error: "Produk tidak ditemukan" });
            if (!targetId) targetId = item.owner_id;
        }

        if (!targetId || targetId === auth.id) {
            return res.status(400).json({ error: "Target tidak valid atau tidak bisa mengirim ke diri sendiri" });
        }

        const penawaranId = generatePenawaranId();
        const isiPesan = `Saya menawar dengan harga Rp ${Number(harga).toLocaleString("id-ID")}`;

        const [penawaran, message] = await prisma.$transaction([
            prisma.penawaran.create({
                data: {
                    penawaran_id: penawaranId,
                    produk_id: itemId,
                    user_id: auth.id,
                    harga: Number(harga)
                }
            }),
            prisma.message.create({
                data: {
                    sender_id: auth.id,
                    receiver_id: targetId,
                    isi_pesan: isiPesan
                }
            })
        ]);

        const payload = { from: auth.id, to: targetId, text: isiPesan, time: message.waktu };
        sendWsToUser(targetId, payload);
        sendSseToUser(targetId, payload);

        res.status(200).json({ 
            message: "Penawaran berhasil dikirim", 
            penawaran, 
            chat: message, 
            target_id: targetId 
        });
    } catch (err) {
        console.error("PENAWAN ERROR:", err);
        res.status(401).json({ error: "Unauthorized" });
    }
};

module.exports = { createPenawaran };
