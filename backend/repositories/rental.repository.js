'use strict'
const { prisma } = require('../lib/prisma')

const rentalRepository = {
    async findAll(userId) {
    return prisma.rental.findMany({
        where:   { userId: userId },
        orderBy: { createdAt: 'desc' },
    })
    },

    async create(userId, data) {
    return prisma.rental.create({
        data: { userId, ...data }
    })
    },

    async update(id, userId, data) {
    await prisma.rental.updateMany({
        where: { id: id, userId: userId },
        data,
    })
    return prisma.rental.findUnique({ 
        where: { id: id } 
    })
    },

    async delete(id, userId) {
    const result = await prisma.rental.deleteMany({
        where: { id: id, userId: userId }
    })
    return result.count > 0
    },
}

module.exports = { rentalRepository }