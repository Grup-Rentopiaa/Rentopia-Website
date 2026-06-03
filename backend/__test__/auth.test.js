const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

jest.mock('../models/user')
jest.mock('bcrypt')
jest.mock('jsonwebtoken')
jest.mock('../utils/sendEmail')
jest.mock('../lib/prisma', () => ({
  prisma: {
    users: {
      findUnique: jest.fn()
    }
  }
}))

const {
  signup,
  login,
  verifyOtp,
  forgotPassword,
  verifyOtpForgot,
  resetPassword,
  getMe
} = require('../controllers/auth')

const {
  findByEmail,
  createUser,
  createAuth,
  findAuthByUserId,
  saveOtp,
  findAuthByOtp,
  updatePassword,
  findById
} = require('../models/user')

const sendEmail = require('../utils/sendEmail')
const { prisma } = require('../lib/prisma')

const mockReq = (body = {}, headers = {}) => ({ body, headers })
const mockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  res.cookie = jest.fn().mockReturnValue(res)
  res.clearCookie = jest.fn().mockReturnValue(res)
  return res
}

// ─────────────────────────────────────────────
// SIGNUP
// ─────────────────────────────────────────────
describe('signup', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil registrasi user baru', async () => {
    findByEmail.mockResolvedValue(null)
    bcrypt.hash.mockResolvedValue('hashedpassword')
    createUser.mockResolvedValue({ id: 1 })
    createAuth.mockResolvedValue({})
    saveOtp.mockResolvedValue({})
    sendEmail.mockResolvedValue({})

    const req = mockReq({ username: 'amel', email: 'amel@mail.com', password: '123456' })
    const res = mockRes()

    await signup(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'registrasi berhasil, cek email untuk OTP' })
    )
  })

  test('gagal jika email sudah terdaftar', async () => {
    findByEmail.mockResolvedValue({ id: 1, email: 'amel@mail.com' })

    const req = mockReq({ username: 'amel', email: 'amel@mail.com', password: '123456' })
    const res = mockRes()

    await signup(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'email sudah terdaftar' })
    )
  })
})

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
describe('login', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil login dengan email dan password yang benar', async () => {
    findByEmail.mockResolvedValue({ id: 1, username: 'amel', email: 'amel@mail.com' })
    findAuthByUserId.mockResolvedValue({ password: 'hashedpassword' })
    bcrypt.compare.mockResolvedValue(true)
    jwt.sign.mockReturnValue('mocked_token')

    const req = mockReq({ email: 'amel@mail.com', password: '123456' })
    const res = mockRes()

    await login(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'login berhasil', token: 'mocked_token' })
    )
  })

  test('gagal jika email tidak ditemukan', async () => {
    findByEmail.mockResolvedValue(null)

    const req = mockReq({ email: 'tidakada@mail.com', password: '123456' })
    const res = mockRes()

    await login(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'email tidak ditemukan' })
    )
  })

  test('gagal jika password salah', async () => {
    findByEmail.mockResolvedValue({ id: 1, username: 'amel', email: 'amel@mail.com' })
    findAuthByUserId.mockResolvedValue({ password: 'hashedpassword' })
    bcrypt.compare.mockResolvedValue(false)

    const req = mockReq({ email: 'amel@mail.com', password: 'passwordsalah' })
    const res = mockRes()

    await login(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'password salah' })
    )
  })
})

// ─────────────────────────────────────────────
// VERIFY OTP
// ─────────────────────────────────────────────
describe('verifyOtp', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil verifikasi OTP yang valid', async () => {
    findAuthByOtp.mockResolvedValue({
      user_id: 1,
      otp_expired_at: new Date(Date.now() + 60000)
    })
    prisma.users.findUnique.mockResolvedValue({ id: 1, username: 'amel', email: 'amel@mail.com' })

    const req = mockReq({ otp: '123456' })
    const res = mockRes()

    await verifyOtp(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Verifikasi Sukses' })
    )
  })

  test('gagal jika OTP tidak ditemukan', async () => {
    findAuthByOtp.mockResolvedValue(null)

    const req = mockReq({ otp: '000000' })
    const res = mockRes()

    await verifyOtp(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'user tidak ditemukan' })
    )
  })

  test('gagal jika OTP sudah expired', async () => {
    findAuthByOtp.mockResolvedValue({
      user_id: 1,
      otp_expired_at: new Date(Date.now() - 60000)
    })

    const req = mockReq({ otp: '123456' })
    const res = mockRes()

    await verifyOtp(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Kode OTP sudah expired' })
    )
  })
})

// ─────────────────────────────────────────────
// FORGOT PASSWORD
// ─────────────────────────────────────────────
describe('forgotPassword', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil kirim OTP ke email yang terdaftar', async () => {
    findByEmail.mockResolvedValue({ id: 1, email: 'amel@mail.com' })
    saveOtp.mockResolvedValue({})
    sendEmail.mockResolvedValue({})

    const req = mockReq({ email: 'amel@mail.com' })
    const res = mockRes()

    await forgotPassword(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'OTP telah dikirim ke email' })
    )
  })

  test('gagal jika email tidak terdaftar', async () => {
    findByEmail.mockResolvedValue(null)

    const req = mockReq({ email: 'tidakada@mail.com' })
    const res = mockRes()

    await forgotPassword(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'email tidak ditemukan' })
    )
  })
})

// ─────────────────────────────────────────────
// VERIFY OTP FORGOT
// ─────────────────────────────────────────────
describe('verifyOtpForgot', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil verifikasi OTP dan dapat reset token', async () => {
    findAuthByOtp.mockResolvedValue({
      user_id: 1,
      otp_expired_at: new Date(Date.now() + 60000)
    })
    jwt.sign.mockReturnValue('reset_token_mocked')

    const req = mockReq({ otp: '123456' })
    const res = mockRes()

    await verifyOtpForgot(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'OTP valid', resetToken: 'reset_token_mocked' })
    )
  })

  test('gagal jika OTP tidak valid', async () => {
    findAuthByOtp.mockResolvedValue(null)

    const req = mockReq({ otp: '000000' })
    const res = mockRes()

    await verifyOtpForgot(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'OTP tidak valid' })
    )
  })

  test('gagal jika OTP sudah expired', async () => {
    findAuthByOtp.mockResolvedValue({
      user_id: 1,
      otp_expired_at: new Date(Date.now() - 60000)
    })

    const req = mockReq({ otp: '123456' })
    const res = mockRes()

    await verifyOtpForgot(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'OTP sudah expired' })
    )
  })
})

// ─────────────────────────────────────────────
// RESET PASSWORD
// ─────────────────────────────────────────────
describe('resetPassword', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil reset password dengan token yang valid', async () => {
    jwt.verify.mockReturnValue({ userId: 1 })
    bcrypt.hash.mockResolvedValue('newhashedpassword')
    updatePassword.mockResolvedValue({})

    const req = mockReq({ resetToken: 'valid_token', newPassword: 'newpassword123' })
    const res = mockRes()

    await resetPassword(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Password berhasil diubah' })
    )
  })

  test('gagal jika token tidak valid atau expired', async () => {
    jwt.verify.mockImplementation(() => { throw new Error('invalid token') })

    const req = mockReq({ resetToken: 'token_salah', newPassword: 'newpassword123' })
    const res = mockRes()

    await resetPassword(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Token tidak valid atau sudah expired' })
    )
  })
})

// ─────────────────────────────────────────────
// GET ME
// ─────────────────────────────────────────────
describe('getMe', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil ambil data user dari token yang valid', async () => {
    jwt.verify.mockReturnValue({ userId: 1 })
    findById.mockResolvedValue({ id: 1, username: 'amel', email: 'amel@mail.com' })

    const req = mockReq({}, { authorization: 'Bearer valid_token' })
    const res = mockRes()

    await getMe(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({ email: 'amel@mail.com' })
      })
    )
  })

  test('gagal jika tidak ada token di header', async () => {
    const req = mockReq({}, {})
    const res = mockRes()

    await getMe(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Token tidak ditemukan' })
    )
  })

  test('gagal jika token tidak valid', async () => {
    jwt.verify.mockImplementation(() => { throw new Error('invalid') })

    const req = mockReq({}, { authorization: 'Bearer token_salah' })
    const res = mockRes()

    await getMe(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Token tidak valid' })
    )
  })
})