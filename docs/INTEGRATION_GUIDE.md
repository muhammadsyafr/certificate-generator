# Implementation Guide: Production Features Integration

## Overview

This guide shows how to integrate the validation, rate limiting, and performance utilities into existing pages.

---

## Example: Enhanced Asset Upload

### Before (Current)
```typescript
async function confirmUpload() {
  if (!selectedFile.value) return
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    await $fetch('/api/assets', { method: 'POST', body: formData })
    showToast('File uploaded successfully!')
  } catch (e) {
    showToast('Upload failed', false)
  } finally {
    uploading.value = false
  }
}
```

### After (Enhanced)
```vue
<script setup lang="ts">
import { useFileValidation } from '~/composables/useFileValidation'
import { usePerformance } from '~/composables/usePerformance'
import { useRateLimit } from '~/composables/useRateLimit'

const { validateImage, validateFont, formatBytes } = useFileValidation()
const { compressImage, useUploadProgress, useNetworkStatus } = usePerformance()
const { retry } = useRateLimit()

const { isOnline, isSlow } = useNetworkStatus()
const { progress, isUploading, formatSpeed, start, update, complete, reset } = useUploadProgress()

const validationError = ref('')
const compressing = ref(false)

// Watch network status
watchEffect(() => {
  if (!isOnline.value) {
    showToast('⚠️ You are offline', false)
  } else if (isSlow.value) {
    showToast('⚠️ Slow connection detected', false)
  }
})

// Enhanced file selection with validation
async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  validationError.value = ''
  
  // Validate based on type
  if (activeTab.value === 'fonts') {
    const result = validateFont(file)
    if (!result.valid) {
      validationError.value = result.error || 'Invalid font file'
      selectedFile.value = null
      return
    }
  } else {
    const result = await validateImage(file, {
      maxSize: 10 * 1024 * 1024, // 10MB
      maxWidth: 4096,
      maxHeight: 4096
    })
    if (!result.valid) {
      validationError.value = result.error || 'Invalid image file'
      selectedFile.value = null
      return
    }
  }
  
  selectedFile.value = file
}

// Enhanced upload with compression, progress, and retry
async function confirmUpload() {
  if (!selectedFile.value) return
  
  validationError.value = ''
  uploading.value = true
  reset()

  try {
    let fileToUpload = selectedFile.value

    // Compress images before upload
    if (activeTab.value !== 'fonts') {
      compressing.value = true
      fileToUpload = await compressImage(selectedFile.value, {
        maxWidth: 2048,
        maxHeight: 2048,
        quality: 0.85,
        format: 'image/jpeg'
      })
      compressing.value = false
      
      showToast(`Compressed ${formatBytes(selectedFile.value.size)} → ${formatBytes(fileToUpload.size)}`)
    }

    start(fileToUpload.size)

    // Upload with retry logic
    await retry(
      () => uploadWithProgress(fileToUpload),
      {
        maxRetries: 3,
        initialDelay: 1000,
        onRetry: (attempt) => {
          showToast(`Retrying upload (${attempt}/3)...`, false)
        }
      }
    )

    complete()
    showUploadModal.value = false
    selectedFile.value = null
    fontFamilyInput.value = ''
    showToast('✓ File uploaded successfully!')
    
    // Refresh data
    if (activeTab.value === 'fonts') {
      await refreshFonts()
    } else {
      await refreshAssets()
    }
  } catch (e: any) {
    reset()
    const errorMsg = e?.data?.message || e?.message || 'Upload failed'
    validationError.value = errorMsg
    showToast(`❌ ${errorMsg}`, false)
  } finally {
    uploading.value = false
    compressing.value = false
  }
}

// Upload with progress tracking
function uploadWithProgress(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()

    if (activeTab.value === 'fonts') {
      formData.append('files', file)
      formData.append('fontFamily', fontFamilyInput.value.trim() || file.name.replace(/\.[^.]+$/, ''))
    } else {
      formData.append('file', file)
      formData.append('type', uploadType.value)
    }

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        update(e.loaded, e.total)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Network error'))
    })

    const endpoint = activeTab.value === 'fonts' ? '/api/fonts' : '/api/assets'
    xhr.open('POST', endpoint)
    xhr.send(formData)
  })
}
</script>

<template>
  <!-- Add validation error display -->
  <div v-if="validationError" class="al-validation-error">
    {{ validationError }}
  </div>

  <!-- Add compression status -->
  <div v-if="compressing" class="al-compressing">
    Compressing image...
  </div>

  <!-- Add progress bar -->
  <div v-if="isUploading" class="al-progress-wrap">
    <div class="al-progress-bar">
      <div class="al-progress-fill" :style="{ width: progress + '%' }" />
    </div>
    <div class="al-progress-text">
      {{ progress }}% • {{ formatSpeed }}
    </div>
  </div>

  <!-- Update upload button -->
  <button
    class="al-modal-submit"
    :disabled="!selectedFile || uploading || compressing || (activeTab === 'fonts' && !fontFamilyInput.trim())"
    @click="confirmUpload"
  >
    <span v-if="compressing">Compressing...</span>
    <span v-else-if="uploading">Uploading {{ progress }}%...</span>
    <span v-else>Upload file</span>
  </button>
</template>
```

---

## Example: CSV Upload with Validation

```vue
<script setup lang="ts">
import { useFileValidation } from '~/composables/useFileValidation'
import { useCSVParser } from '~/composables/useCSVParser'

const { validateCSV: validateCSVFile } = useFileValidation()
const { parseCSV, validateCSV, detectColumnMappings } = useCSVParser()

const csvFile = ref<File | null>(null)
const csvData = ref<any>(null)
const csvErrors = ref<string[]>([])
const columnMappings = ref<Record<string, string | null>>({})

async function handleCSVUpload(file: File) {
  csvErrors.value = []
  
  // 1. Validate file
  const fileValidation = validateCSVFile(file)
  if (!fileValidation.valid) {
    csvErrors.value = [fileValidation.error || 'Invalid CSV']
    return
  }
  
  // 2. Parse
  const parsed = await parseCSV(file)
  
  // 3. Validate content
  const contentValidation = validateCSV(parsed, {
    maxRows: 5000,
    requiredColumns: ['name'],
    allowEmptyRows: false
  })
  
  if (!contentValidation.valid) {
    csvErrors.value = contentValidation.errors
    return
  }
  
  // 4. Auto-detect column mappings
  columnMappings.value = detectColumnMappings(parsed.headers)
  csvData.value = parsed
  
  toast.show(`Loaded ${parsed.totalRows} rows`)
}
</script>

<template>
  <div class="csv-upload">
    <input type="file" accept=".csv" @change="handleCSVUpload($event.target.files[0])">
    
    <div v-if="csvErrors.length" class="csv-errors">
      <div v-for="error in csvErrors" :key="error" class="error-item">
        {{ error }}
      </div>
    </div>
    
    <div v-if="csvData" class="csv-preview">
      <p>{{ csvData.totalRows }} rows loaded</p>
      <div class="csv-mappings">
        <h4>Detected Mappings:</h4>
        <div v-for="(col, field) in columnMappings" :key="field">
          <strong>{{ field }}:</strong> {{ col || 'Not detected' }}
        </div>
      </div>
    </div>
  </div>
</template>
```

---

## Example: Form Validation in Sign Up

```vue
<script setup lang="ts">
import { useFormValidation } from '~/composables/useFormValidation'

const { createFieldValidator, createFormValidator, rules, validatePassword } = useFormValidation()

// Create field validators
const emailField = createFieldValidator('', [
  rules.required('Email is required'),
  rules.email()
])

const passwordField = createFieldValidator('', [
  rules.required('Password is required'),
  rules.minLength(8)
])

const firstNameField = createFieldValidator('', [
  rules.required('First name is required'),
  rules.maxLength(50)
])

// Create form validator
const form = createFormValidator({
  email: emailField,
  password: passwordField,
  firstName: firstNameField
})

// Password strength
const passwordStrength = computed(() => {
  return validatePassword(passwordField.value.value)
})

function onSubmit() {
  // Touch all fields to show errors
  form.touch()
  
  // Validate
  if (!form.validate()) {
    const errors = form.getErrors()
    console.error('Form errors:', errors)
    return
  }
  
  // Submit
  submitForm()
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <!-- Email with validation -->
    <div>
      <input v-model="emailField.value.value" type="email" @blur="emailField.touch()">
      <div v-if="emailField.isDirty.value && !emailField.isValid.value" class="error">
        {{ emailField.errors.value[0] }}
      </div>
    </div>

    <!-- Password with strength indicator -->
    <div>
      <input v-model="passwordField.value.value" type="password" @blur="passwordField.touch()">
      
      <div v-if="passwordField.value.value" class="password-strength">
        <div class="strength-bar">
          <div :style="{ width: (passwordStrength.strength / 4 * 100) + '%' }" />
        </div>
        <ul>
          <li v-for="issue in passwordStrength.issues" :key="issue">{{ issue }}</li>
        </ul>
      </div>
      
      <div v-if="passwordField.isDirty.value && !passwordField.isValid.value" class="error">
        {{ passwordField.errors.value[0] }}
      </div>
    </div>

    <button type="submit" :disabled="!form.isValid.value">
      Submit
    </button>
  </form>
</template>
```

---

## Example: Auto-save with Debounce

```vue
<script setup lang="ts">
import { useRateLimit } from '~/composables/useRateLimit'

const { debounce } = useRateLimit()

const templateData = ref({
  name: 'My Template',
  layout: {}
})

const saveStatus = ref<'saved' | 'saving' | 'unsaved'>('saved')

// Debounced auto-save (1 second delay)
const autoSave = debounce(async () => {
  saveStatus.value = 'saving'
  try {
    await $fetch(`/api/templates/${templateId}`, {
      method: 'PUT',
      body: templateData.value
    })
    saveStatus.value = 'saved'
  } catch (e) {
    saveStatus.value = 'unsaved'
    toast.show('Auto-save failed', false)
  }
}, 1000)

// Watch for changes
watch(templateData, () => {
  saveStatus.value = 'unsaved'
  autoSave()
}, { deep: true })
</script>

<template>
  <div class="editor">
    <div class="save-indicator">
      <span v-if="saveStatus === 'saved'">✓ Saved</span>
      <span v-else-if="saveStatus === 'saving'">Saving...</span>
      <span v-else>Unsaved changes</span>
    </div>
  </div>
</template>
```

---

## Example: Multiple Font Upload with Queue

```vue
<script setup lang="ts">
import { useRateLimit } from '~/composables/useRateLimit'
import { useFileValidation } from '~/composables/useFileValidation'

const { createUploadQueue } = useRateLimit()
const { validateFont, validateFiles } = useFileValidation()

const uploadQueue = createUploadQueue(3) // Max 3 concurrent
const queueStatus = ref({ active: 0, queued: 0, total: 0 })

async function handleMultipleFonts(files: FileList) {
  const fileArray = Array.from(files)
  
  // Validate all files first
  const { valid, invalid } = await validateFiles(fileArray, validateFont)
  
  if (invalid.length > 0) {
    toast.show(`${invalid.length} invalid files skipped`, false)
  }
  
  if (valid.length === 0) {
    toast.show('No valid files to upload', false)
    return
  }
  
  // Upload valid files with queue
  const uploads = valid.map(file =>
    uploadQueue.add(() => uploadFont(file))
  )
  
  // Update status periodically
  const statusInterval = setInterval(() => {
    queueStatus.value = uploadQueue.getStatus()
  }, 100)
  
  try {
    const results = await Promise.all(uploads)
    toast.show(`Uploaded ${results.length} fonts successfully!`)
  } catch (e) {
    toast.show('Some uploads failed', false)
  } finally {
    clearInterval(statusInterval)
    queueStatus.value = { active: 0, queued: 0, total: 0 }
  }
}

async function uploadFont(file: File): Promise<any> {
  const formData = new FormData()
  formData.append('files', file)
  formData.append('fontFamily', file.name.replace(/\.[^.]+$/, ''))
  
  return await $fetch('/api/fonts', {
    method: 'POST',
    body: formData
  })
}
</script>

<template>
  <div>
    <input type="file" multiple accept=".ttf,.otf,.woff,.woff2" @change="handleMultipleFonts($event.target.files)">
    
    <div v-if="queueStatus.total > 0" class="upload-queue">
      Uploading: {{ queueStatus.active }} active, {{ queueStatus.queued }} queued
    </div>
  </div>
</template>
```

---

## Example: Lazy Image Loading

```vue
<script setup lang="ts">
import { usePerformance } from '~/composables/usePerformance'

const { useLazyImage } = usePerformance()

const imageSrc = '/uploads/background/large-image.png'
const { imageRef, isLoaded } = useLazyImage(0.1)
</script>

<template>
  <div class="image-container">
    <img
      ref="imageRef"
      :data-src="imageSrc"
      :class="{ loaded: isLoaded }"
      alt="Background"
    >
    <div v-if="!isLoaded" class="skeleton-loader" />
  </div>
</template>

<style scoped>
img {
  opacity: 0;
  transition: opacity 0.3s;
}
img.loaded {
  opacity: 1;
}
.skeleton-loader {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}
@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
```

---

## Integration Checklist

### Assets Page (`templates/assets.vue`)
- [x] File validation (image/font) before upload
- [x] Image compression before upload
- [x] Upload progress bar with speed
- [x] Retry failed uploads (3 attempts)
- [x] Network status detection
- [x] Validation error messages
- [ ] Multiple file upload with queue

### Template Editor (`templates/[id].vue`)
- [ ] Auto-save with debounce (1s)
- [ ] Template name sanitization
- [ ] Optimistic updates
- [ ] Undo/redo history
- [ ] Save status indicator

### Generate Page (`generate.vue`)
- [ ] CSV file validation
- [ ] CSV content validation (max rows, required columns)
- [ ] Auto-detect column mappings
- [ ] Chunked processing for large datasets
- [ ] Progress bar for bulk generation

### Sign In/Up Pages
- [x] Email validation (already implemented)
- [x] Password strength meter (signup already has this)
- [ ] Form-level validation
- [ ] Field-level error display
- [ ] Rate limit login attempts

### Global
- [ ] Offline detection toast
- [ ] Error message mapping (API → user-friendly)
- [ ] Loading states on all async operations
- [ ] Toast notifications system

---

## Next Steps

1. **Enhance assets.vue** - Add full validation + compression + progress
2. **Add auto-save to editor** - Debounce template updates
3. **Enhance CSV upload** - Add validation + mapping detection
4. **Add form validation** - Sign in/up forms with field validators
5. **Add error handling** - Map API errors to user messages
6. **Add offline detection** - Global network status watcher

Would you like me to implement any of these specific enhancements?
