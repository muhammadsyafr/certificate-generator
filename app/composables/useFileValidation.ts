/**
 * File upload validation utilities
 */

export interface FileValidationResult {
  valid: boolean
  error?: string
  file?: File
}

export interface ImageValidationOptions {
  maxSize?: number // bytes
  maxWidth?: number // pixels
  maxHeight?: number // pixels
  allowedTypes?: string[]
}

export interface FontValidationOptions {
  maxSize?: number // bytes
  allowedTypes?: string[]
}

export function useFileValidation() {
  /**
   * Validate image file (PNG, JPG, JPEG)
   */
  function validateImage(
    file: File,
    options: ImageValidationOptions = {}
  ): Promise<FileValidationResult> {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      maxWidth = 4096,
      maxHeight = 4096,
      allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'],
    } = options

    return new Promise((resolve) => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        resolve({
          valid: false,
          error: `Invalid file type. Allowed: ${allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}`,
        })
        return
      }

      // Check file size
      if (file.size > maxSize) {
        resolve({
          valid: false,
          error: `File too large. Maximum size: ${formatBytes(maxSize)}`,
        })
        return
      }

      // Check image dimensions
      const img = new Image()
      const url = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(url)
        
        if (img.width > maxWidth || img.height > maxHeight) {
          resolve({
            valid: false,
            error: `Image dimensions too large. Maximum: ${maxWidth}x${maxHeight}px`,
          })
          return
        }

        resolve({ valid: true, file })
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve({
          valid: false,
          error: 'Failed to load image. File may be corrupted.',
        })
      }

      img.src = url
    })
  }

  /**
   * Validate font file (TTF, OTF, WOFF, WOFF2)
   */
  function validateFont(
    file: File,
    options: FontValidationOptions = {}
  ): FileValidationResult {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['.ttf', '.otf', '.woff', '.woff2'],
    } = options

    const ext = '.' + file.name.split('.').pop()?.toLowerCase()

    // Check extension
    if (!allowedTypes.includes(ext)) {
      return {
        valid: false,
        error: `Invalid font type. Allowed: ${allowedTypes.join(', ').toUpperCase()}`,
      }
    }

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `Font file too large. Maximum size: ${formatBytes(maxSize)}`,
      }
    }

    return { valid: true, file }
  }

  /**
   * Validate CSV file
   */
  function validateCSV(file: File): FileValidationResult {
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      return {
        valid: false,
        error: 'Invalid file type. Only CSV files allowed.',
      }
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `CSV file too large. Maximum size: ${formatBytes(maxSize)}`,
      }
    }

    if (file.size === 0) {
      return {
        valid: false,
        error: 'CSV file is empty.',
      }
    }

    return { valid: true, file }
  }

  /**
   * Validate multiple files
   */
  async function validateFiles(
    files: File[],
    validator: (file: File) => FileValidationResult | Promise<FileValidationResult>
  ): Promise<{ valid: File[]; invalid: Array<{ file: File; error: string }> }> {
    const results = await Promise.all(files.map(validator))
    
    const valid: File[] = []
    const invalid: Array<{ file: File; error: string }> = []

    results.forEach((result, index) => {
      if (result.valid && result.file) {
        valid.push(result.file)
      } else if (result.error) {
        invalid.push({ file: files[index], error: result.error })
      }
    })

    return { valid, invalid }
  }

  /**
   * Format bytes to human-readable string
   */
  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return {
    validateImage,
    validateFont,
    validateCSV,
    validateFiles,
    formatBytes,
  }
}
