import { db } from '../../database/client'
import { assets } from '../../database/schema'
import { eq } from 'drizzle-orm'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { dataDir } from '../../utils/paths'

export default defineEventHandler(async (event) => {
  const method = event.method
  const id = parseInt(getRouterParam(event, 'id') || '0')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Invalid asset ID',
    })
  }

  // DELETE - Delete asset
  if (method === 'DELETE') {
    const asset = await db.select().from(assets).where(eq(assets.id, id)).get()
    
    if (!asset) {
      throw createError({
        statusCode: 404,
        message: 'Asset not found',
      })
    }

    // Delete file from filesystem
    const fullPath = dataDir('public', asset.filepath)
    try {
      await unlink(fullPath)
    } catch (error) {
      console.warn(`Failed to delete file: ${fullPath}`, error)
    }

    // Delete from database
    await db.delete(assets).where(eq(assets.id, id))

    return { success: true }
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed',
  })
})
