jest.mock('../models/item', () => ({
findAllItems: jest.fn(),
findLikedItems: jest.fn(),
findItemById: jest.fn(),
findAllCategories: jest.fn(),
createItem: jest.fn(),
updateItem: jest.fn(),
deleteItem: jest.fn(),
toggleLike: jest.fn(),
updateItemStatus: jest.fn(),
clearWishlist: jest.fn(),
}))

jest.mock('../lib/prisma', () => ({
prisma: {
    review: {
        findMany: jest.fn(),
        create: jest.fn(),
    },
    item: {
        findUnique: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(), // <-- TAMBAHKAN BARIS INI YA
    },
    users: {
        update: jest.fn(),
    },
    follows: {
        findMany: jest.fn(),
    },
}
}))

const {
getItems, getLikedItems, getItemById, getCategories,
createNewItem, updateExistingItem, removeExistingItem,
likeItem, clearAllLikedItems, updateStatus,
getReviews, createReview, getFollowingFeed,
} = require('../controllers/item')

const {
findAllItems, findLikedItems, findItemById, findAllCategories,
createItem, updateItem, deleteItem, toggleLike,
updateItemStatus, clearWishlist,
} = require('../models/item')

const { prisma } = require('../lib/prisma')

const mockRes = () => {
const res = {}
res.status = jest.fn().mockReturnValue(res)
res.json = jest.fn().mockReturnValue(res)
return res
}
const mockReq = (params = {}, body = {}, query = {}) => ({ params, body, query })

// ─────────────────────────────────────────────
// GET ITEMS
// ─────────────────────────────────────────────
describe('getItems', () => {
beforeEach(() => jest.clearAllMocks())

test('berhasil ambil semua item', async () => {
    findAllItems.mockResolvedValue([{ id: 1, title: 'Kamera' }])
    const req = mockReq({}, {}, {})
    const res = mockRes()
    await getItems(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ title: 'Kamera' })]))
})
})

// ─────────────────────────────────────────────
// GET LIKED ITEMS (WISHLIST)
// ─────────────────────────────────────────────
describe('getLikedItems', () => {
beforeEach(() => jest.clearAllMocks())

test('berhasil ambil wishlist user', async () => {
    findLikedItems.mockResolvedValue([{ id: 1, title: 'Kamera' }])
    const req = mockReq({ userId: '1' })
    const res = mockRes()
    await getLikedItems(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ id: 1 })]))
})

test('gagal jika userId tidak ada', async () => {
    const req = mockReq({}, {}, {})
    const res = mockRes()
    await getLikedItems(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
})
})

// ─────────────────────────────────────────────
// GET ITEM BY ID
// ─────────────────────────────────────────────
describe('getItemById', () => {
beforeEach(() => jest.clearAllMocks())

test('berhasil ambil item berdasarkan id', async () => {
    findItemById.mockResolvedValue({ id: 1, title: 'Kamera' })
    const req = mockReq({ id: '1' })
    const res = mockRes()
    await getItemById(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }))
})

test('gagal jika item tidak ditemukan', async () => {
    findItemById.mockResolvedValue(null)
    const req = mockReq({ id: '99' })
    const res = mockRes()
    await getItemById(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
})
})

// ─────────────────────────────────────────────
// GET CATEGORIES
// ─────────────────────────────────────────────
describe('getCategories', () => {
beforeEach(() => jest.clearAllMocks())

test('berhasil ambil semua kategori', async () => {
    findAllCategories.mockResolvedValue([{ id: 1, name: 'Kamera' }])
    const req = mockReq()
    const res = mockRes()
    await getCategories(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
})
})

// ─────────────────────────────────────────────
// CREATE ITEM
// ─────────────────────────────────────────────
describe('createNewItem', () => {
beforeEach(() => jest.clearAllMocks())

test('berhasil buat item baru', async () => {
    createItem.mockResolvedValue({ id: 1, title: 'Kamera Baru' })
    const req = mockReq({ userId: '1' }, { title: 'Kamera Baru', price_per_day: 50000 })
    const res = mockRes()
    await createNewItem(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Kamera Baru' }))
})
})

// ─────────────────────────────────────────────
// UPDATE ITEM
// ─────────────────────────────────────────────
describe('updateExistingItem', () => {
beforeEach(() => jest.clearAllMocks())

test('berhasil update item', async () => {
    updateItem.mockResolvedValue({ id: 1, title: 'Kamera Updated' })
    const req = mockReq({ id: '1', userId: '1' }, { title: 'Kamera Updated' })
    const res = mockRes()
    await updateExistingItem(req, res)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Kamera Updated' }))
})

test('gagal jika item tidak ditemukan', async () => {
    updateItem.mockResolvedValue(null)
    const req = mockReq({ id: '99', userId: '1' }, {})
    const res = mockRes()
    await updateExistingItem(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
})
})

// ─────────────────────────────────────────────
// DELETE ITEM
// ─────────────────────────────────────────────
describe('removeExistingItem', () => {
beforeEach(() => jest.clearAllMocks())

test('berhasil hapus item', async () => {
    deleteItem.mockResolvedValue(true)
    const req = mockReq({ id: '1', userId: '1' })
    const res = mockRes()
    await removeExistingItem(req, res)
    expect(res.json).toHaveBeenCalledWith({ id: 1 })
})

test('gagal jika item tidak ditemukan', async () => {
    deleteItem.mockResolvedValue(false)
    const req = mockReq({ id: '99', userId: '1' })
    const res = mockRes()
    await removeExistingItem(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
})
})

// ─────────────────────────────────────────────
// LIKE ITEM (WISHLIST TOGGLE)
// ─────────────────────────────────────────────
describe('likeItem', () => {
beforeEach(() => jest.clearAllMocks())

test('berhasil toggle like item', async () => {
    toggleLike.mockResolvedValue({ liked: true })
    const req = mockReq({ id: '1' }, { userId: 1 })
    const res = mockRes()
    await likeItem(req, res)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ liked: true }))
})
})

// ─────────────────────────────────────────────
// CLEAR WISHLIST
// ─────────────────────────────────────────────
describe('clearAllLikedItems', () => {
beforeEach(() => jest.clearAllMocks())

test('berhasil hapus semua wishlist', async () => {
    clearWishlist.mockResolvedValue({ deleted: 3 })
    const req = mockReq({}, {}, { userId: '1' })
    const res = mockRes()
    await clearAllLikedItems(req, res)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ deleted: 3 }))
})

test('gagal jika userId tidak ada', async () => {
    const req = mockReq({}, {}, {})
    const res = mockRes()
    await clearAllLikedItems(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
})
})

// ─────────────────────────────────────────────
// UPDATE STATUS
// ─────────────────────────────────────────────
describe('updateStatus', () => {
beforeEach(() => jest.clearAllMocks())

test('berhasil update status item', async () => {
    updateItemStatus.mockResolvedValue({ id: 1, status: 'rented' })
    const req = mockReq({ id: '1' }, { status: 'rented' })
    const res = mockRes()
    await updateStatus(req, res)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'rented' }))
})
})

// ─────────────────────────────────────────────
// GET REVIEWS
// ─────────────────────────────────────────────
describe('getReviews', () => {
beforeEach(() => jest.clearAllMocks())

test('berhasil ambil review item', async () => {
    prisma.review.findMany.mockResolvedValue([{ id: 1, rating: 5, comment: 'Bagus!' }])
    const req = mockReq({ id: '1' })
    const res = mockRes()
    await getReviews(req, res)
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ rating: 5 })]))
})
})

// ─────────────────────────────────────────────
// CREATE REVIEW
// ─────────────────────────────────────────────
describe('createReview', () => {
beforeEach(() => jest.clearAllMocks())

test('berhasil buat review', async () => {
    prisma.review.create.mockResolvedValue({ id: 1, rating: 5, comment: 'Bagus!' })
    prisma.review.findMany.mockResolvedValue([{ rating: 5 }])
    prisma.item.findUnique.mockResolvedValue({ id: 1, owner_id: 2 })
    prisma.users.update.mockResolvedValue({})

    const req = mockReq({ id: '1' }, { userId: 1, rating: 5, comment: 'Bagus!' })
    const res = mockRes()
    await createReview(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
})

test('gagal jika field tidak lengkap', async () => {
    const req = mockReq({ id: '1' }, { userId: 1 })
    const res = mockRes()
    await createReview(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
})
})

// ─────────────────────────────────────────────
// GET FOLLOWING FEED
// ─────────────────────────────────────────────
describe('getFollowingFeed', () => {
beforeEach(() => jest.clearAllMocks())

test('berhasil ambil feed dari user yang diikuti', async () => {
    prisma.follows.findMany.mockResolvedValue([{ followingId: 2 }])

    // DI SINI: Ubah dari prisma.items menjadi prisma.item
    prisma.item.findMany.mockResolvedValue([
        { id: 1, title: 'Kamera', price_per_day: 75000, category: { name: 'Foto' }, likes: [] }
    ])

    const req = mockReq({ userId: '1' })
    const res = mockRes()
    await getFollowingFeed(req, res)
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ id: 1 })]))
})

test('return array kosong jika tidak mengikuti siapapun', async () => {
    prisma.follows.findMany.mockResolvedValue([])
    const req = mockReq({ userId: '1' })
    const res = mockRes()
    await getFollowingFeed(req, res)
    expect(res.json).toHaveBeenCalledWith([])
})

test('return array kosong jika userId tidak ada', async () => {
    const req = mockReq({ userId: '0' })
    const res = mockRes()
    await getFollowingFeed(req, res)
    expect(res.json).toHaveBeenCalledWith([])
})
})