const express = require('express')
const router = express.Router()
const { getKeywords, postKeyword, removeKeyword } = require('../controllers/keyword')

router.get('/', getKeywords)
router.post('/', postKeyword)
router.delete('/:id', removeKeyword)

module.exports = router