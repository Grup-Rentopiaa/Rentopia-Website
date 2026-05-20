const { prisma } = require('../lib/prisma')
const crypto = require('crypto')
const { createNotification } = require('../utils/notificationUtils')
const { sendWsToUser, sendSseToUser } = require('../utils/chatUtils')
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

function makeConversationKey(buyerId, sellerId, itemId) {
  const lo = Math.min(buyerId, sellerId)
  const hi = Math.max(buyerId, sellerId)
  return `${lo}-${hi}-${itemId}`
}


async function insertSystemMessage(buyerId, sellerId, text) {
  try {
    
    const msgBuyer = await prisma.message.create({
      data: {
        sender_id:   null,
        receiver_id: buyerId,
        is_system:   true,
        isi_pesan:   text,
      },
    })
    
    const msgSeller = await prisma.message.create({
      data: {
        sender_id:   null,
        receiver_id: sellerId,
        is_system:   true,
        isi_pesan:   text,
      },
    })

    
    const ssePayload = { from: null, to: buyerId, text, time: msgBuyer.waktu, is_system: true }
    sendSseToUser(buyerId,  { ...ssePayload, to: buyerId })
    sendSseToUser(sellerId, { ...ssePayload, to: sellerId })
    sendWsToUser(buyerId,   { ...ssePayload, to: buyerId })
    sendWsToUser(sellerId,  { ...ssePayload, to: sellerId })
  } catch (err) {
    console.error('[SystemMsg] Failed to insert system message:', err.message)
  }
}


const getChatStatus = async (req, res) => {
  try {
    const { buyerId, sellerId, itemId } = req.query
    if (!buyerId || !sellerId || !itemId) return res.json(null)
    const key = makeConversationKey(parseInt(buyerId), parseInt(sellerId), parseInt(itemId))
    const agreement = await prisma.rentalAgreement.findUnique({ where: { conversationKey: key } })
    res.json(agreement || null)
  } catch (err) { res.status(500).json({ message: err.message }) }
}


const getAgreement = getChatStatus


const initiateRental = async (req, res) => {
  try {
    const { buyerId, sellerId, itemId } = req.body
    if (!buyerId || !sellerId || !itemId)
      return res.status(400).json({ message: 'buyerId, sellerId, itemId required' })

    const key = makeConversationKey(+buyerId, +sellerId, +itemId)

    
    let agreement = await prisma.rentalAgreement.findUnique({ where: { conversationKey: key } })
    if (!agreement) {
      agreement = await prisma.rentalAgreement.create({
        data: { conversationKey: key, buyerId: +buyerId, sellerId: +sellerId, itemId: +itemId, status: 'pending' },
      })

      
      const item  = await prisma.item.findUnique({ where: { id: +itemId }, select: { title: true } })
      const buyer = await prisma.users.findUnique({ where: { id: +buyerId }, select: { username: true } })

      const notifMsg = `🔔 ${buyer?.username || 'Seseorang'} ingin menyewa "${item?.title || 'produkmu'}". Buka chat untuk menyetujui.`

      
      sendWsToUser(+sellerId, { type: 'rental_request', message: notifMsg, buyerId: +buyerId, itemId: +itemId })
      sendSseToUser(+sellerId, { type: 'rental_request', message: notifMsg, buyerId: +buyerId, itemId: +itemId })

      
      await createNotification(+sellerId, 'rental_request', notifMsg, agreement.id)
    }

    res.json({ message: 'ok', agreement })
  } catch (err) { res.status(500).json({ message: err.message }) }
}


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

    
    await insertSystemMessage(+buyerId, +sellerId,
      '✅ Penjual menyetujui penyewaan. Menunggu data jaminan dari penyewa.')

    const seller = await prisma.users.findUnique({ where: { id: +sellerId }, select: { username: true } })
    await createNotification(+buyerId, 'rental_request',
      `${seller?.username || 'Penjual'} menyetujui penyewaanmu. Kirim data jaminan sekarang.`, agreement.id)

    
    sendWsToUser(+buyerId, { type: 'agreement_update', status: 'approved', agreementId: agreement.id })
    sendSseToUser(+buyerId, { type: 'agreement_update', status: 'approved', agreementId: agreement.id })

    res.json({ message: 'Penyewaan disetujui', agreement })
  } catch (err) { res.status(500).json({ message: err.message }) }
}


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

    
    await insertSystemMessage(+buyerId, +sellerId,
      `📋 Data jaminan dikirim. Kode Sewa: ${rentalCode} · Durasi: ${durationDays} hari · Silakan lakukan COD.`)

    const buyer = await prisma.users.findUnique({ where: { id: +buyerId }, select: { username: true } })
    await createNotification(+sellerId, 'guarantee_submitted',
      `${buyer?.username || 'Penyewa'} mengirim data jaminan. Kode: ${rentalCode}. Durasi: ${durationDays} hari. Lakukan COD sekarang.`,
      agreement.id)

    
    sendWsToUser(+sellerId, { type: 'agreement_update', status: 'guarantee_submitted', agreementId: agreement.id, rentalCode, durationDays: +durationDays })
    sendSseToUser(+sellerId, { type: 'agreement_update', status: 'guarantee_submitted', agreementId: agreement.id, rentalCode, durationDays: +durationDays })

    res.json({ message: 'Data jaminan berhasil dikirim', rentalCode, agreementId: agreement.id })
  } catch (err) { res.status(500).json({ message: err.message }) }
}


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

    
    sendWsToUser(agreement.buyerId, { type: 'agreement_update', status: 'handover_confirmed', agreementId: rentalId })
    sendSseToUser(agreement.buyerId, { type: 'agreement_update', status: 'handover_confirmed', agreementId: rentalId })

    res.json({ message: 'Serah terima dikonfirmasi penjual', agreement: updated })
  } catch (err) { res.status(500).json({ message: err.message }) }
}


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

    
    if (agreement.itemId) {
      await prisma.item.update({
        where: { id: agreement.itemId },
        data:  { status: 'rented' },
      }).catch(err => console.error('[confirmReceived] Failed to update item status:', err.message))
    }

    const startStr = startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })
    const endStr   = endDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    const days = agreement.durationDays || 1
    await insertSystemMessage(agreement.buyerId, agreement.sellerId,
      `🟢 Penyewa mengonfirmasi barang diterima. Masa sewa: ${startStr} → ${endStr} (${days} hari).`)

    const buyer = await prisma.users.findUnique({ where: { id: agreement.buyerId }, select: { username: true } })
    await createNotification(agreement.sellerId, 'item_received',
      `${buyer?.username || 'Penyewa'} mengonfirmasi menerima barang. Masa sewa dimulai.`, rentalId)

    
    sendWsToUser(agreement.sellerId, { type: 'agreement_update', status: 'received', agreementId: rentalId })
    sendSseToUser(agreement.sellerId, { type: 'agreement_update', status: 'received', agreementId: rentalId })

    
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


const confirmReturned = async (req, res) => {
  try {
    const rentalId = parseInt(req.params.rentalId)
    const agreement = await prisma.rentalAgreement.findUnique({ where: { id: rentalId } })
    if (!agreement) return res.status(404).json({ message: 'Tidak ditemukan' })

    const updated = await prisma.rentalAgreement.update({
      where: { id: rentalId }, data: { status: 'returned' },
    })

    
    if (agreement.itemId) {
      await prisma.item.update({
        where: { id: agreement.itemId },
        data:  { status: 'available' },
      }).catch(err => console.error('[confirmReturned] Failed to update item status:', err.message))
    }

    await insertSystemMessage(agreement.buyerId, agreement.sellerId,
      '✅ Barang telah dikembalikan. Terima kasih telah menggunakan Rentopia!')

    await createNotification(agreement.buyerId, 'item_returned',
      `Masa sewa selesai. Terima kasih telah menggunakan Rentopia! Tulis ulasanmu sekarang.`, rentalId,
      agreement.itemId)

    
    sendWsToUser(agreement.buyerId, { type: 'agreement_update', status: 'returned', agreementId: rentalId })
    sendSseToUser(agreement.buyerId, { type: 'agreement_update', status: 'returned', agreementId: rentalId })

    res.json({ message: 'Pengembalian dikonfirmasi', agreement: updated })
  } catch (err) { res.status(500).json({ message: err.message }) }
}


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

    
    const item = await prisma.item.findUnique({ where: { id: agreement.itemId } })
    if (item?.owner_id) {
      const ownerReviews = await prisma.review.findMany({ where: { item: { owner_id: item.owner_id } } })
      const avg = ownerReviews.reduce((s, r) => s + r.rating, 0) / ownerReviews.length
      await prisma.users.update({ where: { id: item.owner_id }, data: { rating: avg } })
    }

    res.json({ message: 'Ulasan berhasil dikirim', review })
  } catch (err) { res.status(500).json({ message: err.message }) }
}


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


const getActiveRentals = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    const agreements = await prisma.rentalAgreement.findMany({
      where: {
        buyerId: userId,
        status: { in: ['approved', 'guarantee_submitted', 'handover_confirmed', 'received'] }
      },
      orderBy: { createdAt: 'desc' },
    })
    const result = await Promise.all(agreements.map(async a => {
      const item   = a.itemId ? await prisma.item.findUnique({ where: { id: a.itemId }, select: { title: true, image: true } }) : null
      const seller = await prisma.users.findUnique({ where: { id: a.sellerId }, select: { username: true } })
      const now = new Date()
      const daysLeft = a.endDate ? Math.ceil((a.endDate - now) / 86400000) : null
      return { ...a, guaranteeData: undefined, item, seller, daysLeft }
    }))
    res.json(result)
  } catch (err) { res.status(500).json({ message: err.message }) }
}


const listGuarantees = async (req, res) => {
  try {
    const agreements = await prisma.rentalAgreement.findMany({
      where: { status: { not: 'pending' } }, orderBy: { createdAt: 'desc' },
      include: { buyer: { select: { username: true, email: true } }, item: { select: { title: true } } },
    })
    res.json(agreements.map(({ guaranteeData, ...a }) => a))
  } catch (err) { res.status(500).json({ message: err.message }) }
}


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


const getAgreementBetween = async (req, res) => {
  try {
    const { userId, otherId } = req.query
    if (!userId || !otherId) return res.json(null)
    const agreement = await prisma.rentalAgreement.findFirst({
      where: {
        OR: [
          { buyerId: +userId, sellerId: +otherId },
          { buyerId: +otherId, sellerId: +userId },
        ],
        status: { notIn: ['reviewed'] },
      },
      orderBy: { updatedAt: 'desc' },
    })
    res.json(agreement || null)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

module.exports = {
  getChatStatus, getAgreement,
  initiateRental,
  approveRental, submitGuarantee,
  confirmHandover, confirmReceived, confirmReturned,
  submitReview, checkReviewEligibility,
  getActiveRentals, listGuarantees, getGuaranteeDetail,
  getAgreementBetween,
}
