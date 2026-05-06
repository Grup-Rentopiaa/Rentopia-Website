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
  try {
    return await userRepository.update(id, data)
  } catch (err) {
    if (err.code === 'P2002') {
      throw AppError.conflict('Username sudah digunakan, pilih yang lain.')
    }
    throw err
  }
},
}

module.exports = { userService }