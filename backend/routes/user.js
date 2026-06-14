const express = require('express')
const router = express.Router()
const { authenticate } = require('../middlewares/auth') 
const { getUser, updateUser, follow, unfollow, getFollowStatus, searchUsers } = require('../controllers/user')

router.get('/', searchUsers)
router.get('/:id', getUser)
router.get('/:id/follow-status', getFollowStatus)
router.put('/:id', authenticate, updateUser)     
router.post('/:id/follow', authenticate, follow)   
router.delete('/:id/follow', authenticate, unfollow) 

module.exports = router