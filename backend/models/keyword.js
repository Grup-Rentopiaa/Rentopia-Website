const prisma = require('../lib/prisma')

const findAllKeywords = async () => {
  return await prisma.savedKeyword.findMany({ orderBy: { created_at: 'desc' } })
}

const createKeyword = async (keyword) => {
  return await prisma.savedKeyword.create({ data: { keyword } })
}

const findKeywordByText = async (keyword) => {
  return await prisma.savedKeyword.findFirst({
    where: { keyword: { equals: keyword, mode: 'insensitive' } },
  })
}

const deleteKeywordById = async (id) => {
  return await prisma.savedKeyword.delete({ where: { id: parseInt(id) } })
}

module.exports = { findAllKeywords, createKeyword, findKeywordByText, deleteKeywordById }