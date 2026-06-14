const { saveVisitor, getAllVisitors } = require('../models/visitor')

const trackVisitor = async (req, res) => {
    const { visitorId, page, path, browser, language, screenWidth, screenHeight, visitedAt, consent, location } = req.body

    if (!visitorId || !page || !visitedAt) {
        return res.status(400).json({ message: 'Data tidak lengkap' })
    }

    await saveVisitor(visitorId, page, path, browser, language, screenWidth, screenHeight, visitedAt, consent, location)
    res.status(201).json({ message: 'Data pengunjung berhasil disimpan' })
}

const getVisitors = async (req, res) => {
    const data = await getAllVisitors()
    res.status(200).json(data)
}

module.exports = { trackVisitor, getVisitors }