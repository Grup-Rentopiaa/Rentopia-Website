const { prisma } = require('../lib/prisma')

// ─────────────────────────────────────────────
// GET ALL VISITORS (untuk grafik admin)
// ─────────────────────────────────────────────
const getVisitorStats = async (req, res) => {
  try {
    const visitors = await prisma.visitor.findMany({
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        visitor_id: true,
        page: true,
        path: true,
        browser: true,
        language: true,
        city: true,
        country: true,
        latitude: true,
        longitude: true,
        visited_at: true,
        created_at: true,
        consent_necessary: true,
        consent_preferences: true,
        consent_statistics: true,
        consent_marketing: true,
      }
    })

    // Hitung pengunjung per hari
    const perDay = {}
    visitors.forEach(v => {
      const date = new Date(v.created_at).toISOString().split('T')[0]
      perDay[date] = (perDay[date] || 0) + 1
    })

    // Hitung pengunjung per kota
    const perCity = {}
    visitors.forEach(v => {
      if (v.city) {
        perCity[v.city] = (perCity[v.city] || 0) + 1
      }
    })

    // Hitung pengunjung per negara
    const perCountry = {}
    visitors.forEach(v => {
      if (v.country) {
        perCountry[v.country] = (perCountry[v.country] || 0) + 1
      }
    })

    res.json({
      total: visitors.length,
      perDay: Object.entries(perDay).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date)),
      perCity: Object.entries(perCity).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count),
      perCountry: Object.entries(perCountry).map(([country, count]) => ({ country, count })).sort((a, b) => b.count - a.count),
      visitors,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─────────────────────────────────────────────
// EXPORT CSV (tanpa admin)
// ─────────────────────────────────────────────
const exportVisitorCSV = async (req, res) => {
  try {
    const visitors = await prisma.visitor.findMany({
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        visitor_id: true,
        page: true,
        path: true,
        browser: true,
        language: true,
        city: true,
        country: true,
        latitude: true,
        longitude: true,
        visited_at: true,
        created_at: true,
      }
    })

    const headers = [
      'id', 'visitor_id', 'page', 'path', 'browser',
      'language', 'city', 'country', 'latitude', 'longitude',
      'visited_at', 'created_at'
    ]

    const csvRows = [headers.join(',')]
    visitors.forEach(v => {
      const row = headers.map(h => {
        const val = v[h] ?? ''
        const escaped = String(val).replace(/"/g, '""')
        return `"${escaped}"`
      })
      csvRows.push(row.join(','))
    })

    const csv = csvRows.join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="rentopia-visitors.csv"')
    res.status(200).send(csv)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getVisitorStats, exportVisitorCSV }