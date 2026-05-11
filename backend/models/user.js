const prisma = require('../lib/prisma')

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
module.exports = { findByEmail, findById, createUser, createAuth, findAuthByUserId, saveOtp, findAuthByOtp, updatePassword, updateProfile }