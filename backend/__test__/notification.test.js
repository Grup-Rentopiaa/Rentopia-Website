jest.mock('../lib/prisma', () => ({
  prisma: {
    notification: {
      findMany: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
    }
  }
}))

const { getNotifications, markAllRead, getUnreadCount } = require('../controllers/notification')
const { prisma } = require('../lib/prisma')

const mockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}
const mockReq = (params = {}) => ({ params })

// ─────────────────────────────────────────────
// GET NOTIFICATIONS
// ─────────────────────────────────────────────
describe('getNotifications', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil ambil daftar notifikasi user', async () => {
    prisma.notification.findMany.mockResolvedValue([
      { id: 1, user_id: 1, message: 'Penyewaan disetujui', is_read: false }
    ])
    const req = mockReq({ userId: '1' })
    const res = mockRes()
    await getNotifications(req, res)
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ message: 'Penyewaan disetujui' })])
    )
  })

  test('return array kosong jika tidak ada notifikasi', async () => {
    prisma.notification.findMany.mockResolvedValue([])
    const req = mockReq({ userId: '1' })
    const res = mockRes()
    await getNotifications(req, res)
    expect(res.json).toHaveBeenCalledWith([])
  })

  test('gagal jika userId tidak valid', async () => {
    const req = mockReq({ userId: '0' })
    const res = mockRes()
    await getNotifications(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'userId required' }))
  })
})

// ─────────────────────────────────────────────
// MARK ALL READ
// ─────────────────────────────────────────────
describe('markAllRead', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil tandai semua notifikasi sudah dibaca', async () => {
    prisma.notification.updateMany.mockResolvedValue({ count: 3 })
    const req = mockReq({ userId: '1' })
    const res = mockRes()
    await markAllRead(req, res)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Semua notifikasi ditandai sudah dibaca' })
    )
  })

  test('gagal jika userId tidak valid', async () => {
    const req = mockReq({ userId: '0' })
    const res = mockRes()
    await markAllRead(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })
})

// ─────────────────────────────────────────────
// GET UNREAD COUNT
// ─────────────────────────────────────────────
describe('getUnreadCount', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil ambil jumlah notifikasi belum dibaca', async () => {
    prisma.notification.count.mockResolvedValue(5)
    const req = mockReq({ userId: '1' })
    const res = mockRes()
    await getUnreadCount(req, res)
    expect(res.json).toHaveBeenCalledWith({ count: 5 })
  })

  test('return 0 jika semua notifikasi sudah dibaca', async () => {
    prisma.notification.count.mockResolvedValue(0)
    const req = mockReq({ userId: '1' })
    const res = mockRes()
    await getUnreadCount(req, res)
    expect(res.json).toHaveBeenCalledWith({ count: 0 })
  })
})