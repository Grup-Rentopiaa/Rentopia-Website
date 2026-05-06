'use strict'
const { rentalService } = require('../services/rental.service')
const { RentalSchema }  = require('../lib/schemas')

const rentalController = {

  async getAll(req, res, next) {
    try {
      const userId = parseInt(req.query.userId)
      const data   = await rentalService.getAll(userId)
      res.json(data)
    } catch (err) { next(err) }
  },

  async create(req, res, next) {
    try {
      const userId = parseInt(req.params.userId)
      const data   = RentalSchema.parse(req.body)
      const result = await rentalService.create(userId, data)
      res.status(201).json(result)
    } catch (err) { next(err) }
  },

  async update(req, res, next) {
    try {
      const id     = parseInt(req.params.id)
      const userId = parseInt(req.params.userId)
      const data   = RentalSchema.parse(req.body)
      const result = await rentalService.update(id, userId, data)
      res.json(result)
    } catch (err) { next(err) }
  },

  async delete(req, res, next) {
    try {
      const id     = parseInt(req.params.id)
      const userId = parseInt(req.params.userId)
      const result = await rentalService.delete(id, userId)
      res.json(result)
    } catch (err) { next(err) }
  },

}

module.exports = { rentalController }