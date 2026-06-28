import { db, rawDb } from '../database/client'
import { sql } from 'drizzle-orm'
import { templates } from '../database/schema'

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
      metadata TEXT,
      uploaded_at INTEGER NOT NULL
    )
  `)

  // Create fonts table
  db.run(sql`
    CREATE TABLE IF NOT EXISTS fonts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      filename TEXT NOT NULL,
      filepath TEXT NOT NULL,
      font_family TEXT NOT NULL,
      font_weight TEXT,
      font_style TEXT,
      uploaded_at INTEGER NOT NULL
    )
  `)

  // Migrations: add missing columns to existing tables
  const columns = rawDb.prepare("PRAGMA table_info('assets')").all() as { name: string }[]
  if (!columns.find(c => c.name === 'metadata')) {
    rawDb.exec('ALTER TABLE assets ADD COLUMN metadata TEXT')
    console.log('[DB] Added metadata column to assets')
  }

  // Seed default template if none exist
  const existing = db.select({ id: templates.id }).from(templates).all()
  if (existing.length === 0) {
    console.log('[DB] Seeding default template...')
    db.insert(templates).values({
      name: 'Certificate of Completion',
      layout: JSON.stringify({
        width: 1754,
        height: 1240,
        background: '',
        elements: [
          {
            type: 'text',
            x: 0,
            y: 180,
            width: 1754,
            height: 4,
            content: '',
            fontSize: 1,
            color: '#c9a84c',
            fontWeight: '400',
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
          },
          {
            type: 'text',
            x: 0,
            y: 200,
            width: 1754,
            height: 120,
            content: 'CERTIFICATE OF COMPLETION',
            fontSize: 64,
            color: '#1a1a2e',
            fontWeight: '700',
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'center',
          },
          {
            type: 'text',
            x: 0,
            y: 340,
            width: 1754,
            height: 50,
            content: 'This is to certify that',
            fontSize: 28,
            color: '#666',
            fontWeight: '400',
            fontStyle: 'italic',
            textDecoration: 'none',
            textAlign: 'center',
          },
          {
            type: 'text',
            x: 0,
            y: 390,
            width: 1754,
            height: 100,
            content: '{{name}}',
            fontSize: 56,
            color: '#1a1a2e',
            fontWeight: '700',
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'center',
          },
          {
            type: 'text',
            x: 0,
            y: 490,
            width: 1754,
            height: 50,
            content: 'has successfully completed',
            fontSize: 28,
            color: '#666',
            fontWeight: '400',
            fontStyle: 'italic',
            textDecoration: 'none',
            textAlign: 'center',
          },
          {
            type: 'text',
            x: 200,
            y: 540,
            width: 1354,
            height: 70,
            content: '{{course}}',
            fontSize: 40,
            color: '#1a1a2e',
            fontWeight: '600',
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'center',
          },
          {
            type: 'text',
            x: 250,
            y: 700,
            width: 600,
            height: 60,
            content: 'Date: {{date}}',
            fontSize: 24,
            color: '#666',
            fontWeight: '400',
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
          },
          {
            type: 'text',
            x: 900,
            y: 700,
            width: 600,
            height: 60,
            content: 'ID: {{certificate_id}}',
            fontSize: 24,
            color: '#666',
            fontWeight: '400',
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'right',
          },
        ],
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    }).run()
    console.log('[DB] Default template seeded')
  }

  console.log('[DB] Tables ready')
})
