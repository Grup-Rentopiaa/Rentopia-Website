import { defineConfig } from '@prisma/config'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '.env') })

const {
  DB_USER     = 'postgres',
  DB_PASSWORD = 'BISMILLAH',
  DB_HOST     = 'localhost',
  DB_PORT     = '5432',
  DB_NAME     = 'RENTOPIA',
} = process.env

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  migrate: {
    connectionString: `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
  },
})
