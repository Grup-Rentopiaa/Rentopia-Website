const { prisma } = require('../lib/prisma')
const crypto = require('crypto')
const { createNotification } = require('../utils/notificationUtils')

// ── Encryption ──────────────────────────────────────────────────────────────
const ENCRYPTION_KEY = (process.env.ENCRYPTION_KEY || 'rentopia_aes_key_32bytes_secure!!').slice(0, 32)
const IV_LENGTH = 16

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + ':' + encrypted
}

function decrypt(text) {
  try {
    const [ivHex, encryptedHex] = text.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return JSON.parse(decrypted)
  } catch { return null }
}

// ── Conversation key ─────────────────────────────────────────────────────────
function makeConversationKey(buyerId, sellerId, itemId) {
  const lo = Math.min(buyerId, sellerId)
  const hi = Math.max(buyerId, sellerId)
  return `${lo}-${hi}-${itemId}`
}

// ── Insert system message into the message table ─────────────────────────────
// sender_id=null, is_system=true, receiver_id=buyerId
// Wrapped in try/catch so that if the DB migration hasn't run yet it won't
// crash the state transition endpoints.
async function insertSystemMessage(buyerId, sellerId, text) {
  try {
    await prisma.message.create({
      data: {
        sender_id:   null,
        receiver_id: buyerId,
        is_system:   true,
        isi_pesan:   text,
      },
    })
  } catch (err) {
    // Log but don't rethrow — state transition must succeed even if message fails
    console.error('[SystemMsg] Failed to insert system message:', err.message)
  }
}

// ── GET status for a conversation (used by ChatPage on load) ─────────────────
const getChatStatus = async (req, res) => {
  try {
    const { buyerId, sellerId, itemId } = req.query
    if (!buyerId || !sellerId || !itemId) return res.json(null)
    const key = makeConversationKey(parseInt(buyerId), parseInt(sellerId), parseInt(itemId))
    const agreement = await prisma.rentalAgreement.findUnique({ where: { conversationKey: key } })
    res.json(agreement || null)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// ── GET agreement (alias) ────────────────────────────────────────────────────
const getAgreement = getChatStatus

// ── State 0→1: Seller approves ────────────────────────────────────────────────
const approveRental = async (req, res) => {
  try {
    const { buyerId, sellerId, itemId } = req.body
    if (!buyerId || !sellerId || !itemId) return res.status(400).json({ message: 'buyerId, sellerId, itemId required' })
    const key = makeConversationKey(parseInt(buyerId), parseInt(sellerId), parseInt(itemId))

    const agreement = await prisma.rentalAgreement.upsert({
      where:  { conversationKey: key },
      create: { conversationKey: key, buyerId: +buyerId, sellerId: +sellerId, itemId: +itemId, status: 'approved' },
      update: { status: 'approved' },
    })

    // System message visible to both parties
    await insertSystemMessage(+buyerId, +sellerId,
      '✅ Penjual menyetujui penyewaan. Menunggu data jaminan dari penyewa.')

    const seller = await prisma.users.findUnique({ where: { id: +sellerId }, select: { username: true } })
    await createNotification(+buyerId, 'rental_request',
      `${seller?.username || 'Penjual'} menyetujui penyewaanmu. Kirim data jaminan sekarang.`, agreement.id)

    res.json({ message: 'Penyewaan disetujui', agreement })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// ── State 1→2: Buyer submits guarantee ────────────────────────────────────────
const submitGuarantee = async (req, res) => {
  try {
    const { buyerId, sellerId, itemId, fullName, phone, address, ktpB64, durationDays } = req.body
    if (!buyerId || !sellerId || !itemId || !fullName || !phone || !address || !durationDays)
      return res.status(400).json({ message: 'Semua field wajib diisi' })

    const key = makeConversationKey(+buyerId, +sellerId, +itemId)
    const rentalCode = `RNT-${Date.now()}`
    const encryptedData = encrypt(JSON.stringify({ fullName, phone, address, ktpB64: ktpB64 || null, durationDays }))

    const agreement = await prisma.rentalAgreement.upsert({
      where:  { conversationKey: key },
      create: { conversationKey: key, buyerId: +buyerId, sellerId: +sellerId, itemId: +itemId,
                status: 'guarantee_submitted', rentalCode, durationDays: +durationDays, guaranteeData: encryptedData },
      update: { status: 'guarantee_submitted', rentalCode, durationDays: +durationDays, guaranteeData: encryptedData },
    })

    // System message with rental code
    await insertSystemMessage(+buyerId, +sellerId,
      `📋 Data jaminan dikirim. Kode Sewa: ${rentalCode} · Durasi: ${durationDays} hari · Silakan lakukan COD.`)

    const buyer = await prisma.users.findUnique({ where: { id: +buyerId }, select: { username: true } })
    await createNotification(+sellerId, 'guarantee_submitted',
      `${buyer?.username || 'Penyewa'} mengirim data jaminan. Kode: ${rentalCode}. Durasi: ${durationDays} hari. Lakukan COD sekarang.`,
      agreement.id)

    res.json({ message: 'Data jaminan berhasil dikirim', rentalCode, agreementId: agreement.id })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// ── State 2→3: Seller confirms handover ──────────────────────────────────────
const confirmHandover = async (req, res) => {
  try {
    const rentalId = parseInt(req.params.rentalId)
    const agreement = await prisma.rentalAgreement.findUnique({ where: { id: rentalId } })
    if (!agreement) return res.status(404).json({ message: 'Tidak ditemukan' })

    const updated = await prisma.rentalAgreement.update({
      where: { id: rentalId }, data: { status: 'handover_confirmed' },
    })

    await insertSystemMessage(agreement.buyerId, agreement.sellerId,
      '📦 Penjual mengonfirmasi barang siap diserahkan. Konfirmasi saat kamu menerima barang.')

    const seller = await prisma.users.findUnique({ where: { id: agreement.sellerId }, select: { username: true } })
    await createNotification(agreement.buyerId, 'item_received',
      `${seller?.username || 'Penjual'} mengonfirmasi barang siap diserahkan. Konfirmasi saat kamu menerimanya.`,
      rentalId)

    res.json({ message: 'Serah terima dikonfirmasi penjual', agreement: updated })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// ── State 3→4: Buyer confirms received ────────────────────────────────────────
const confirmReceived = async (req, res) => {
  try {
    const rentalId = parseInt(req.params.rentalId)
    const agreement = await prisma.rentalAgreement.findUnique({ where: { id: rentalId } })
    if (!agreement) return res.status(404).json({ message: 'Tidak ditemukan' })

    const startDate = new Date()
    const endDate   = new Date(startDate)
    endDate.setDate(endDate.getDate() + (agreement.durationDays || 1))

    const updated = await prisma.rentalAgreement.update({
      where: { id: rentalId }, data: { status: 'received', startDate, endDate },
    })

    const startStr = startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })
    const endStr   = endDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    const days = agreement.durationDays || 1
    await insertSystemMessage(agreement.buyerId, agreement.sellerId,
      `🟢 Masa sewa dimulai ${startStr} → ${endStr} (${days} hari)`)

    const buyer = await prisma.users.findUnique({ where: { id: agreement.buyerId }, select: { username: true } })
    await createNotification(agreement.sellerId, 'item_received',
      `${buyer?.username || 'Penyewa'} mengonfirmasi menerima barang. Masa sewa dimulai.`, rentalId)

    // Schedule return reminder notification (1 day before)
    const reminderDate = new Date(endDate)
    reminderDate.setDate(reminderDate.getDate() - 1)
    const msUntilReminder = reminderDate.getTime() - Date.now()
    if (msUntilReminder > 0) {
      setTimeout(async () => {
        await createNotification(agreement.buyerId, 'return_reminder',
          `Pengingat: barang harus dikembalikan besok (${endDate.toLocaleDateString('id-ID')}).`, rentalId)
      }, msUntilReminder)
    }

    res.json({ message: 'Konfirmasi penerimaan berhasil', agreement: updated })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// ── State 4→5: Seller confirms returned ───────────────────────────────────────
const confirmReturned = async (req, res) => {
  try {
    const rentalId = parseInt(req.params.rentalId)
    const agreement = await prisma.rentalAgreement.findUnique({ where: { id: rentalId } })
    if (!agreement) return res.status(404).json({ message: 'Tidak ditemukan' })

    const updated = await prisma.rentalAgreement.update({
      where: { id: rentalId }, data: { status: 'returned' },
    })

    await insertSystemMessage(agreement.buyerId, agreement.sellerId,
      '✅ Barang telah dikembalikan. Terima kasih telah menggunakan Rentopia!')

    await createNotification(agreement.buyerId, 'item_returned',
      `Masa sewa selesai. Terima kasih telah menggunakan Rentopia! Tulis ulasanmu sekarang.`, rentalId,
      agreement.itemId)

    res.json({ message: 'Pengembalian dikonfirmasi', agreement: updated })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// ── Review submission ─────────────────────────────────────────────────────────
const submitReview = async (req, res) => {
  try {
    const rentalId = parseInt(req.params.rentalId)
    const { rating, comment, photoB64 } = req.body
    const agreement = await prisma.rentalAgreement.findUnique({ where: { id: rentalId } })
    if (!agreement || !agreement.itemId) return res.status(404).json({ message: 'Tidak ditemukan' })

    const review = await prisma.review.create({
      data: { userId: agreement.buyerId, itemId: agreement.itemId,
              rating: parseInt(rating) || 5, comment: comment || '', photoB64: photoB64 || null },
    })

    await prisma.rentalAgreement.update({ where: { id: rentalId }, data: { status: 'reviewed' } })

    const buyer = await prisma.users.findUnique({ where: { id: agreement.buyerId }, select: { username: true } })
    await createNotification(agreement.sellerId, 'review_submitted',
      `${buyer?.username || 'Penyewa'} memberikan ulasan bintang ${rating} untuk produkmu.`,
      agreement.itemId, agreement.itemId)

    // Update seller's average rating
    const item = await prisma.item.findUnique({ where: { id: agreement.itemId } })
    if (item?.owner_id) {
      const ownerReviews = await prisma.review.findMany({ where: { item: { owner_id: item.owner_id } } })
      const avg = ownerReviews.reduce((s, r) => s + r.rating, 0) / ownerReviews.length
      await prisma.users.update({ where: { id: item.owner_id }, data: { rating: avg } })
    }

    res.json({ message: 'Ulasan berhasil dikirim', review })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// ── Review eligibility check ──────────────────────────────────────────────────
const checkReviewEligibility = async (req, res) => {
  try {
    const userId    = parseInt(req.params.userId)
    const productId = parseInt(req.params.productId)

    const agreement = await prisma.rentalAgreement.findFirst({
      where: {
        buyerId: userId,
        itemId:  productId,
        status:  { in: ['returned', 'reviewed'] },
      },
    })

    if (!agreement) return res.json({ canReview: false })
    const canReview = agreement.status === 'returned'
    res.json({ canReview, agreementId: agreement.id })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// ── Active rentals for user ───────────────────────────────────────────────────
const getActiveRentals = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    const agreements = await prisma.rentalAgreement.findMany({
      where: { buyerId: userId, status: { in: ['guarantee_submitted', 'handover_confirmed', 'received'] } },
      orderBy: { createdAt: 'desc' },
    })
    const result = await Promise.all(agreements.map(async a => {
      const item   = a.itemId ? await prisma.item.findUnique({ where: { id: a.itemId }, select: { title: true, image: true } }) : null
      const seller = await prisma.users.findUnique({ where: { id: a.sellerId }, select: { username: true } })
      const now = new Date(); const daysLeft = a.endDate ? Math.ceil((a.endDate - now) / 86400000) : null
      return { ...a, guaranteeData: undefined, item, seller, daysLeft }
    }))
    res.json(result)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// ── Admin: list guarantees ────────────────────────────────────────────────────
const listGuarantees = async (req, res) => {
  try {
    const agreements = await prisma.rentalAgreement.findMany({
      where: { status: { not: 'pending' } }, orderBy: { createdAt: 'desc' },
      include: { buyer: { select: { username: true, email: true } }, item: { select: { title: true } } },
    })
    res.json(agreements.map(({ guaranteeData, ...a }) => a))
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// ── Admin: guarantee detail ───────────────────────────────────────────────────
const getGuaranteeDetail = async (req, res) => {
  try {
    const rentalId = parseInt(req.params.rentalId)
    const agreement = await prisma.rentalAgreement.findUnique({
      where: { id: rentalId },
      include: { buyer: { select: { username: true, email: true } }, seller: { select: { username: true } }, item: { select: { title: true, image: true } } },
    })
    if (!agreement) return res.status(404).json({ message: 'Tidak ditemukan' })
    const decryptedGuarantee = agreement.guaranteeData ? decrypt(agreement.guaranteeData) : null
    res.json({ ...agreement, guaranteeData: decryptedGuarantee })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

module.exports = {
  getChatStatus, getAgreement,
  approveRental, submitGuarantee,
  confirmHandover, confirmReceived, confirmReturned,
  submitReview, checkReviewEligibility,
  getActiveRentals, listGuarantees, getGuaranteeDetail,
}
