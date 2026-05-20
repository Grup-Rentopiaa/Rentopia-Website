const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { listGuarantees, getGuaranteeDetail } = require('../controllers/rentalFlow')


function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) return res.status(401).json({ message: 'Unauthorized' })
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded.isAdmin) return res.status(403).json({ message: 'Admin only' })
    req.adminUser = decoded
    next()
  } catch {
    res.status(401).json({ message: 'Token tidak valid' })
  }
}


router.get('/guarantees', requireAdmin, listGuarantees)


router.get('/guarantees/:rentalId', requireAdmin, getGuaranteeDetail)

module.exports = router
