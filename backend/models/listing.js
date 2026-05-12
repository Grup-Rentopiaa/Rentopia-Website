const { prisma } = require('../lib/prisma')

const findAll = async (userId) => {
  return prisma.listing.findMany({
    where:   { userId },
    orderBy: { createdAt: 'desc' },
  })
}

const create = async (userId, data) => {
  return prisma.listing.create({ data: { userId, ...data } })
}

const update = async (id, userId, data) => {
  await prisma.listing.updateMany({ where: { id, userId }, data })
  return prisma.listing.findUnique({ where: { id } })
}

const remove = async (id, userId) => {
  const result = await prisma.listing.deleteMany({ where: { id, userId } })
  return result.count > 0
}

module.exports = { findAll, create, update, remove }