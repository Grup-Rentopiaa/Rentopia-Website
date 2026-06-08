// Koordinat kota-kota besar Indonesia (hardcoded, tidak butuh API key)
const CITY_COORDS = {
  // Jawa
  'surabaya':      { lat: -7.2575,   lng: 112.7521 },
  'jakarta':       { lat: -6.2088,   lng: 106.8456 },
  'bandung':       { lat: -6.9175,   lng: 107.6191 },
  'semarang':      { lat: -6.9932,   lng: 110.4203 },
  'yogyakarta':    { lat: -7.7956,   lng: 110.3695 },
  'jogja':         { lat: -7.7956,   lng: 110.3695 },
  'solo':          { lat: -7.5755,   lng: 110.8243 },
  'surakarta':     { lat: -7.5755,   lng: 110.8243 },
  'malang':        { lat: -7.9666,   lng: 112.6326 },
  'bogor':         { lat: -6.5971,   lng: 106.8060 },
  'depok':         { lat: -6.4025,   lng: 106.7942 },
  'tangerang':     { lat: -6.1701,   lng: 106.6400 },
  'bekasi':        { lat: -6.2383,   lng: 106.9756 },
  'gresik':        { lat: -7.1560,   lng: 112.6522 },
  'sidoarjo':      { lat: -7.4478,   lng: 112.7183 },
  'mojokerto':     { lat: -7.4700,   lng: 112.4339 },
  'pasuruan':      { lat: -7.6454,   lng: 112.9075 },
  'probolinggo':   { lat: -7.7543,   lng: 113.2159 },
  'jember':        { lat: -8.1724,   lng: 113.7036 },
  'banyuwangi':    { lat: -8.2192,   lng: 114.3691 },
  'kediri':        { lat: -7.8167,   lng: 112.0166 },
  'blitar':        { lat: -8.0953,   lng: 112.1608 },
  'madiun':        { lat: -7.6298,   lng: 111.5239 },
  'cirebon':       { lat: -6.7320,   lng: 108.5523 },
  'tasikmalaya':   { lat: -7.3274,   lng: 108.2207 },
  'sukabumi':      { lat: -6.9277,   lng: 106.9300 },
  'cilegon':       { lat: -6.0020,   lng: 106.0041 },
  'serang':        { lat: -6.1205,   lng: 106.1503 },
  'pekalongan':    { lat: -6.8886,   lng: 109.6753 },
  'tegal':         { lat: -6.8694,   lng: 109.1402 },
  'purwokerto':    { lat: -7.4249,   lng: 109.2354 },
  'salatiga':      { lat: -7.3305,   lng: 110.5084 },
  'magelang':      { lat: -7.4797,   lng: 110.2177 },
  'kudus':         { lat: -6.8049,   lng: 110.8381 },
  'jepara':        { lat: -6.5877,   lng: 110.6677 },
  'demak':         { lat: -6.8943,   lng: 110.6386 },
  // Sumatera
  'medan':         { lat: -3.5896,   lng: 98.6731  },
  'palembang':     { lat: -2.9761,   lng: 104.7754 },
  'pekanbaru':     { lat: 0.5103,    lng: 101.4478 },
  'batam':         { lat: 1.0456,    lng: 104.0305 },
  'padang':        { lat: -0.9471,   lng: 100.4172 },
  'bandar lampung':{ lat: -5.4292,   lng: 105.2613 },
  'jambi':         { lat: -1.6101,   lng: 103.6131 },
  'bengkulu':      { lat: -3.7928,   lng: 102.2608 },
  'banda aceh':    { lat: 5.5483,    lng: 95.3238  },
  'binjai':        { lat: 3.6003,    lng: 98.4854  },
  'dumai':         { lat: 1.6791,    lng: 101.4478 },
  // Kalimantan
  'balikpapan':    { lat: -1.2379,   lng: 116.8529 },
  'samarinda':     { lat: -0.4948,   lng: 117.1436 },
  'banjarmasin':   { lat: -3.3194,   lng: 114.5908 },
  'pontianak':     { lat: -0.0263,   lng: 109.3425 },
  'palangkaraya':  { lat: -2.2161,   lng: 113.9135 },
  // Sulawesi
  'makassar':      { lat: -5.1477,   lng: 119.4327 },
  'manado':        { lat: 1.4748,    lng: 124.8421 },
  'palu':          { lat: -0.8917,   lng: 119.8707 },
  'kendari':       { lat: -3.9985,   lng: 122.5129 },
  'gorontalo':     { lat: 0.5435,    lng: 123.0597 },
  // Bali & Nusa Tenggara
  'denpasar':      { lat: -8.6705,   lng: 115.2126 },
  'bali':          { lat: -8.3405,   lng: 115.0920 },
  'mataram':       { lat: -8.5833,   lng: 116.1167 },
  'kupang':        { lat: -10.1772,  lng: 123.6070 },
  // Maluku & Papua
  'ambon':         { lat: -3.6554,   lng: 128.1908 },
  'jayapura':      { lat: -2.5337,   lng: 140.7181 },
  'sorong':        { lat: -0.8833,   lng: 131.2500 },
}

// Cache in-memory
const cache = new Map()

function normalize(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/^kota\s+/i, '')
    .replace(/^kabupaten\s+/i, '')
    .replace(/^kab\.\s+/i, '')
    .trim()
}

function getCityCoords(cityName) {
  if (!cityName) return null

  const key = normalize(cityName)

  if (cache.has(key)) return cache.get(key)

  // 1. Exact match
  if (CITY_COORDS[key]) {
    cache.set(key, CITY_COORDS[key])
    return CITY_COORDS[key]
  }

  // 2. Partial match — cari kota yang namanya mengandung key atau sebaliknya
  const found = Object.entries(CITY_COORDS).find(([name]) =>
    name.includes(key) || key.includes(name)
  )

  const result = found ? found[1] : null
  cache.set(key, result)
  return result
}

// Haversine distance dalam km
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

module.exports = { getCityCoords, haversine }