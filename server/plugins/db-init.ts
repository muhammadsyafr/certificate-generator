import { db } from '../database/client'
import { sql } from 'drizzle-orm'

export default defineNitroPlugin(async () => {
  console.log('[DB] Initializing SQLite tables...')
  
  // Create templates table
  db.run(sql`
    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      layout TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `)
  
  // Create assets table
  db.run(sql`
    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      filepath TEXT NOT NULL,
      type TEXT NOT NULL,
      uploaded_at INTEGER NOT NULL
    )
  `)
  
  console.log('[DB] Tables ready')
})
