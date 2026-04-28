'use strict'
const { prisma } = require('../lib/prisma')

const userRepository = {
  async findById(id) {
    return prisma.user.findUnique({ where: { id } })
  },

  async create(data) {
    return prisma.user.create({ data })
  },

  async update(id, data) {
    return prisma.user.update({ where: { id }, data })
  },
}

module.exports = { userRepository }