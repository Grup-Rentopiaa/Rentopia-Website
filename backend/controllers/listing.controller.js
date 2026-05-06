'use strict'
const { listingService } = require('../services/listing.service')
const { ListingSchema }  = require('../lib/schemas')

const listingController = {

  async getAll(req, res, next) {
    try {
      const userId = parseInt(req.query.userId)
      const data   = await listingService.getAll(userId)
      res.json(data)
    } catch (err) { next(err) }
  },

  async create(req, res, next) {
    try {
      const userId = parseInt(req.params.userId)
      const data   = ListingSchema.parse(req.body)
      const result = await listingService.create(userId, data)
      res.status(201).json(result)
    } catch (err) { next(err) }
  },

  async update(req, res, next) {
    try {
      const id     = parseInt(req.params.id)
      const userId = parseInt(req.params.userId)
      const data   = ListingSchema.parse(req.body)
      const result = await listingService.update(id, userId, data)
      res.json(result)
    } catch (err) { next(err) }
  },

  async delete(req, res, next) {
    try {
      const id     = parseInt(req.params.id)
      const userId = parseInt(req.params.userId)
      const result = await listingService.delete(id, userId)
      res.json(result)
    } catch (err) { next(err) }
  },

}

module.exports = { listingController }