const { prisma } = require('../lib/prisma')

const findByEmail = async (email) => {
    return await prisma.users.findUnique({
        where: {email: email}
    })
}
const findById = async (id) => {
    return await prisma.users.findUnique({
        where: { id: id }
    })
}
const createUser = async (username, email) => {
    return await prisma.users.create({
        data: {
            username: username,
            email: email
        }
    })
}
const createAuth = async (userId, hashedPassword) => {
    return await prisma.auth.create({
        data: {
            user_id : userId,
            password : hashedPassword
        }
    })
}
const findAuthByUserId = async (userId) => {
    return await prisma.auth.findUnique({
        where: {user_id: userId}
    })
}
const saveOtp = async (userId, otp, expiredAt) => {
    return await prisma.auth.update({
        where: { user_id: userId},
        data: {
            otp: otp,
            otp_expired_at: expiredAt
        }
    })
}
const findAuthByOtp = async (otp) => {
    return await prisma.auth.findFirst({
        where: {otp: otp}
    })
}
const updatePassword = async (userId, hashedPassword) => {
    return await prisma.auth.update({
        where: { user_id: userId },
        data: { password: hashedPassword }
    })
}

const updateProfile = async (id, data) => {
  return prisma.users.update({ where: { id }, data })
}

const followUser = async (followerId, followingId) => {
  if (followerId === followingId) throw new Error("Cannot follow yourself")
  
  
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.follows.findUnique({
      where: { followerId_followingId: { followerId, followingId } }
    })
    
    if (existing) return existing

    const follow = await tx.follows.create({
      data: { followerId, followingId }
    })

    
    await tx.users.update({
      where: { id: followingId },
      data: { followers: { increment: 1 } }
    })
    
    await tx.users.update({
      where: { id: followerId },
      data: { following: { increment: 1 } }
    })

    return follow
  })
}

const unfollowUser = async (followerId, followingId) => {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.follows.findUnique({
      where: { followerId_followingId: { followerId, followingId } }
    })
    
    if (!existing) return null

    await tx.follows.delete({
      where: { followerId_followingId: { followerId, followingId } }
    })

    
    await tx.users.update({
      where: { id: followingId },
      data: { followers: { decrement: 1 } }
    })
    
    await tx.users.update({
      where: { id: followerId },
      data: { following: { decrement: 1 } }
    })

    return true
  })
}

const checkFollowStatus = async (followerId, followingId) => {
  if (!followerId || !followingId) return false
  const existing = await prisma.follows.findUnique({
    where: { followerId_followingId: { followerId: parseInt(followerId), followingId: parseInt(followingId) } }
  })
  return !!existing
}

module.exports = { findByEmail, findById, createUser, createAuth, findAuthByUserId, saveOtp, findAuthByOtp, updatePassword, updateProfile, followUser, unfollowUser, checkFollowStatus }