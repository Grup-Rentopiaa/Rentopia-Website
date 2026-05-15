const express = require('express')
const { 
  getItems, 
  getLikedItems,
  getItemById, 
  getCategories, 
  createNewItem, 
  updateExistingItem, 
  removeExistingItem,
  likeItem,
  updateStatus,
  clearAllLikedItems,
  getReviews,
  createReview
} = require('../controllers/item')

const router = express.Router({ mergeParams: true })

router.get('/', getItems)
router.get('/liked', getLikedItems)
router.delete('/liked/clear', clearAllLikedItems)
router.get('/users/:userId/liked', getLikedItems)
router.post('/', createNewItem)
router.put('/:id', updateExistingItem)
router.delete('/:id', removeExistingItem)
router.get('/categories', getCategories)
router.get('/:id', getItemById)
router.post('/:id/like', likeItem)
router.patch('/:id/status', updateStatus)
router.get('/:id/reviews', getReviews)
router.post('/:id/reviews', createReview)

module.exports = router