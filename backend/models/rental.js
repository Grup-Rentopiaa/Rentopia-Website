const { prisma } = require('../lib/prisma')

const findAll = async (userId) => {
  return prisma.rental.findMany({
    where:   { userId },
    orderBy: { createdAt: 'desc' },
  })
}

const create = async (userId, data) => {
  return prisma.rental.create({ data: { userId, ...data } })
}

const update = async (id, userId, data) => {
  await prisma.rental.updateMany({ where: { id, userId }, data })
  return prisma.rental.findUnique({ where: { id } })
}

const remove = async (id, userId) => {
  const result = await prisma.rental.deleteMany({ where: { id, userId } })
  return result.count > 0
}

module.exports = { findAll, create, update, remove }