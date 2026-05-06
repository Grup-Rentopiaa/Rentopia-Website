'use strict'
const { z } = require('zod')

const CreateUserSchema = z.object({
  username:    z.string().min(3).max(64).regex(/^\w+$/, 'Hanya huruf, angka, underscore'),
  name:        z.string().max(128).optional(),
  city:        z.string().max(64).optional(),
  description: z.string().max(500).optional(),
  phone:       z.string().max(20).optional(),
})

const UpdateUserSchema = z.object({
  username:    z.string().min(3).max(64).regex(/^\w+$/, 'Hanya huruf, angka, underscore').optional(),
  name:        z.string().max(128).nullable().optional(),
  city:        z.string().max(64).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  phone:       z.string().max(20).nullable().optional(),
  avatarB64:   z.string().nullable().optional(),
})

const ListingSchema = z.object({
  title:  z.string().min(1, 'Title wajib diisi').max(255),
  price:  z.string().min(1, 'Price wajib diisi').max(64),
  brand:  z.string().min(1, 'Brand wajib diisi').max(64),
  category: z.string().max(64).default('Lainnya'),
  image:  z.string().nullable().optional(),
  status: z.enum(['available', 'rented']).default('available'),
})

const RentalSchema = z.object({
  title:  z.string().min(1, 'Title wajib diisi').max(255),
  price:  z.string().min(1, 'Price wajib diisi').max(64),
  store:  z.string().min(1, 'Store wajib diisi').max(128),
  status: z.enum(['ongoing', 'done', 'urgent']).default('ongoing'),
  note:   z.string().max(128).optional(),
})

module.exports = { CreateUserSchema, UpdateUserSchema, ListingSchema, RentalSchema }