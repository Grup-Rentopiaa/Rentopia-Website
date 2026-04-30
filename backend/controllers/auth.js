const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {findByEmail, createUser, createAuth, findAuthByUserId,  saveOtp, findAuthByOtp} = require('../models/user')
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
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiredAt = new Date(Date.now() + 5 * 60 * 1000)
    await saveOtp(existingUser.id, otp, expiredAt)
    await sendEmail(existingUser.email, otp)
    res.status(200).json({message: 'login berhasil'})
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
    res.status(200).json({message: 'Verifikasi Sukses'})
}


module.exports = { signup, login, verifyOtp}