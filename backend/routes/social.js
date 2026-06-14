const express = require('express')
const router  = express.Router()
const { authenticate } = require('../middlewares/auth')
const { searchUsers, getFollowers, getFollowing, removeFollower } = require('../controllers/social')

router.get('/users', searchUsers)           
router.get('/:userId/followers', getFollowers)         
router.get('/:userId/following', getFollowing)          
router.delete('/:userId/followers/:followerId',  authenticate, removeFollower)

module.exports = router