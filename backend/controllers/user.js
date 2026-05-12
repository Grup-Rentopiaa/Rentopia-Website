const { z } = require('zod')
const { findById, updateProfile, followUser, unfollowUser, checkFollowStatus } = require('../models/user')

const UpdateUserSchema = z.object({
  username:    z.string().min(3).max(64).regex(/^\w+$/, 'Hanya huruf, angka, underscore').optional(),
  name:        z.string().max(128).nullable().optional(),
  city:        z.string().max(64).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  phone:       z.string().max(20).nullable().optional(),
  avatarB64:   z.string().nullable().optional(),
})

const getUser = async (req, res) => {
  try {
    const user = await findById(parseInt(req.params.id))
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const data = UpdateUserSchema.parse(req.body)
    const user = await updateProfile(parseInt(req.params.id), data)
    res.json(user)
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Username sudah digunakan.' })
    }
    res.status(400).json({ message: err.message })
  }
}

const follow = async (req, res) => {
  try {
    const followingId = parseInt(req.params.id)
    const followerId = parseInt(req.body.followerId)
    if (!followerId) return res.status(400).json({ message: 'followerId required' })
    await followUser(followerId, followingId)
    res.json({ message: 'Followed successfully' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const unfollow = async (req, res) => {
  try {
    const followingId = parseInt(req.params.id)
    const followerId = parseInt(req.body.followerId)
    if (!followerId) return res.status(400).json({ message: 'followerId required' })
    await unfollowUser(followerId, followingId)
    res.json({ message: 'Unfollowed successfully' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const getFollowStatus = async (req, res) => {
  try {
    const followingId = parseInt(req.params.id)
    const followerId = parseInt(req.query.followerId)
    const isFollowing = await checkFollowStatus(followerId, followingId)
    res.json({ isFollowing })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

module.exports = { getUser, updateUser, follow, unfollow, getFollowStatus }