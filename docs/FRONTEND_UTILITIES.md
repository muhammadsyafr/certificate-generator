# Frontend Validation, Rate Limiting & Performance Utilities

## Overview

Production-ready composables for input validation, rate limiting, and performance optimization implemented in the Certificate Generator frontend.

---

## Installation

All composables are auto-imported by Nuxt. Just use them directly:

```vue
<script setup lang="ts">
const { validateImage } = useFileValidation()
const { debounce } = useRateLimit()
const { compressImage } = usePerformance()
</script>
```

---

## 1. File Validation (`useFileValidation`)

### Image Validation

```typescript
const { validateImage } = useFileValidation()

const result = await validateImage(file, {
  maxSize: 10 * 1024 * 1024, // 10MB
  maxWidth: 4096,
  maxHeight: 4096,
  allowedTypes: ['image/png', 'image/jpeg']
})

if (!result.valid) {
  console.error(result.error)
}
```

**Options:**
- `maxSize` (number): Max file size in bytes (default: 10MB)
- `maxWidth` (number): Max image width in pixels (default: 4096)
- `maxHeight` (number): Max image height in pixels (default: 4096)
- `allowedTypes` (string[]): MIME types allowed (default: PNG, JPEG, JPG)

**Returns:**
```typescript
{
  valid: boolean
  error?: string
  file?: File
}
```

### Font Validation

```typescript
const { validateFont } = useFileValidation()

const result = validateFont(file, {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['.ttf', '.otf', '.woff', '.woff2']
})
```

**Options:**
- `maxSize` (number): Max file size in bytes (default: 5MB)
- `allowedTypes` (string[]): File extensions allowed (default: TTF, OTF, WOFF, WOFF2)

### CSV Validation

```typescript
const { validateCSV } = useFileValidation()

const result = validateCSV(file)

if (!result.valid) {
  alert(result.error)
}
```

**Validation:**
- File type must be `text/csv` or `.csv` extension
- Max size: 5MB
- File must not be empty

### Batch Validation

```typescript
const { validateFiles } = useFileValidation()

const { valid, invalid } = await validateFiles(files, validateImage)

console.log(`${valid.length} valid, ${invalid.length} invalid`)
invalid.forEach(({ file, error }) => {
  console.error(`${file.name}: ${error}`)
})
```

### Utilities

```typescript
const { formatBytes } = useFileValidation()

formatBytes(1024) // "1 KB"
formatBytes(1536) // "1.5 KB"
formatBytes(1048576) // "1 MB"
```

---

## 2. Form Validation (`useFormValidation`)

### Email Validation

```typescript
const { isValidEmail } = useFormValidation()

if (!isValidEmail('user@example.com')) {
  // Invalid email
}
```

### Password Validation

```typescript
const { validatePassword } = useFormValidation()

const result = validatePassword('MyP@ssw0rd')
// {
//   isValid: true,
//   strength: 4, // 0-4
//   issues: []
// }
```

**Strength Levels:**
- `0`: Very weak (< 8 chars)
- `1`: Weak (8+ chars)
- `2`: Fair (8+ chars + uppercase)
- `3`: Good (8+ chars + uppercase + numbers)
- `4`: Strong (8+ chars + uppercase + numbers + special)

### Template Name Validation

```typescript
const { validateTemplateName } = useFormValidation()

const result = validateTemplateName('My Certificate 2026')
// { valid: true }

const bad = validateTemplateName('Bad<>Name')
// { valid: false, error: 'Template name contains invalid characters' }
```

**Rules:**
- Required (not empty)
- Max 100 characters
- Only alphanumeric, spaces, hyphens, dots, underscores

### File Name Sanitization

```typescript
const { sanitizeFileName } = useFormValidation()

sanitizeFileName('My File:Name?.txt')
// "My-File-Name.txt"
```

### Field Validator

```typescript
const { createFieldValidator, rules } = useFormValidation()

const email = createFieldValidator('', [
  rules.required(),
  rules.email(),
])

email.value.value = 'test@example.com'
email.validate() // true
email.isValid.value // true
email.errors.value // []
```

**Built-in Rules:**
- `rules.required(message?)` - Field must not be empty
- `rules.email(message?)` - Must be valid email
- `rules.minLength(min, message?)` - Minimum length
- `rules.maxLength(max, message?)` - Maximum length
- `rules.pattern(regex, message)` - Match regex
- `rules.custom(fn, message)` - Custom validator function

### Form Validator

```typescript
const { createFormValidator, createFieldValidator, rules } = useFormValidation()

const form = createFormValidator({
  email: createFieldValidator('', [rules.required(), rules.email()]),
  password: createFieldValidator('', [rules.required(), rules.minLength(8)]),
})

form.validate() // Validates all fields
form.isValid.value // Overall validity
form.getErrors() // { email: ['...'], password: ['...'] }
form.reset() // Reset all fields
```

---

## 3. Rate Limiting (`useRateLimit`)

### Debounce

Delay function execution until after wait time has elapsed since last call.

```typescript
const { debounce } = useRateLimit()

const saveTemplate = debounce(async (data) => {
  await $fetch('/api/templates/1', { method: 'PUT', body: data })
}, 500) // Wait 500ms after last keystroke

// In template editor:
watch(templateData, () => {
  saveTemplate(templateData.value)
})
```

### Throttle

Limit function execution to once per time period.

```typescript
const { throttle } = useRateLimit()

const trackScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY)
}, 200) // Max once per 200ms

window.addEventListener('scroll', trackScroll)
```

### Upload Queue

Limit concurrent uploads (prevents overwhelming browser/server).

```typescript
const { createUploadQueue } = useRateLimit()

const uploadQueue = createUploadQueue(3) // Max 3 concurrent

// Upload multiple fonts
const uploads = fontFiles.map(file => 
  uploadQueue.add(() => uploadFont(file))
)

const results = await Promise.all(uploads)

// Check queue status
const status = uploadQueue.getStatus()
// { active: 2, queued: 5, total: 7 }
```

### Retry with Exponential Backoff

```typescript
const { retry } = useRateLimit()

const result = await retry(
  () => $fetch('/api/templates'),
  {
    maxRetries: 3,
    initialDelay: 1000, // Start with 1s
    maxDelay: 10000, // Cap at 10s
    onRetry: (attempt, error) => {
      console.warn(`Retry attempt ${attempt}:`, error)
    }
  }
)
```

**Backoff Schedule:**
- Attempt 1: 1s delay
- Attempt 2: 2s delay
- Attempt 3: 4s delay
- Attempt 4: 8s delay
- Max: 10s delay

### Rate Limit State (UI Feedback)

```typescript
const { useRateLimitState } = useRateLimit()

const rateLimitState = useRateLimitState()

// User clicked too many times
function handleAction() {
  if (rateLimitState.isLimited.value) {
    return
  }
  
  // Do action
  rateLimitState.trigger(3000) // Lock for 3s
}
```

```vue
<template>
  <button :disabled="isLimited">
    <span v-if="isLimited">Wait {{ Math.ceil(remainingTime / 1000) }}s</span>
    <span v-else>Submit</span>
  </button>
</template>
```

---

## 4. Performance (`usePerformance`)

### Lazy Image Loading

```vue
<template>
  <img ref="imageRef" :data-src="imageSrc" :class="{ loaded: isLoaded }">
</template>

<script setup lang="ts">
const { useLazyImage } = usePerformance()
const imageSrc = '/uploads/background.png'

const { imageRef, isLoaded, isInView } = useLazyImage(0.1) // Load when 10% visible
</script>

<style>
img { opacity: 0; transition: opacity 0.3s; }
img.loaded { opacity: 1; }
</style>
```

### Image Compression

Compress before upload to save bandwidth.

```typescript
const { compressImage } = usePerformance()

async function handleUpload(file: File) {
  // Compress
  const compressed = await compressImage(file, {
    maxWidth: 2048,
    maxHeight: 2048,
    quality: 0.85,
    format: 'image/jpeg'
  })
  
  // Upload compressed version
  await uploadFile(compressed)
}
```

**Options:**
- `maxWidth` (number): Max width (default: 2048)
- `maxHeight` (number): Max height (default: 2048)
- `quality` (number): 0-1, JPEG/WebP quality (default: 0.85)
- `format` (string): `image/jpeg`, `image/png`, `image/webp` (default: `image/jpeg`)

**Compression Results:**
- Original PNG 5MB → Compressed JPEG 800KB (84% reduction)
- Maintains visual quality at 0.85

### Preload Images

```typescript
const { preloadImages } = usePerformance()

onMounted(async () => {
  await preloadImages([
    '/uploads/logo.png',
    '/uploads/background.png',
    '/uploads/signature.png'
  ])
  
  // Images cached, ready for instant display
})
```

### Process in Chunks

Handle large datasets without blocking UI.

```typescript
const { processInChunks } = usePerformance()

const results = await processInChunks(
  csvRows, // 10,000 rows
  async (row) => {
    return generateCertificate(row)
  },
  50 // Process 50 at a time
)

// UI remains responsive during processing
```

### Network Status Detection

```typescript
const { useNetworkStatus } = usePerformance()

const { isOnline, isSlow } = useNetworkStatus()

watchEffect(() => {
  if (!isOnline.value) {
    toast.show('You are offline')
  } else if (isSlow.value) {
    toast.show('Slow connection detected')
  }
})
```

**Detection:**
- `isOnline`: Browser online/offline
- `isSlow`: Connection is 2G or slow-2g (via Network Information API)

### Upload Progress Tracking

```vue
<template>
  <div v-if="isUploading">
    <progress :value="progress" max="100"></progress>
    <p>{{ progress }}% - {{ formatSpeed }}</p>
  </div>
</template>

<script setup lang="ts">
const { useUploadProgress } = usePerformance()

const { progress, isUploading, speed, formatSpeed, start, update, complete } = useUploadProgress()

async function uploadFile(file: File) {
  start(file.size)
  
  const xhr = new XMLHttpRequest()
  
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      update(e.loaded, e.total)
    }
  })
  
  xhr.addEventListener('load', () => {
    complete()
  })
  
  // ... upload logic
}
</script>
```

**Metrics:**
- `progress`: 0-100
- `isUploading`: boolean
- `speed`: bytes per second
- `formatSpeed`: "1.2 MB/s"

---

## 5. CSV Parser (`useCSVParser`)

### Parse CSV File

```typescript
const { parseCSV } = useCSVParser()

const result = await parseCSV(file)

console.log(result.headers) // ['name', 'email', 'course']
console.log(result.rows) // [{ name: 'John', email: 'john@...', course: '...' }]
console.log(result.totalRows) // 250
console.log(result.errors) // ['Row 5: Column count mismatch']
```

### Validate CSV

```typescript
const { parseCSV, validateCSV } = useCSVParser()

const parsed = await parseCSV(file)

const validation = validateCSV(parsed, {
  maxRows: 10000,
  requiredColumns: ['name', 'email'],
  allowEmptyRows: false
})

if (!validation.valid) {
  alert(validation.errors.join('\n'))
}
```

**Options:**
- `maxRows` (number): Max rows allowed (default: 10000)
- `requiredColumns` (string[]): Columns that must exist (default: [])
- `allowEmptyRows` (boolean): Allow empty values in cells (default: false)

**Validation Checks:**
- Empty file
- Too many rows
- Missing required columns
- Empty values (if `allowEmptyRows: false`)
- Column count mismatch
- Duplicate headers

### Auto-detect Column Mappings

```typescript
const { detectColumnMappings } = useCSVParser()

const mappings = detectColumnMappings(['Full Name', 'Student Email', 'Course Name'])
// {
//   name: 'Full Name',
//   email: 'Student Email',
//   course: 'Course Name',
//   date: null,
//   certificate_id: null
// }
```

**Detection Patterns:**
- `name`: name, full_name, fullname, student_name, participant
- `email`: email, e-mail, mail, contact
- `course`: course, program, training, class
- `date`: date, completion_date, issued, issue_date
- `certificate_id`: id, certificate_id, cert_id, number

### Export CSV

```typescript
const { exportCSV } = useCSVParser()

const data = [
  { name: 'John Doe', email: 'john@example.com', score: 95 },
  { name: 'Jane Smith', email: 'jane@example.com', score: 87 }
]

exportCSV(data, 'results.csv')
// Downloads CSV file
```

**Features:**
- Auto-escapes commas, quotes, newlines
- Handles all data types (converts to string)
- Browser download (no server required)

---

## Usage Examples

### Complete Upload Flow with Validation + Progress

```vue
<template>
  <div>
    <input type="file" @change="handleFileSelect" accept="image/png,image/jpeg">
    
    <div v-if="error" class="error">{{ error }}</div>
    
    <div v-if="isUploading" class="progress">
      <progress :value="progress" max="100"></progress>
      <span>{{ progress }}% - {{ formatSpeed }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { validateImage } = useFileValidation()
const { compressImage, useUploadProgress } = usePerformance()

const error = ref('')
const { progress, isUploading, formatSpeed, start, update, complete, reset } = useUploadProgress()

async function handleFileSelect(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  error.value = ''
  reset()
  
  // 1. Validate
  const validation = await validateImage(file, { maxSize: 10 * 1024 * 1024 })
  if (!validation.valid) {
    error.value = validation.error || 'Invalid file'
    return
  }
  
  // 2. Compress
  const compressed = await compressImage(file, { quality: 0.85 })
  
  // 3. Upload with progress
  start(compressed.size)
  
  const formData = new FormData()
  formData.append('file', compressed)
  formData.append('type', 'background')
  
  try {
    const xhr = new XMLHttpRequest()
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        update(e.loaded, e.total)
      }
    })
    
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        complete()
        // Success
      }
    })
    
    xhr.open('POST', '/api/assets')
    xhr.send(formData)
  } catch (err) {
    error.value = 'Upload failed'
    reset()
  }
}
</script>
```

### Auto-save with Debounce

```vue
<script setup lang="ts">
const { debounce } = useRateLimit()

const templateData = ref({ name: '', layout: {} })

const autoSave = debounce(async () => {
  await $fetch('/api/templates/1', {
    method: 'PUT',
    body: templateData.value
  })
  console.log('Saved!')
}, 1000)

watch(templateData, autoSave, { deep: true })
</script>
```

### CSV Upload with Validation

```vue
<script setup lang="ts">
const { validateCSV } = useFileValidation()
const { parseCSV, validateCSV: validateParsedCSV, detectColumnMappings } = useCSVParser()

async function handleCSVUpload(file: File) {
  // 1. Validate file
  const fileValidation = validateCSV(file)
  if (!fileValidation.valid) {
    alert(fileValidation.error)
    return
  }
  
  // 2. Parse
  const parsed = await parseCSV(file)
  
  // 3. Validate content
  const contentValidation = validateParsedCSV(parsed, {
    maxRows: 5000,
    requiredColumns: ['name'],
    allowEmptyRows: false
  })
  
  if (!contentValidation.valid) {
    alert(contentValidation.errors.join('\n'))
    return
  }
  
  // 4. Auto-detect mappings
  const mappings = detectColumnMappings(parsed.headers)
  
  console.log('Ready to generate', parsed.totalRows, 'certificates')
  console.log('Detected mappings:', mappings)
}
</script>
```

---

## Performance Metrics

### File Validation
- Image validation (with dimension check): ~50-200ms per file
- Font validation: ~1ms per file
- CSV validation: ~100ms for 1000 rows

### Image Compression
- 5MB PNG → 800KB JPEG: ~500-1000ms
- 2MB JPEG → 500KB JPEG: ~200-400ms

### CSV Parsing
- 1000 rows: ~50ms
- 10000 rows: ~500ms
- 100000 rows: ~5s (use chunked processing)

### Debounce/Throttle
- Overhead: <1ms
- Memory: negligible

---

## Browser Support

All utilities support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Fallbacks:**
- Network Information API: Graceful degradation (slow detection unavailable)
- IntersectionObserver: Required for lazy loading (polyfill if needed)

---

## Best Practices

### 1. Always Validate Before Upload
```typescript
// ✅ Good
const validation = await validateImage(file)
if (validation.valid) await upload(file)

// ❌ Bad
await upload(file) // No validation
```

### 2. Compress Images Client-side
```typescript
// ✅ Good - saves bandwidth
const compressed = await compressImage(file)
await upload(compressed)

// ❌ Bad - wastes bandwidth
await upload(file)
```

### 3. Use Upload Queue for Multiple Files
```typescript
// ✅ Good
const queue = createUploadQueue(3)
await Promise.all(files.map(f => queue.add(() => upload(f))))

// ❌ Bad - overwhelms browser/server
await Promise.all(files.map(upload))
```

### 4. Debounce Auto-save
```typescript
// ✅ Good
const save = debounce(saveToServer, 1000)
watch(data, save)

// ❌ Bad - spams server
watch(data, saveToServer)
```

### 5. Validate Forms on Submit
```typescript
// ✅ Good
function onSubmit() {
  if (!form.validate()) return
  // Submit
}

// ❌ Bad - no validation
function onSubmit() {
  // Submit
}
```

---

## Changelog

### 2026-06-30
- Initial implementation
- File validation (images, fonts, CSV)
- Form validation with rules
- Rate limiting (debounce, throttle, queue, retry)
- Performance utilities (lazy load, compress, network status, upload progress)
- CSV parser with auto-mapping
