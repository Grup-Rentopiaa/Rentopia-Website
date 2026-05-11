const { prisma } = require('../lib/prisma')

const findAllItems = async ({ search, category, sort, min_price, max_price, lat, lng, ownerId }) => {
  const where = {}

  if (search?.trim()) {
    where.OR = [
      { title: { contains: search.trim(), mode: 'insensitive' } },
      { description: { contains: search.trim(), mode: 'insensitive' } },
    ]
  }

  if (category) {
    where.category_id = parseInt(category)
  }

  if (ownerId) {
    where.owner_id = parseInt(ownerId)
  }

  if (min_price || max_price) {
    where.price_per_day = {}
    if (min_price) where.price_per_day.gte = parseFloat(min_price)
    if (max_price) where.price_per_day.lte = parseFloat(max_price)
  }

  let orderBy = { created_at: 'desc' }
  if (sort === 'price_asc') orderBy = { price_per_day: 'asc' }
  if (sort === 'price_desc') orderBy = { price_per_day: 'desc' }

  const items = await prisma.item.findMany({
    where,
    orderBy,
    include: {
      category: { select: { name: true } },
      owner: { select: { username: true } },
    },
  })

  const result = items.map(item => ({
    ...item,
    category_name: item.category?.name || null,
    owner_name: item.owner?.username || null,
  }))

  if (sort === 'nearest' && lat && lng) {
    result.sort((a, b) => {
      const distA = a.latitude && a.longitude
        ? Math.pow(a.latitude - parseFloat(lat), 2) + Math.pow(a.longitude - parseFloat(lng), 2)
        : Infinity
      const distB = b.latitude && b.longitude
        ? Math.pow(b.latitude - parseFloat(lat), 2) + Math.pow(b.longitude - parseFloat(lng), 2)
        : Infinity
      return distA - distB
    })
  }

  return result
}

const findItemById = async (id) => {
  const item = await prisma.item.findUnique({
    where: { id: parseInt(id) },
    include: {
      category: { select: { name: true } },
      owner: { select: { username: true } },
    },
  })
  if (!item) return null
  return {
    ...item,
    category_name: item.category?.name || null,
    owner_name: item.owner?.username || null,
  }
}

const findAllCategories = async () => {
  return await prisma.category.findMany({ orderBy: { id: 'asc' } })
}

const createItem = async (ownerId, data) => {
  let category_id = null
  if (data.category) {
    let cat = await prisma.category.findFirst({ where: { name: data.category } })
    if (!cat) cat = await prisma.category.create({ data: { name: data.category } })
    category_id = cat.id
  }

  return await prisma.item.create({
    data: {
      title: data.title,
      description: data.description,
      price_per_day: parseFloat(data.price),
      location: data.location,
      image: data.image,
      category_id,
      owner_id: parseInt(ownerId)
    }
  })
}

const updateItem = async (id, ownerId, data) => {
  const existing = await prisma.item.findUnique({ where: { id: parseInt(id) } })
  if (!existing || existing.owner_id !== parseInt(ownerId)) return null

  let category_id = existing.category_id
  if (data.category) {
    let cat = await prisma.category.findFirst({ where: { name: data.category } })
    if (!cat) cat = await prisma.category.create({ data: { name: data.category } })
    category_id = cat.id
  }

  const updateData = {}
  if (data.title !== undefined) updateData.title = data.title
  if (data.description !== undefined) updateData.description = data.description
  if (data.price !== undefined) updateData.price_per_day = parseFloat(data.price)
  if (data.location !== undefined) updateData.location = data.location
  if (data.image !== undefined) updateData.image = data.image
  updateData.category_id = category_id

  return await prisma.item.update({
    where: { id: parseInt(id) },
    data: updateData
  })
}

const deleteItem = async (id, ownerId) => {
  const existing = await prisma.item.findUnique({ where: { id: parseInt(id) } })
  if (!existing || existing.owner_id !== parseInt(ownerId)) return null
  return await prisma.item.delete({ where: { id: parseInt(id) } })
}

module.exports = { findAllItems, findItemById, findAllCategories, createItem, updateItem, deleteItem }