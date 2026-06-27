import { db } from '../../database/client'
import { fonts } from '../../database/schema'
import { eq } from 'drizzle-orm'
import { unlink } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || '')

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid font ID',
    })
  }

  // DELETE - Remove font
  if (event.method === 'DELETE') {
    const font = await db.select().from(fonts).where(eq(fonts.id, id)).get()

    if (!font) {
      throw createError({
        statusCode: 404,
        message: 'Font not found',
      })
    }

    // Delete file from filesystem
    try {
      const fullPath = join(process.cwd(), 'public', font.filepath)
      await unlink(fullPath)
    } catch (e) {
      console.error('Failed to delete font file:', e)
    }

    // Delete from database
    await db.delete(fonts).where(eq(fonts.id, id))

    return { success: true }
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed',
  })
})
