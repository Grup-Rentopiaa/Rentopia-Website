const express = require('express')
const router = express.Router()
const {signup, login, verifyOtp, forgotPassword, resetPassword, verifyOtpForgot} = require('../controllers/auth')

router.post('/signup', signup)
router.post('/login', login)
router.post('/otp', verifyOtp)
router.post('/forgot-password', forgotPassword)
router.post('/verify-otp-forgot', verifyOtpForgot)
router.post('/reset-password', resetPassword)

module.exports = router