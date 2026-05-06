'use strict'
const { userService }                    = require('../services/user.service')
const { CreateUserSchema, UpdateUserSchema } = require('../lib/schemas')

const userController = {
  async getOne(req, res, next) {
    try {
      res.json(await userService.getById(parseInt(req.params.id)))
    } catch (err) { next(err) }
  },

  async create(req, res, next) {
    try {
      const data = CreateUserSchema.parse(req.body)
      res.status(201).json(await userService.create(data))
    } catch (err) { next(err) }
  },

  async update(req, res, next) {
    try {
      const data = UpdateUserSchema.parse(req.body)
      res.json(await userService.update(parseInt(req.params.id), data))
    } catch (err) { next(err) }
  },
}

module.exports = { userController }