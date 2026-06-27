import { db } from '../../database/client'
import { assets } from '../../database/schema'
import { eq } from 'drizzle-orm'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'

export default defineEventHandler(async (event) => {
  const method = event.method

  // GET - List all assets
  if (method === 'GET') {
    const allAssets = await db.select().from(assets).all()
    // Parse metadata JSON for each asset
    return allAssets.map(asset => ({
      ...asset,
      metadata: asset.metadata ? JSON.parse(asset.metadata) : null
    }))
  }

  // POST - Upload new asset
  if (method === 'POST') {
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No file uploaded',
      })
    }

    const file = formData[0]
    const type = formData.find(f => f.name === 'type')?.data.toString() || 'logo'
    
    if (!file.filename || !file.data) {
      throw createError({
        statusCode: 400,
        message: 'Invalid file',
      })
    }

    // Validate file type
    const ext = file.filename.split('.').pop()?.toLowerCase()
    if (!['png', 'jpg', 'jpeg'].includes(ext || '')) {
      throw createError({
        statusCode: 400,
        message: 'Only PNG and JPG files are allowed',
      })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.filename}`
    const subdir = type
    const dirPath = join(process.cwd(), 'public', 'uploads', subdir)
    await import('fs/promises').then(m => m.mkdir(dirPath, { recursive: true }))
    const filepath = `/uploads/${subdir}/${filename}`
    const fullPath = join(dirPath, filename)

    // Save file
    await writeFile(fullPath, file.data)

    // Extract image metadata
    let metadata = null
    try {
      const image = sharp(file.data)
      const meta = await image.metadata()
      metadata = JSON.stringify({
        width: meta.width,
        height: meta.height,
        size: file.data.length,
      })
    } catch (e) {
      console.error('Failed to extract metadata:', e)
    }

    // Save to database
    const result = await db.insert(assets).values({
      filename: file.filename,
      filepath,
      type,
      metadata,
      uploadedAt: new Date(),
    }).returning()

    return result[0]
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed',
  })
})
