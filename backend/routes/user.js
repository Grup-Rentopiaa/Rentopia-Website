const express = require('express')
const router  = express.Router()
const { getUser, updateUser, follow, unfollow, getFollowStatus } = require('../controllers/user')

router.get('/:id', getUser)
router.put('/:id', updateUser)
router.post('/:id/follow', follow)
router.delete('/:id/follow', unfollow)
router.get('/:id/follow-status', getFollowStatus)

module.exports = router