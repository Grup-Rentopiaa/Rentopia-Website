const express = require('express')
const router = express.Router()
const { authenticate } = require('../middlewares/auth')
const { getKeywords, postKeyword, removeKeyword } = require('../controllers/keyword')

router.get('/',     authenticate, getKeywords)   
router.post('/',    authenticate, postKeyword)   
router.delete('/:id', authenticate, removeKeyword)

module.exports = router