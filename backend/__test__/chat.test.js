jest.mock('../lib/prisma', () => ({
  prisma: {
    users: { findMany: jest.fn() },
    message: {
      findMany: jest.fn(),
      create: jest.fn()
    }
  }
}))

jest.mock('../utils/chatUtils', () => ({
  getAuthPayload: jest.fn(),
  sseClients: new Map(),
  setLatestMessage: jest.fn(),
  sendWsToUser: jest.fn(),
  sendSseToUser: jest.fn(),
  getLatestMessage: jest.fn().mockReturnValue('No new messages yet')
}))

const { getUsers, getMessages, sendMessage, pollMessage } = require('../controllers/chat')
const { prisma } = require('../lib/prisma')
const { getAuthPayload, getLatestMessage } = require('../utils/chatUtils')

const mockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  res.setHeader = jest.fn().mockReturnValue(res)
  res.write = jest.fn().mockReturnValue(res)
  res.flushHeaders = jest.fn().mockReturnValue(res)
  return res
}

const mockReq = (params = {}, body = {}, headers = {}) => ({ params, body, headers })

// ─────────────────────────────────────────────
// GET USERS
// ─────────────────────────────────────────────
describe('getUsers', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil ambil daftar user dengan pesan terakhir', async () => {
    getAuthPayload.mockReturnValue({ id: 1 })
    prisma.users.findMany.mockResolvedValue([
      {
        id: 2,
        username: 'budi',
        email: 'budi@mail.com',
        sentMessages: [{ isi_pesan: 'Halo', waktu: new Date('2024-01-01T10:00:00') }],
        receivedMessages: []
      }
    ])

    const req = mockReq()
    const res = mockRes()

    await getUsers(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({ id: 2, name: 'budi', last_message: 'Halo' })
        ])
      })
    )
  })

  test('gagal jika token tidak valid', async () => {
    getAuthPayload.mockImplementation(() => { throw new Error('Unauthorized') })

    const req = mockReq()
    const res = mockRes()

    await getUsers(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Unauthorized' }))
  })
})

// ─────────────────────────────────────────────
// GET MESSAGES
// ─────────────────────────────────────────────
describe('getMessages', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil ambil pesan antara dua user', async () => {
    getAuthPayload.mockReturnValue({ id: 1 })
    prisma.message.findMany.mockResolvedValue([
      { pesan_id: 1, sender_id: 1, receiver_id: 2, isi_pesan: 'Halo', waktu: new Date() }
    ])

    const req = mockReq({ id: '2' })
    const res = mockRes()

    await getMessages(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ isi_pesan: 'Halo' })
      ])
    )
  })

  test('gagal jika token tidak valid', async () => {
    getAuthPayload.mockImplementation(() => { throw new Error('Unauthorized') })

    const req = mockReq({ id: '2' })
    const res = mockRes()

    await getMessages(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
  })
})

// ─────────────────────────────────────────────
// SEND MESSAGE
// ─────────────────────────────────────────────
describe('sendMessage', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil kirim pesan ke user lain', async () => {
    getAuthPayload.mockReturnValue({ id: 1 })
    prisma.message.create.mockResolvedValue({
      pesan_id: 1,
      sender_id: 1,
      receiver_id: 2,
      isi_pesan: 'Halo budi',
      waktu: new Date()
    })

    const req = mockReq({ id: '2' }, { text: 'Halo budi' })
    const res = mockRes()

    await sendMessage(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Pesan berhasil dikirim' })
    )
  })

  test('gagal jika token tidak valid', async () => {
    getAuthPayload.mockImplementation(() => { throw new Error('Unauthorized') })

    const req = mockReq({ id: '2' }, { text: 'Halo' })
    const res = mockRes()

    await sendMessage(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
  })
})

// ─────────────────────────────────────────────
// POLL MESSAGE
// ─────────────────────────────────────────────
describe('pollMessage', () => {
  test('berhasil ambil pesan terbaru', () => {
    getLatestMessage.mockReturnValue('Pesan terbaru')

    const req = mockReq()
    const res = mockRes()

    pollMessage(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Pesan terbaru' })
    )
  })
})