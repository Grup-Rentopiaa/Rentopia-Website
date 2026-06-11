jest.mock('../lib/prisma', () => ({
  prisma: {
    rentalAgreement: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
    message: { create: jest.fn() },
    item: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    users: { findUnique: jest.fn(),
        update: jest.fn(),
     },
    review: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  }
}))

jest.mock('../utils/chatUtils', () => ({
  sendWsToUser: jest.fn(),
  sendSseToUser: jest.fn(),
}))

jest.mock('../utils/notificationUtils', () => ({
  createNotification: jest.fn(),
}))

const {
  getChatStatus,
  initiateRental,
  approveRental,
  submitGuarantee,
  confirmHandover,
  confirmReceived,
  confirmReturned,
  submitReview,
  checkReviewEligibility,
  getActiveRentals,
  listGuarantees,
  getGuaranteeDetail,
  getAgreementBetween,
} = require('../controllers/rentalFlow')

const { prisma } = require('../lib/prisma')

const mockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

const mockReq = (body = {}, params = {}, query = {}) => ({ body, params, query })

// ─────────────────────────────────────────────
// GET CHAT STATUS
// ─────────────────────────────────────────────
describe('getChatStatus', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil ambil status agreement', async () => {
    prisma.rentalAgreement.findUnique.mockResolvedValue({ id: 1, status: 'pending' })
    const req = mockReq({}, {}, { buyerId: '1', sellerId: '2', itemId: '3' })
    const res = mockRes()
    await getChatStatus(req, res)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }))
  })

  test('return null jika parameter tidak lengkap', async () => {
    const req = mockReq({}, {}, {})
    const res = mockRes()
    await getChatStatus(req, res)
    expect(res.json).toHaveBeenCalledWith(null)
  })
})

// ─────────────────────────────────────────────
// INITIATE RENTAL
// ─────────────────────────────────────────────
describe('initiateRental', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil buat agreement baru', async () => {
    prisma.rentalAgreement.findUnique.mockResolvedValue(null)
    prisma.rentalAgreement.create.mockResolvedValue({ id: 1, status: 'pending' })
    prisma.item.findUnique.mockResolvedValue({ title: 'Kamera' })
    prisma.users.findUnique.mockResolvedValue({ username: 'amel' })

    const req = mockReq({ buyerId: 1, sellerId: 2, itemId: 3 })
    const res = mockRes()
    await initiateRental(req, res)

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'ok' })
    )
  })

  test('gagal jika parameter tidak lengkap', async () => {
    const req = mockReq({ buyerId: 1 })
    const res = mockRes()
    await initiateRental(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  test('return agreement yang sudah ada jika sudah pernah dibuat', async () => {
    prisma.rentalAgreement.findUnique.mockResolvedValue({ id: 1, status: 'pending' })

    const req = mockReq({ buyerId: 1, sellerId: 2, itemId: 3 })
    const res = mockRes()
    await initiateRental(req, res)

    expect(prisma.rentalAgreement.create).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'ok' }))
  })
})

// ─────────────────────────────────────────────
// APPROVE RENTAL
// ─────────────────────────────────────────────
describe('approveRental', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil approve rental', async () => {
    prisma.rentalAgreement.upsert.mockResolvedValue({ id: 1, status: 'approved', buyerId: 1, sellerId: 2 })
    prisma.message.create.mockResolvedValue({ waktu: new Date() })
    prisma.users.findUnique.mockResolvedValue({ username: 'budi' })

    const req = mockReq({ buyerId: 1, sellerId: 2, itemId: 3 })
    const res = mockRes()
    await approveRental(req, res)

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Penyewaan disetujui' })
    )
  })

  test('gagal jika parameter tidak lengkap', async () => {
    const req = mockReq({ buyerId: 1 })
    const res = mockRes()
    await approveRental(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })
})

// ─────────────────────────────────────────────
// SUBMIT GUARANTEE
// ─────────────────────────────────────────────
describe('submitGuarantee', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil kirim data jaminan', async () => {
    prisma.rentalAgreement.upsert.mockResolvedValue({ id: 1, status: 'guarantee_submitted', buyerId: 1, sellerId: 2 })
    prisma.message.create.mockResolvedValue({ waktu: new Date() })
    prisma.users.findUnique.mockResolvedValue({ username: 'amel' })

    const req = mockReq({
      buyerId: 1, sellerId: 2, itemId: 3,
      fullName: 'Amel', phone: '08123', address: 'Surabaya', durationDays: 3
    })
    const res = mockRes()
    await submitGuarantee(req, res)

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Data jaminan berhasil dikirim' })
    )
  })

  test('gagal jika field tidak lengkap', async () => {
    const req = mockReq({ buyerId: 1, sellerId: 2 })
    const res = mockRes()
    await submitGuarantee(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })
})

// ─────────────────────────────────────────────
// CONFIRM HANDOVER
// ─────────────────────────────────────────────
describe('confirmHandover', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil konfirmasi serah terima', async () => {
    prisma.rentalAgreement.findUnique.mockResolvedValue({ id: 1, buyerId: 1, sellerId: 2 })
    prisma.rentalAgreement.update.mockResolvedValue({ id: 1, status: 'handover_confirmed' })
    prisma.message.create.mockResolvedValue({ waktu: new Date() })
    prisma.users.findUnique.mockResolvedValue({ username: 'budi' })

    const req = mockReq({}, { rentalId: '1' })
    const res = mockRes()
    await confirmHandover(req, res)

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Serah terima dikonfirmasi penjual' })
    )
  })

  test('gagal jika agreement tidak ditemukan', async () => {
    prisma.rentalAgreement.findUnique.mockResolvedValue(null)

    const req = mockReq({}, { rentalId: '99' })
    const res = mockRes()
    await confirmHandover(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })
})

// ─────────────────────────────────────────────
// CONFIRM RECEIVED
// ─────────────────────────────────────────────
describe('confirmReceived', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil konfirmasi barang diterima', async () => {
    prisma.rentalAgreement.findUnique.mockResolvedValue({ id: 1, buyerId: 1, sellerId: 2, itemId: 3, durationDays: 3 })
    prisma.rentalAgreement.update.mockResolvedValue({ id: 1, status: 'received' })
    prisma.item.update.mockResolvedValue({})
    prisma.message.create.mockResolvedValue({ waktu: new Date() })
    prisma.users.findUnique.mockResolvedValue({ username: 'amel' })

    const req = mockReq({}, { rentalId: '1' })
    const res = mockRes()
    await confirmReceived(req, res)

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Konfirmasi penerimaan berhasil' })
    )
  })

  test('gagal jika agreement tidak ditemukan', async () => {
    prisma.rentalAgreement.findUnique.mockResolvedValue(null)

    const req = mockReq({}, { rentalId: '99' })
    const res = mockRes()
    await confirmReceived(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })
})

// ─────────────────────────────────────────────
// CONFIRM RETURNED
// ─────────────────────────────────────────────
describe('confirmReturned', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil konfirmasi barang dikembalikan', async () => {
    prisma.rentalAgreement.findUnique.mockResolvedValue({ id: 1, buyerId: 1, sellerId: 2, itemId: 3 })
    prisma.rentalAgreement.update.mockResolvedValue({ id: 1, status: 'returned' })
    prisma.item.update.mockResolvedValue({})
    prisma.message.create.mockResolvedValue({ waktu: new Date() })

    const req = mockReq({}, { rentalId: '1' })
    const res = mockRes()
    await confirmReturned(req, res)

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Pengembalian dikonfirmasi' })
    )
  })

  test('gagal jika agreement tidak ditemukan', async () => {
    prisma.rentalAgreement.findUnique.mockResolvedValue(null)

    const req = mockReq({}, { rentalId: '99' })
    const res = mockRes()
    await confirmReturned(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })
})

// ─────────────────────────────────────────────
// SUBMIT REVIEW
// ─────────────────────────────────────────────
describe('submitReview', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil kirim ulasan', async () => {
    prisma.rentalAgreement.findUnique.mockResolvedValue({ id: 1, buyerId: 1, sellerId: 2, itemId: 3 })
    prisma.review.create.mockResolvedValue({ id: 1, rating: 5 })
    prisma.rentalAgreement.update.mockResolvedValue({})
    prisma.users.findUnique.mockResolvedValue({ username: 'amel' })
    prisma.item.findUnique.mockResolvedValue({ owner_id: 2 })
    prisma.review.findMany.mockResolvedValue([{ rating: 5 }])
    prisma.users.update.mockResolvedValue({})

    const req = mockReq({ rating: 5, comment: 'Bagus!' }, { rentalId: '1' })
    const res = mockRes()
    await submitReview(req, res)

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Ulasan berhasil dikirim' })
    )
  })

  test('gagal jika agreement tidak ditemukan', async () => {
    prisma.rentalAgreement.findUnique.mockResolvedValue(null)

    const req = mockReq({ rating: 5 }, { rentalId: '99' })
    const res = mockRes()
    await submitReview(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })
})

// ─────────────────────────────────────────────
// CHECK REVIEW ELIGIBILITY
// ─────────────────────────────────────────────
describe('checkReviewEligibility', () => {
  beforeEach(() => jest.clearAllMocks())

  test('bisa review jika status returned', async () => {
    prisma.rentalAgreement.findFirst.mockResolvedValue({ id: 1, status: 'returned' })

    const req = mockReq({}, { userId: '1', productId: '3' })
    const res = mockRes()
    await checkReviewEligibility(req, res)

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ canReview: true }))
  })

  test('tidak bisa review jika tidak ada agreement', async () => {
    prisma.rentalAgreement.findFirst.mockResolvedValue(null)

    const req = mockReq({}, { userId: '1', productId: '3' })
    const res = mockRes()
    await checkReviewEligibility(req, res)

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ canReview: false }))
  })
})

// ─────────────────────────────────────────────
// GET ACTIVE RENTALS
// ─────────────────────────────────────────────
describe('getActiveRentals', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil ambil daftar rental aktif', async () => {
    prisma.rentalAgreement.findMany.mockResolvedValue([
      { id: 1, buyerId: 1, sellerId: 2, itemId: 3, status: 'received', endDate: null, durationDays: 3 }
    ])
    prisma.item.findUnique.mockResolvedValue({ title: 'Kamera', image: null })
    prisma.users.findUnique.mockResolvedValue({ username: 'budi' })

    const req = mockReq({}, { userId: '1' })
    const res = mockRes()
    await getActiveRentals(req, res)

    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: 1 })])
    )
  })
})

// ─────────────────────────────────────────────
// LIST GUARANTEES
// ─────────────────────────────────────────────
describe('listGuarantees', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil ambil semua guarantee', async () => {
    prisma.rentalAgreement.findMany.mockResolvedValue([
      { id: 1, status: 'approved', guaranteeData: 'encrypted', buyer: { username: 'amel' }, item: { title: 'Kamera' } }
    ])

    const req = mockReq()
    const res = mockRes()
    await listGuarantees(req, res)

    expect(res.json).toHaveBeenCalled()
  })
})

// ─────────────────────────────────────────────
// GET AGREEMENT BETWEEN
// ─────────────────────────────────────────────
describe('getAgreementBetween', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil ambil agreement antara dua user', async () => {
    prisma.rentalAgreement.findFirst.mockResolvedValue({ id: 1, status: 'approved' })

    const req = mockReq({}, {}, { userId: '1', otherId: '2' })
    const res = mockRes()
    await getAgreementBetween(req, res)

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }))
  })

  test('return null jika parameter tidak ada', async () => {
    const req = mockReq({}, {}, {})
    const res = mockRes()
    await getAgreementBetween(req, res)

    expect(res.json).toHaveBeenCalledWith(null)
  })
})