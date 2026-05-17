const { prisma } = require('../lib/prisma')

// GET /api/search/users?q=
const searchUsers = async (req, res) => {
  try {
    const q = (req.query.q || '').trim()
    if (!q) return res.json([])
    const users = await prisma.users.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: 'insensitive' } },
          { name:     { contains: q, mode: 'insensitive' } },
        ],
      },
      select: { id: true, username: true, name: true, avatarB64: true, followers: true, city: true },
      take: 30,
    })
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/profile/:userId/followers
const getFollowers = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    const follows = await prisma.follows.findMany({
      where: { followingId: userId },
      include: { follower: { select: { id: true, username: true, name: true, avatarB64: true, followers: true, city: true } } },
    })
    res.json(follows.map(f => f.follower))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/profile/:userId/following
const getFollowing = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    const follows = await prisma.follows.findMany({
      where: { followerId: userId },
      include: { following: { select: { id: true, username: true, name: true, avatarB64: true, followers: true, city: true } } },
    })
    res.json(follows.map(f => f.following))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/profile/:userId/followers/:followerId  (remove someone from your followers)
const removeFollower = async (req, res) => {
  try {
    const userId     = parseInt(req.params.userId)     // the profile owner
    const followerId = parseInt(req.params.followerId) // person to remove

    const existing = await prisma.follows.findUnique({
      where: { followerId_followingId: { followerId, followingId: userId } }
    })
    if (!existing) return res.json({ message: 'Tidak ada hubungan follow' })

    await prisma.follows.delete({
      where: { followerId_followingId: { followerId, followingId: userId } }
    })
    // Decrement counters
    await prisma.users.update({ where: { id: userId },     data: { followers: { decrement: 1 } } })
    await prisma.users.update({ where: { id: followerId }, data: { following: { decrement: 1 } } })

    res.json({ message: 'Pengikut berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { searchUsers, getFollowers, getFollowing, removeFollower }
