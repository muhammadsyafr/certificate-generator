import { db } from '../../database/client'
import { templates } from '../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const method = event.method
  const id = parseInt(getRouterParam(event, 'id') || '0')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Invalid template ID',
    })
  }

  // GET - Get single template
  if (method === 'GET') {
    const template = await db.select().from(templates).where(eq(templates.id, id)).get()
    
    if (!template) {
      throw createError({
        statusCode: 404,
        message: 'Template not found',
      })
    }

    return template
  }

  // PUT - Update template
  if (method === 'PUT') {
    const body = await readBody(event)
    const { name, layout } = body

    const result = await db.update(templates)
      .set({
        ...(name && { name }),
        ...(layout && { layout: JSON.stringify(layout) }),
        updatedAt: new Date(),
      })
      .where(eq(templates.id, id))
      .returning()

    if (!result.length) {
      throw createError({
        statusCode: 404,
        message: 'Template not found',
      })
    }

    return result[0]
  }

  // DELETE - Delete template
  if (method === 'DELETE') {
    const result = await db.delete(templates).where(eq(templates.id, id)).returning()
    
    if (!result.length) {
      throw createError({
        statusCode: 404,
        message: 'Template not found',
      })
    }

    return { success: true }
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed',
  })
})
