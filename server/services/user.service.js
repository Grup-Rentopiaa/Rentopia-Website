'use strict'
const { userRepository } = require('../repositories/user.repository')
const { AppError }        = require('../lib/AppError')

const userService = {
  async getById(id) {
    const user = await userRepository.findById(id)
    if (!user) throw AppError.notFound('User tidak ditemukan.')
    return user
  },

  async create(data) {
    return userRepository.create(data)
  },

  async update(id, data) {
    await userService.getById(id)
    return userRepository.update(id, data)
  },
}

module.exports = { userService }