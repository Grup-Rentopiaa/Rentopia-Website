'use strict'
const { listingRepository } = require('../repositories/listing.repository')
const { AppError }          = require('../lib/AppError')

const listingService = {

  async getAll(userId) {
    return listingRepository.findAll(userId)
  },

  async create(userId, data) {
    // Tantangan 2:
    return listingRepository.create(userId, data)
    // (validasi user akan ditambah di Sprint 4)
  },

  async update(id, userId, data) {
    const listing = await listingRepository.update(id, userId, data)
    if (!listing) throw AppError.notFound('Listing tidak ditemukan.')
    return listing
  },

  async delete(id, userId) {
    const deleted = await listingRepository.delete(id, userId)
    if (!deleted) throw AppError.notFound('Listing tidak ditemukan.')
    return { id }
  },

}

module.exports = { listingService }