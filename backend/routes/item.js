const express = require('express')
const router = express.Router()
const { getItems, getItemById, getCategories } = require('../controllers/item')

router.get('/', getItems)
router.get('/categories', getCategories)
router.get('/:id', getItemById)

module.exports = router