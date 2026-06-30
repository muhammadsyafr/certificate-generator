/**
 * Form field validation utilities
 */

export interface ValidationRule {
  validator: (value: any) => boolean
  message: string
}

export interface FieldValidation {
  value: Ref<any>
  errors: Ref<string[]>
  isDirty: Ref<boolean>
  isValid: Ref<boolean>
  validate: () => boolean
  reset: () => void
  touch: () => void
}

export function useFormValidation() {
  /**
   * Email validation
   */
  function isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  /**
   * Password strength validation
   */
  function validatePassword(password: string): {
    isValid: boolean
    strength: 0 | 1 | 2 | 3 | 4
    issues: string[]
  } {
    const issues: string[] = []
    let strength = 0

    if (password.length < 8) {
      issues.push('At least 8 characters required')
    } else {
      strength++
    }

    if (!/[A-Z]/.test(password)) {
      issues.push('Add uppercase letters')
    } else {
      strength++
    }

    if (!/[0-9]/.test(password)) {
      issues.push('Add numbers')
    } else {
      strength++
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      issues.push('Add special characters')
    } else {
      strength++
    }

    return {
      isValid: issues.length === 0,
      strength: strength as 0 | 1 | 2 | 3 | 4,
      issues,
    }
  }

  /**
   * URL validation
   */
  function isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  /**
   * File name sanitization
   */
  function sanitizeFileName(filename: string): string {
    return filename
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // Remove dangerous chars
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/\.+/g, '.') // Remove multiple dots
      .slice(0, 255) // Max filename length
  }

  /**
   * Template name validation
   */
  function validateTemplateName(name: string): { valid: boolean; error?: string } {
    if (!name || name.trim().length === 0) {
      return { valid: false, error: 'Template name is required' }
    }

    if (name.length > 100) {
      return { valid: false, error: 'Template name too long (max 100 characters)' }
    }

    if (!/^[\w\s\-\.]+$/.test(name)) {
      return { valid: false, error: 'Template name contains invalid characters' }
    }

    return { valid: true }
  }

  /**
   * Generic field validator
   */
  function createFieldValidator(
    initialValue: any,
    rules: ValidationRule[]
  ): FieldValidation {
    const value = ref(initialValue)
    const errors = ref<string[]>([])
    const isDirty = ref(false)
    const isValid = computed(() => errors.value.length === 0)

    function validate(): boolean {
      errors.value = []
      
      for (const rule of rules) {
        if (!rule.validator(value.value)) {
          errors.value.push(rule.message)
        }
      }

      return isValid.value
    }

    function reset() {
      value.value = initialValue
      errors.value = []
      isDirty.value = false
    }

    function touch() {
      isDirty.value = true
      validate()
    }

    // Auto-validate on value change if already dirty
    watch(value, () => {
      if (isDirty.value) {
        validate()
      }
    })

    return {
      value,
      errors,
      isDirty,
      isValid,
      validate,
      reset,
      touch,
    }
  }

  /**
   * Common validation rules
   */
  const rules = {
    required: (message = 'This field is required'): ValidationRule => ({
      validator: (v) => v !== null && v !== undefined && v !== '',
      message,
    }),

    email: (message = 'Invalid email address'): ValidationRule => ({
      validator: (v) => !v || isValidEmail(v),
      message,
    }),

    minLength: (min: number, message?: string): ValidationRule => ({
      validator: (v) => !v || v.length >= min,
      message: message || `Minimum ${min} characters required`,
    }),

    maxLength: (max: number, message?: string): ValidationRule => ({
      validator: (v) => !v || v.length <= max,
      message: message || `Maximum ${max} characters allowed`,
    }),

    pattern: (regex: RegExp, message: string): ValidationRule => ({
      validator: (v) => !v || regex.test(v),
      message,
    }),

    custom: (validator: (v: any) => boolean, message: string): ValidationRule => ({
      validator,
      message,
    }),
  }

  /**
   * Form group validator
   */
  function createFormValidator(fields: Record<string, FieldValidation>) {
    const isValid = computed(() => {
      return Object.values(fields).every(field => field.isValid.value)
    })

    const isDirty = computed(() => {
      return Object.values(fields).some(field => field.isDirty.value)
    })

    function validate(): boolean {
      return Object.values(fields).every(field => field.validate())
    }

    function reset() {
      Object.values(fields).forEach(field => field.reset())
    }

    function touch() {
      Object.values(fields).forEach(field => field.touch())
    }

    function getErrors(): Record<string, string[]> {
      const errors: Record<string, string[]> = {}
      Object.entries(fields).forEach(([key, field]) => {
        if (field.errors.value.length > 0) {
          errors[key] = field.errors.value
        }
      })
      return errors
    }

    return {
      isValid,
      isDirty,
      validate,
      reset,
      touch,
      getErrors,
    }
  }

  return {
    isValidEmail,
    validatePassword,
    isValidUrl,
    sanitizeFileName,
    validateTemplateName,
    createFieldValidator,
    createFormValidator,
    rules,
  }
}
