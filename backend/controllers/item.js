const { findAllItems, findItemById, findAllCategories, createItem, updateItem, deleteItem, toggleLike, updateItemStatus } = require('../models/item')

const getItems = async (req, res) => {
  try {
    const items = await findAllItems(req.query)
    res.status(200).json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getItemById = async (req, res) => {
  try {
    const item = await findItemById(req.params.id)
    if (!item) return res.status(404).json({ message: 'Item tidak ditemukan' })
    res.status(200).json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getCategories = async (req, res) => {
  try {
    const categories = await findAllCategories()
    res.status(200).json(categories)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const createNewItem = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    const result = await createItem(userId, req.body)
    res.status(201).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const updateExistingItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const userId = parseInt(req.params.userId)
    const result = await updateItem(id, userId, req.body)
    if (!result) return res.status(404).json({ message: 'Item tidak ditemukan atau Anda tidak memiliki akses.' })
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const removeExistingItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const userId = parseInt(req.params.userId)
    const deleted = await deleteItem(id, userId)
    if (!deleted) return res.status(404).json({ message: 'Item tidak ditemukan atau Anda tidak memiliki akses.' })
    res.json({ id })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const likeItem = async (req, res) => {
  try {
    const itemId = parseInt(req.params.id)
    const userId = parseInt(req.body.userId)
    const result = await toggleLike(itemId, userId)
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { status } = req.body
    const result = await updateItemStatus(id, status)
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { 
  getItems, 
  getItemById, 
  getCategories, 
  createNewItem, 
  updateExistingItem, 
  removeExistingItem,
  likeItem,
  updateStatus
}