const { 
  findAllItems, 
  findLikedItems,
  findItemById, 
  findAllCategories, 
  createItem, 
  updateItem, 
  deleteItem, 
  toggleLike, 
  updateItemStatus,
  clearWishlist
} = require('../models/item')
const { prisma } = require('../lib/prisma')
const { getCityCoords, haversine } = require('../utils/cityCoords')

const getItems = async (req, res) => {
  try {
    const { sort, userId } = req.query

    // Kalau nearest, lookup koordinat user dulu
    if (sort === 'nearest') {
  console.log('========== NEAREST REQUEST ==========')
  console.log('QUERY:', req.query)

  if (!userId) {
    console.log('ERROR: userId kosong')
    return res.status(200).json({ empty: true, reason: 'no_city' })
  }

  const user = await prisma.users.findUnique({
    where: { id: parseInt(userId) },
    select: { city: true }
  })

  console.log('USER:', user)

  if (!user?.city) {
    console.log('ERROR: user.city kosong')
    return res.status(200).json({ empty: true, reason: 'no_city' })
  }

  const userCoords = await getCityCoords(user.city)

  console.log('USER CITY:', user.city)
  console.log('USER COORDS:', userCoords)

  if (!userCoords) {
    console.log('ERROR: kota user tidak ditemukan')
    return res.status(200).json({ empty: true, reason: 'city_not_found' })
  }

  const items = await findAllItems({
    ...req.query,
    sort: 'random'
  })

  console.log('TOTAL ITEMS:', items.length)

  if (items.length > 0) {
    console.log('FIRST ITEM:')
    console.dir(items[0], { depth: null })
  }

  const withDistance = await Promise.all(
    items.map(async (item, index) => {

      console.log(`\nITEM #${index + 1}`)
      console.log('ID:', item.id)
      console.log('LOCATION:', item.location)

      const itemCoords = await getCityCoords(item.location)

      console.log('ITEM COORDS:', itemCoords)

      const distance = itemCoords
        ? haversine(
            userCoords.lat,
            userCoords.lng,
            itemCoords.lat,
            itemCoords.lng
          )
        : Infinity

      console.log('DISTANCE:', distance)

      return {
        ...item,
        distance
      }
    })
  )

  withDistance.sort((a, b) => a.distance - b.distance)

  console.log('SORTED SUCCESS')
  console.log('RESULT COUNT:', withDistance.length)

  return res.status(200).json(withDistance)
}

    const items = await findAllItems(req.query)
    res.status(200).json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getLikedItems = async (req, res) => {
  try {
    const userId = req.params.userId || req.query.userId
    if (!userId) return res.status(400).json({ message: 'User ID diperlukan' })
    const items = await findLikedItems(userId)
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
    const userId = req.user?.userId  
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

const clearAllLikedItems = async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId
    if (!userId) return res.status(400).json({ message: 'User ID diperlukan' })
    const result = await clearWishlist(userId)
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

const getReviews = async (req, res) => {
  try {
    const itemId = parseInt(req.params.id)
    const reviews = await prisma.review.findMany({
      where: { itemId },
      include: {
        user: { select: { username: true, name: true, avatarB64: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const createReview = async (req, res) => {
  try {
    const itemId = parseInt(req.params.id)
    const userId = parseInt(req.body.userId)
    const { rating, comment } = req.body

    if (!userId || !rating || !comment) return res.status(400).json({ message: 'Missing fields' })

    const review = await prisma.review.create({
      data: { itemId, userId, rating: parseInt(rating), comment }
    })

    const allReviews = await prisma.review.findMany({ where: { itemId } })
    if (allReviews.length > 0) {
      const item = await prisma.item.findUnique({ where: { id: itemId } })
      if (item && item.owner_id) {
        const ownerReviews = await prisma.review.findMany({
          where: { item: { owner_id: item.owner_id } }
        })
        const avgRating = ownerReviews.reduce((sum, r) => sum + r.rating, 0) / ownerReviews.length
        await prisma.users.update({
          where: { id: item.owner_id },
          data: { rating: avgRating }
        })
      }
    }

    res.status(201).json(review)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getFollowingFeed = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    if (!userId) return res.json([])

    const follows = await prisma.follows.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    })
    const followingIds = follows.map(f => f.followingId)
    if (followingIds.length === 0) return res.json([])

    const items = await prisma.item.findMany({
      where: { owner_id: { in: followingIds } },
      include: {
        category: { select: { name: true } },
        owner: { select: { id: true, username: true, avatarB64: true } },
        likes: true,
      },
      orderBy: { created_at: 'desc' },
      take: 50,
    })

    const result = items.map(i => ({
      ...i,
      category_name: i.category?.name || null,
      price_per_day: Number(i.price_per_day),
    }))
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { 
  getItems, 
  getLikedItems,
  getItemById, 
  getCategories, 
  createNewItem, 
  updateExistingItem, 
  removeExistingItem,
  likeItem,
  updateStatus,
  clearAllLikedItems,
  getReviews,
  createReview,
  getFollowingFeed,
}