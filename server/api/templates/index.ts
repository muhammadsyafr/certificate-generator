import { db } from '../../database/client'
import { templates } from '../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const method = event.method

  // GET - List all templates
  if (method === 'GET') {
    const allTemplates = await db.select().from(templates).all()
    return allTemplates
  }

  // POST - Create new template
  if (method === 'POST') {
    const body = await readBody(event)
    const { name, layout } = body

    if (!name || !layout) {
      throw createError({
        statusCode: 400,
        message: 'name and layout are required',
      })
    }

    const result = await db.insert(templates).values({
      name,
      layout: JSON.stringify(layout),
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    return result[0]
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed',
  })
})
