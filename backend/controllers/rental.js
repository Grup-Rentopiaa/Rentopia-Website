const { z } = require('zod')
const { findAll, create, update, remove } = require('../models/rental')

const RentalSchema = z.object({
  title:  z.string().min(1, 'Title wajib diisi').max(255),
  price:  z.string().min(1, 'Price wajib diisi').max(64),
  store:  z.string().min(1, 'Store wajib diisi').max(128),
  status: z.enum(['ongoing', 'done', 'urgent']).default('ongoing'),
  note:   z.string().max(128).optional(),
  itemId: z.number().optional(),
  image:  z.string().optional()
})

const getAll = async (req, res) => {
  try {
    const userId = parseInt(req.query.userId)
    res.json(await findAll(userId))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const createRental = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    const data   = RentalSchema.parse(req.body)
    res.status(201).json(await create(userId, data))
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const updateRental = async (req, res) => {
  try {
    const id     = parseInt(req.params.id)
    const userId = parseInt(req.params.userId)
    const data   = RentalSchema.parse(req.body)
    const result = await update(id, userId, data)
    if (!result) return res.status(404).json({ message: 'Rental tidak ditemukan.' })
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const deleteRental = async (req, res) => {
  try {
    const id     = parseInt(req.params.id)
    const userId = parseInt(req.params.userId)
    const deleted = await remove(id, userId)
    if (!deleted) return res.status(404).json({ message: 'Rental tidak ditemukan.' })
    res.json({ id })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getAll, createRental, updateRental, deleteRental }