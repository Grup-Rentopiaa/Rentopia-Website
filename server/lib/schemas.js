'use strict'
const { z } = require('zod')

const ListingSchema = z.object({
  icon:   z.string().max(8).default('👜'),
  title:  z.string().min(1, 'Title wajib diisi'),
  price:  z.string().min(1, 'Price wajib diisi'),
  brand:  z.string().min(1, 'Brand wajib diisi'),
  status: z.enum(['available', 'rented']).default('available'),
})

const RentalSchema = z.object({
  icon:   z.string().max(8).default('📦'),
  title:  z.string().min(1, 'Title wajib diisi'),
  price:  z.string().min(1, 'Price wajib diisi'),
  store:  z.string().min(1, 'Store wajib diisi'),
  status: z.enum(['ongoing', 'done', 'urgent']).default('ongoing'),
  note:   z.string().max(128).optional(),
})

module.exports = { ListingSchema, RentalSchema }