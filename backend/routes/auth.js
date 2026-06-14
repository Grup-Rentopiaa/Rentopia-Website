const express = require('express')
const authRoutes = express.Router()
const { authenticate } = require('../middlewares/auth') 
const { signup, login, verifyOtp, forgotPassword, resetPassword, verifyOtpForgot, getMe, logout } = require('../controllers/auth')

authRoutes.post('/signup', signup)
authRoutes.post('/login', login)
authRoutes.post('/logout', logout)
authRoutes.post('/otp', verifyOtp)
authRoutes.post('/forgot-password', forgotPassword)
authRoutes.post('/verify-otp-forgot', verifyOtpForgot)
authRoutes.post('/reset-password', resetPassword)
authRoutes.get('/me', authenticate, getMe) 

module.exports = authRoutes