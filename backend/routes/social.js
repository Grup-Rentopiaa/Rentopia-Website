const express = require('express')
const router  = express.Router()
const { searchUsers, getFollowers, getFollowing, removeFollower } = require('../controllers/social')

// GET  /api/search/users?q=
router.get('/users', searchUsers)

// GET  /api/profile/:userId/followers
router.get('/:userId/followers', getFollowers)

// GET  /api/profile/:userId/following
router.get('/:userId/following', getFollowing)

// DELETE /api/profile/:userId/followers/:followerId
router.delete('/:userId/followers/:followerId', removeFollower)

module.exports = router
