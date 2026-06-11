const { prisma } = require('../lib/prisma')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {findByEmail, createUser, createAuth, findAuthByUserId, saveOtp, findAuthByOtp, updatePassword, findById} = require('../models/user')
const sendEmail = require('../utils/sendEmail')

const signup = async (req, res) => {
    const { username, email, password } = req.body
    const existingUser = await findByEmail(email)
    if (existingUser) {
        return res.status(400).json({ message: 'email sudah terdaftar'})
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await createUser(username, email)
    const newAuth = await createAuth(newUser.id, hashedPassword)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiredAt = new Date(Date.now() + 5 * 60 * 1000)
    await saveOtp(newUser.id, otp, expiredAt)
    await sendEmail(email, otp)
    res.status(201).json({message: 'registrasi berhasil, cek email untuk OTP'})
}
const login = async (req, res) => {
    const {email, password} = req.body
    const existingUser = await findByEmail(email)
    if (!existingUser) {
        return res.status(400).json({ message: 'email tidak ditemukan'})
    }
    const authData = await findAuthByUserId(existingUser.id)
    const cocok = await bcrypt.compare(password, authData.password)
    if (!cocok) {
        return res.status(400).json({message: 'password salah'})
    }
    const token = jwt.sign({ userId: existingUser.id}, process.env.JWT_SECRET, {expiresIn: '1d'})
    res.cookie('token', token, {httpOnly: true, secure: true})
    
    res.status(200).json({
  message: 'login berhasil',
  token,
  user: {
    id: existingUser.id,
    username: existingUser.username,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
    avatarB64: existingUser.avatarB64,  // ← tambahkan ini
  }
})
}
const verifyOtp = async (req, res) => {
    const {otp} = req.body
    const existingAuth = await findAuthByOtp(otp)
    if (!existingAuth) {
        return res.status(400).json({ message: 'user tidak ditemukan'})
    }
    if (existingAuth.otp_expired_at < new Date()) {
        return res.status(400).json({message: 'Kode OTP sudah expired'})
    }
    const user = await prisma.users.findUnique({
        where: { id: existingAuth.user_id }
    })
    res.status(200).json({ 
        message: 'Verifikasi Sukses', 
        user: { id: user.id, username: user.username, email: user.email } 
    })
}
const forgotPassword = async (req, res) => {
    const { email } = req.body
    const existingUser = await findByEmail(email)
    if (!existingUser) {
        return res.status(400).json({ message: 'email tidak ditemukan' })
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiredAt = new Date(Date.now() + 5 * 60 * 1000)
    await saveOtp(existingUser.id, otp, expiredAt)
    await sendEmail(existingUser.email, otp)
    res.status(200).json({ message: 'OTP telah dikirim ke email' })
}

const verifyOtpForgot = async (req, res) => {
    const { otp } = req.body
    const existingAuth = await findAuthByOtp(otp)
    if (!existingAuth) {
        return res.status(400).json({ message: 'OTP tidak valid' })
    }
    if (existingAuth.otp_expired_at < new Date()) {
        return res.status(400).json({ message: 'OTP sudah expired' })
    }
    const resetToken = jwt.sign({ userId: existingAuth.user_id }, process.env.JWT_SECRET, { expiresIn: '10m' })
    res.status(200).json({ message: 'OTP valid', resetToken })
}

const resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body
    let decoded
    try {
        decoded = jwt.verify(resetToken, process.env.JWT_SECRET)
    } catch (err) {
        return res.status(400).json({ message: 'Token tidak valid atau sudah expired' })
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await updatePassword(decoded.userId, hashedPassword)
    res.status(200).json({ message: 'Password berhasil diubah' })
}
const getMe = async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token tidak ditemukan' })
        }
        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await findById(decoded.userId)
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' })
        }
        res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        })
    } catch (err) {
        return res.status(401).json({ message: 'Token tidak valid' })
    }
}

const logout = (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: true })
    res.status(200).json({ message: 'logout berhasil' })
}

module.exports = {signup, login, verifyOtp, forgotPassword, verifyOtpForgot, resetPassword, getMe, logout}