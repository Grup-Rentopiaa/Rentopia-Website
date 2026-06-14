const express = require('express')
const router = express.Router()
const { authenticate } = require('../middlewares/auth')
const { createPenawaran } = require('../controllers/penawaran')

router.post('/', authenticate, createPenawaran)         

module.exports = router