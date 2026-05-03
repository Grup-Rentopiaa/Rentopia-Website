const express = require('express')
const authRoutes = express.Router()
const {signup, login, verifyOtp, forgotPassword, resetPassword, verifyOtpForgot} = require('../controllers/auth')

authRoutes.post('/signup', signup)
authRoutes.post('/login', login)
authRoutes.post('/otp', verifyOtp)
authRoutes.post('/forgot-password', forgotPassword)
authRoutes.post('/verify-otp-forgot', verifyOtpForgot)
authRoutes.post('/reset-password', resetPassword)

module.exports = authRoutes