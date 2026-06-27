import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const templates = sqliteTable('templates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  layout: text('layout').notNull(), // JSON string: { elements: [...], background: '...' }
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const assets = sqliteTable('assets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  filename: text('filename').notNull(),
  filepath: text('filepath').notNull(), // Relative path from public/
  type: text('type').notNull(), // Dynamic: 'logo' | 'background' | 'free-image' | custom
  uploadedAt: integer('uploaded_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})
