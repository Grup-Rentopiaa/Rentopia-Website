jest.mock('../models/user', () => ({
  findById: jest.fn(),
  updateProfile: jest.fn(),
  followUser: jest.fn(),
  unfollowUser: jest.fn(),
  checkFollowStatus: jest.fn(),
}))

jest.mock('../lib/prisma', () => ({
  prisma: {
    users: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    follows: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  }
}))

const { getUser, updateUser, follow, unfollow, getFollowStatus, searchUsers } = require('../controllers/user')
const { searchUsers: socialSearch, getFollowers, getFollowing, removeFollower } = require('../controllers/social')
const { findById, updateProfile, followUser, unfollowUser, checkFollowStatus } = require('../models/user')
const { prisma } = require('../lib/prisma')

const mockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}
const mockReq = (params = {}, body = {}, query = {}) => ({ params, body, query })

// ─────────────────────────────────────────────
// GET USER
// ─────────────────────────────────────────────
describe('getUser', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil ambil data user berdasarkan id', async () => {
    findById.mockResolvedValue({ id: 1, username: 'amel', email: 'amel@mail.com' })
    const req = mockReq({ id: '1' })
    const res = mockRes()
    await getUser(req, res)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }))
  })

  test('gagal jika user tidak ditemukan', async () => {
    findById.mockResolvedValue(null)
    const req = mockReq({ id: '99' })
    const res = mockRes()
    await getUser(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'User tidak ditemukan.' }))
  })
})

// ─────────────────────────────────────────────
// UPDATE USER
// ─────────────────────────────────────────────
describe('updateUser', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil update profil user', async () => {
    updateProfile.mockResolvedValue({ id: 1, username: 'amel_new' })
    const req = mockReq({ id: '1' }, { username: 'amel_new' })
    const res = mockRes()
    await updateUser(req, res)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ username: 'amel_new' }))
  })

  test('gagal jika username sudah digunakan (conflict)', async () => {
    updateProfile.mockRejectedValue({ code: 'P2002' })
    const req = mockReq({ id: '1' }, { username: 'sudah_ada' })
    const res = mockRes()
    await updateUser(req, res)
    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Username sudah digunakan.' }))
  })

  test('gagal jika data tidak valid (username terlalu pendek)', async () => {
    const req = mockReq({ id: '1' }, { username: 'ab' })
    const res = mockRes()
    await updateUser(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })
})

// ─────────────────────────────────────────────
// SEARCH USERS (user.js)
// ─────────────────────────────────────────────
describe('searchUsers (user)', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil cari user berdasarkan keyword', async () => {
    prisma.users.findMany.mockResolvedValue([{ id: 1, username: 'amel' }])
    const req = mockReq({}, {}, { search: 'amel' })
    const res = mockRes()
    await searchUsers(req, res)
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ username: 'amel' })]))
  })

  test('return array kosong jika keyword kosong', async () => {
    const req = mockReq({}, {}, { search: '' })
    const res = mockRes()
    await searchUsers(req, res)
    expect(res.json).toHaveBeenCalledWith([])
  })
})

// ─────────────────────────────────────────────
// FOLLOW
// ─────────────────────────────────────────────
describe('follow', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil follow user', async () => {
    followUser.mockResolvedValue({})
    const req = mockReq({ id: '2' }, { followerId: 1 })
    const res = mockRes()
    await follow(req, res)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Followed successfully' }))
  })

  test('gagal jika followerId tidak ada', async () => {
    const req = mockReq({ id: '2' }, {})
    const res = mockRes()
    await follow(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })
})

// ─────────────────────────────────────────────
// UNFOLLOW
// ─────────────────────────────────────────────
describe('unfollow', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil unfollow user', async () => {
    unfollowUser.mockResolvedValue({})
    const req = mockReq({ id: '2' }, { followerId: 1 })
    const res = mockRes()
    await unfollow(req, res)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Unfollowed successfully' }))
  })

  test('gagal jika followerId tidak ada', async () => {
    const req = mockReq({ id: '2' }, {})
    const res = mockRes()
    await unfollow(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })
})

// ─────────────────────────────────────────────
// GET FOLLOW STATUS
// ─────────────────────────────────────────────
describe('getFollowStatus', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil cek status follow', async () => {
    checkFollowStatus.mockResolvedValue(true)
    const req = mockReq({ id: '2' }, {}, { followerId: '1' })
    const res = mockRes()
    await getFollowStatus(req, res)
    expect(res.json).toHaveBeenCalledWith({ isFollowing: true })
  })

  test('return false jika belum follow', async () => {
    checkFollowStatus.mockResolvedValue(false)
    const req = mockReq({ id: '2' }, {}, { followerId: '1' })
    const res = mockRes()
    await getFollowStatus(req, res)
    expect(res.json).toHaveBeenCalledWith({ isFollowing: false })
  })
})

// ─────────────────────────────────────────────
// SOCIAL - SEARCH USERS
// ─────────────────────────────────────────────
describe('searchUsers (social)', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil cari user', async () => {
    prisma.users.findMany.mockResolvedValue([{ id: 1, username: 'amel', city: 'Surabaya' }])
    const req = mockReq({}, {}, { q: 'amel' })
    const res = mockRes()
    await socialSearch(req, res)
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ username: 'amel' })]))
  })

  test('return array kosong jika query kosong', async () => {
    const req = mockReq({}, {}, { q: '' })
    const res = mockRes()
    await socialSearch(req, res)
    expect(res.json).toHaveBeenCalledWith([])
  })
})

// ─────────────────────────────────────────────
// SOCIAL - GET FOLLOWERS
// ─────────────────────────────────────────────
describe('getFollowers', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil ambil daftar followers', async () => {
    prisma.follows.findMany.mockResolvedValue([
      { follower: { id: 2, username: 'budi', city: 'Jakarta' } }
    ])
    const req = mockReq({ userId: '1' })
    const res = mockRes()
    await getFollowers(req, res)
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ username: 'budi' })])
    )
  })
})

// ─────────────────────────────────────────────
// SOCIAL - GET FOLLOWING
// ─────────────────────────────────────────────
describe('getFollowing', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil ambil daftar following', async () => {
    prisma.follows.findMany.mockResolvedValue([
      { following: { id: 3, username: 'citra', city: 'Bandung' } }
    ])
    const req = mockReq({ userId: '1' })
    const res = mockRes()
    await getFollowing(req, res)
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ username: 'citra' })])
    )
  })
})

// ─────────────────────────────────────────────
// SOCIAL - REMOVE FOLLOWER
// ─────────────────────────────────────────────
describe('removeFollower', () => {
  beforeEach(() => jest.clearAllMocks())

  test('berhasil hapus follower', async () => {
    prisma.follows.findUnique.mockResolvedValue({ followerId: 2, followingId: 1 })
    prisma.follows.delete.mockResolvedValue({})
    prisma.users.update.mockResolvedValue({})

    const req = mockReq({ userId: '1', followerId: '2' })
    const res = mockRes()
    await removeFollower(req, res)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Pengikut berhasil dihapus' }))
  })

  test('return pesan jika tidak ada hubungan follow', async () => {
    prisma.follows.findUnique.mockResolvedValue(null)
    const req = mockReq({ userId: '1', followerId: '99' })
    const res = mockRes()
    await removeFollower(req, res)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Tidak ada hubungan follow' }))
  })
})