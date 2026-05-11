const { z } = require('zod')
const { findAll, create, update, remove } = require('../models/listing')

const ListingSchema = z.object({
  title:    z.string().min(1, 'Title wajib diisi').max(255),
  price:    z.string().min(1, 'Price wajib diisi').max(64),
  brand:    z.string().min(1, 'Brand wajib diisi').max(64),
  category: z.string().max(64).default('Lainnya'),
  image:    z.string().nullable().optional(),
  status:   z.enum(['available', 'rented']).default('available'),
})

const getAll = async (req, res) => {
  try {
    const userId = parseInt(req.query.userId)
    const data = await findAll(userId)
    res.json(data)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const createListing = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    const data = ListingSchema.parse(req.body)
    const result = await create(userId, data)
    res.status(201).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const updateListing = async (req, res) => {
  try {
    const id     = parseInt(req.params.id)
    const userId = parseInt(req.params.userId)
    const data   = ListingSchema.parse(req.body)
    const result = await update(id, userId, data)
    if (!result) return res.status(404).json({ message: 'Listing tidak ditemukan.' })
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const deleteListing = async (req, res) => {
  try {
    const id     = parseInt(req.params.id)
    const userId = parseInt(req.params.userId)
    const deleted = await remove(id, userId)
    if (!deleted) return res.status(404).json({ message: 'Listing tidak ditemukan.' })
    res.json({ id })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getAll, createListing, updateListing, deleteListing }