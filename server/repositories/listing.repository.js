'use strict'
const { prisma } = require('../lib/prisma')

const listingRepository = {
  async findAll(userId) {
    return prisma.listing.findMany({
      where:   { userId },
      orderBy: { createdAt: 'desc' },
    })
  },

  async create(userId, data) {
    return prisma.listing.create({ data: { userId, ...data } })
  },

  async update(id, userId, data) {
    await prisma.listing.updateMany({ where: { id, userId }, data })
    return prisma.listing.findUnique({ where: { id } })
  },

  async delete(id, userId) {
    const result = await prisma.listing.deleteMany({ where: { id, userId } })
    return result.count > 0
  },
}

module.exports = { listingRepository }