import { db } from '../../database/client'
import { fonts } from '../../database/schema'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { dataDir } from '../../utils/paths'

export default defineEventHandler(async (event) => {
  const method = event.method

  // GET - List all fonts
  if (method === 'GET') {
    const allFonts = await db.select().from(fonts).all()
    return allFonts
  }

  // POST - Upload new font(s)
  if (method === 'POST') {
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No files uploaded',
      })
    }

    const fontFamilyField = formData.find(f => f.name === 'fontFamily')
    
    if (!fontFamilyField || !fontFamilyField.data) {
      throw createError({
        statusCode: 400,
        message: 'Font family name is required',
      })
    }

    const fontFamilyData = fontFamilyField.data.toString()

    const files = formData.filter(f => f.name === 'files' && f.filename && f.data)
    
    if (files.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No valid files uploaded',
      })
    }

    const results = []
    const dirPath = dataDir('public', 'uploads', 'fonts')
    await import('fs/promises').then(m => m.mkdir(dirPath, { recursive: true }))

    for (const file of files) {
      if (!file.filename || !file.data) continue

      // Validate file type
      const ext = file.filename.split('.').pop()?.toLowerCase()
      if (!['ttf', 'otf', 'woff', 'woff2'].includes(ext || '')) {
        console.warn(`Skipping invalid file type: ${file.filename}`)
        continue
      }

      // Validate file size (max 5MB)
      if (file.data.length > 5_000_000) {
        console.warn(`Skipping large file: ${file.filename}`)
        continue
      }

      // Detect font weight and style from filename
      const filename = file.filename.toLowerCase()
      let fontWeight = '400'
      let fontStyle = 'normal'

      if (filename.includes('italic') || filename.includes('oblique')) {
        fontStyle = 'italic'
      }
      
      if (filename.includes('thin')) fontWeight = '100'
      else if (filename.includes('extralight') || filename.includes('extra-light') || filename.includes('ultralight')) fontWeight = '200'
      else if (filename.includes('light') && !filename.includes('semi')) fontWeight = '300'
      else if (filename.includes('medium')) fontWeight = '500'
      else if (filename.includes('semibold') || filename.includes('semi-bold') || filename.includes('demibold')) fontWeight = '600'
      else if (filename.includes('extrabold') || filename.includes('extra-bold') || filename.includes('ultrabold')) fontWeight = '800'
      else if (filename.includes('bold') && !filename.includes('semi') && !filename.includes('extra')) fontWeight = '700'
      else if (filename.includes('black') || filename.includes('heavy')) fontWeight = '900'
      else if (filename.includes('regular') || filename.includes('normal')) fontWeight = '400'

      // Generate unique filename
      const timestamp = Date.now()
      const uniqueFilename = `${timestamp}-${file.filename}`
      const filepath = `/uploads/fonts/${uniqueFilename}`
      const fullPath = join(dirPath, uniqueFilename)

      // Save file
      await writeFile(fullPath, file.data)

      // Save to database
      const result = await db.insert(fonts).values({
        name: file.filename,
        filename: file.filename,
        filepath,
        fontFamily: fontFamilyData,
        fontWeight,
        fontStyle,
        uploadedAt: new Date(),
      }).returning()

      results.push(result[0])
    }

    if (results.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No valid font files were uploaded. Ensure files are TTF, OTF, WOFF, or WOFF2 and under 5MB.',
      })
    }

    return { uploaded: results.length, fonts: results }
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed',
  })
})
