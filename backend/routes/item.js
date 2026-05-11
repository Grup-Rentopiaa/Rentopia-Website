const express = require('express')
const { getItems, getItemById, getCategories, createNewItem, updateExistingItem, removeExistingItem } = require('../controllers/item')

const router = express.Router({ mergeParams: true })

router.get('/', getItems)
router.post('/', createNewItem)
router.put('/:id', updateExistingItem)
router.delete('/:id', removeExistingItem)
router.get('/categories', getCategories)
router.get('/:id', getItemById)

module.exports = router