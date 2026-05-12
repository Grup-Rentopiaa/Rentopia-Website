'use strict'
const { rentalRepository } = require('../repositories/rental.repository')
const { AppError }          = require('../lib/AppError')

const rentalService = {

  async getAll(userId) {
    return rentalRepository.findAll(userId)
  },

  async create(userId, data) {
    // Tantangan 2:
    return rentalRepository.create(userId, data)
    // (validasi user akan ditambah di Sprint 4)
  },

  async update(id, userId, data) {
    const rental = await rentalRepository.update(id, userId, data)
    if (!rental) throw AppError.notFound('Rental tidak ditemukan.')
    return rental
  },

  async delete(id, userId) {
    const deleted = await rentalRepository.delete(id, userId)
    if (!deleted) throw AppError.notFound('Rental tidak ditemukan.')
    return { id }
  },

}

module.exports = { rentalService }