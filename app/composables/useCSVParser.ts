/**
 * CSV parsing and validation utilities
 */

export interface CSVParseResult {
  headers: string[]
  rows: Record<string, string>[]
  totalRows: number
  errors: string[]
}

export interface CSVValidationOptions {
  maxRows?: number
  requiredColumns?: string[]
  allowEmptyRows?: boolean
}

export function useCSVParser() {
  /**
   * Parse CSV file
   */
  async function parseCSV(file: File): Promise<CSVParseResult> {
    return new Promise((resolve) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const text = e.target?.result as string
        const result = parseCSVText(text)
        resolve(result)
      }

      reader.onerror = () => {
        resolve({
          headers: [],
          rows: [],
          totalRows: 0,
          errors: ['Failed to read CSV file'],
        })
      }

      reader.readAsText(file)
    })
  }

  /**
   * Parse CSV text content
   */
  function parseCSVText(text: string): CSVParseResult {
    const errors: string[] = []
    const lines = text.split(/\r?\n/).filter(line => line.trim())

    if (lines.length === 0) {
      return {
        headers: [],
        rows: [],
        totalRows: 0,
        errors: ['CSV file is empty'],
      }
    }

    // Parse header
    const headers = parseCSVLine(lines[0])
    
    if (headers.length === 0) {
      return {
        headers: [],
        rows: [],
        totalRows: 0,
        errors: ['CSV header is missing or invalid'],
      }
    }

    // Check for duplicate headers
    const headerSet = new Set(headers)
    if (headerSet.size !== headers.length) {
      errors.push('CSV contains duplicate column names')
    }

    // Parse rows
    const rows: Record<string, string>[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      
      // Skip empty rows
      if (values.every(v => v.trim() === '')) continue

      // Check column count
      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: Column count mismatch (expected ${headers.length}, got ${values.length})`)
        continue
      }

      const row: Record<string, string> = {}
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || ''
      })
      
      rows.push(row)
    }

    return {
      headers,
      rows,
      totalRows: rows.length,
      errors,
    }
  }

  /**
   * Parse single CSV line (handles quoted values with commas)
   */
  function parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        // Handle escaped quotes ("")
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }

    result.push(current)
    return result
  }

  /**
   * Validate CSV data
   */
  function validateCSV(
    result: CSVParseResult,
    options: CSVValidationOptions = {}
  ): { valid: boolean; errors: string[] } {
    const {
      maxRows = 10000,
      requiredColumns = [],
      allowEmptyRows = false,
    } = options

    const errors = [...result.errors]

    // Check row count
    if (result.totalRows === 0) {
      errors.push('CSV contains no data rows')
    }

    if (result.totalRows > maxRows) {
      errors.push(`Too many rows (max ${maxRows}, found ${result.totalRows})`)
    }

    // Check required columns
    const missingColumns = requiredColumns.filter(
      col => !result.headers.includes(col)
    )
    
    if (missingColumns.length > 0) {
      errors.push(`Missing required columns: ${missingColumns.join(', ')}`)
    }

    // Check for empty values in rows
    if (!allowEmptyRows) {
      const emptyRowIndices: number[] = []
      
      result.rows.forEach((row, index) => {
        const hasEmpty = Object.values(row).some(v => v === '')
        if (hasEmpty) {
          emptyRowIndices.push(index + 1)
        }
      })

      if (emptyRowIndices.length > 0 && emptyRowIndices.length <= 10) {
        errors.push(`Empty values found in rows: ${emptyRowIndices.join(', ')}`)
      } else if (emptyRowIndices.length > 10) {
        errors.push(`Empty values found in ${emptyRowIndices.length} rows`)
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * Detect column mappings for common certificate fields
   */
  function detectColumnMappings(headers: string[]): Record<string, string | null> {
    const mappings: Record<string, string | null> = {
      name: null,
      email: null,
      course: null,
      date: null,
      certificate_id: null,
    }

    const normalized = headers.map(h => h.toLowerCase().trim())

    // Name detection
    const namePatterns = ['name', 'full_name', 'fullname', 'student_name', 'participant']
    mappings.name = headers[normalized.findIndex(h => namePatterns.some(p => h.includes(p)))] || null

    // Email detection
    const emailPatterns = ['email', 'e-mail', 'mail', 'contact']
    mappings.email = headers[normalized.findIndex(h => emailPatterns.some(p => h.includes(p)))] || null

    // Course detection
    const coursePatterns = ['course', 'program', 'training', 'class']
    mappings.course = headers[normalized.findIndex(h => coursePatterns.some(p => h.includes(p)))] || null

    // Date detection
    const datePatterns = ['date', 'completion_date', 'issued', 'issue_date']
    mappings.date = headers[normalized.findIndex(h => datePatterns.some(p => h.includes(p)))] || null

    // ID detection
    const idPatterns = ['id', 'certificate_id', 'cert_id', 'number']
    mappings.certificate_id = headers[normalized.findIndex(h => idPatterns.some(p => h === p || h.endsWith('_' + p)))] || null

    return mappings
  }

  /**
   * Export CSV from data
   */
  function exportCSV(
    data: Record<string, any>[],
    filename: string = 'export.csv'
  ): void {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const rows = data.map(row => 
      headers.map(header => {
        const value = String(row[header] || '')
        // Escape quotes and wrap in quotes if contains comma or quote
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )

    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  return {
    parseCSV,
    parseCSVText,
    validateCSV,
    detectColumnMappings,
    exportCSV,
  }
}
