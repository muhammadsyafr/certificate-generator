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
  metadata: text('metadata'), // JSON: { width, height, size }
  uploadedAt: integer('uploaded_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const fonts = sqliteTable('fonts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  filename: text('filename').notNull(),
  filepath: text('filepath').notNull(), // Relative path from public/
  fontFamily: text('font_family').notNull(), // CSS font-family name
  fontWeight: text('font_weight'), // normal, bold, 100-900
  fontStyle: text('font_style'), // normal, italic
  uploadedAt: integer('uploaded_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})
