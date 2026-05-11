const prisma = require('../lib/prisma')

const findAllItems = async ({ search, category, sort, min_price, max_price, lat, lng }) => {
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

module.exports = { findAllItems, findItemById, findAllCategories }