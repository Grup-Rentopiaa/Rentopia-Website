const { findAllKeywords, createKeyword, findKeywordByText, deleteKeywordById } = require('../models/keyword')

const getKeywords = async (req, res) => {
  const keywords = await findAllKeywords()
  res.status(200).json(keywords)
}

const postKeyword = async (req, res) => {
  const { keyword } = req.body
  if (!keyword?.trim()) {
    return res.status(400).json({ message: 'Keyword tidak boleh kosong' })
  }

  const existing = await findKeywordByText(keyword.trim())
  if (existing) {
    return res.status(400).json({ message: 'Keyword sudah tersimpan' })
  }

  const saved = await createKeyword(keyword.trim())
  res.status(201).json(saved)
}

const removeKeyword = async (req, res) => {
  await deleteKeywordById(req.params.id)
  res.status(200).json({ message: 'Keyword dihapus' })
}

module.exports = { getKeywords, postKeyword, removeKeyword }