const { findAllItems, findItemById, findAllCategories } = require('../models/item')

const getItems = async (req, res) => {
  const items = await findAllItems(req.query)
  res.status(200).json(items)
}

const getItemById = async (req, res) => {
  const item = await findItemById(req.params.id)
  if (!item) return res.status(404).json({ message: 'Item tidak ditemukan' })
  res.status(200).json(item)
}

const getCategories = async (req, res) => {
  const categories = await findAllCategories()
  res.status(200).json(categories)
}

module.exports = { getItems, getItemById, getCategories }