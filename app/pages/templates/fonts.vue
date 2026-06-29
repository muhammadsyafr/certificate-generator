<template>
  <div class="page">
    <div class="page-container">
      <header style="padding-top: var(--space-10); padding-bottom: var(--space-8); margin-bottom: var(--space-8);">
        <NuxtLink to="/" class="inline-flex items-center" style="gap: var(--space-2); margin-bottom: var(--space-6); color: var(--color-text-secondary); font-size: var(--text-sm); font-weight: var(--weight-medium); transition: color var(--duration-fast) var(--ease-standard);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>Back</span>
        </NuxtLink>
        
        <div class="flex items-start justify-between" style="gap: var(--space-8); margin-bottom: var(--space-8);">
          <div>
            <h1 class="text-heading-lg" style="margin-bottom: var(--space-3);">Custom Fonts</h1>
            <p class="text-body" style="color: var(--color-text-secondary);">Upload custom fonts to use in your certificate templates</p>
          </div>
          <button @click="showUploadForm = !showUploadForm" class="btn-primary" style="display: flex; align-items: center; gap: var(--space-2); flex-shrink: 0;">
            <BaseIcon name="upload" :size="18" />
            Upload Font
          </button>
        </div>
      </header>

      <!-- Upload Form (Collapsible) -->
      <div v-if="showUploadForm" class="card" style="padding: var(--space-8); margin-bottom: var(--space-8);">
        <div class="flex items-center justify-between" style="margin-bottom: var(--space-6);">
          <div class="flex items-center" style="gap: var(--space-4);">
            <div style="width: 48px; height: 48px; border-radius: var(--radius-xl); background: var(--color-accent-muted); display: flex; align-items: center; justify-content: center;">
              <BaseIcon name="font" :size="20" />
            </div>
            <h2 class="text-heading-sm">Upload New Font</h2>
          </div>
          <button @click="showUploadForm = false" class="btn-ghost" style="padding: var(--space-2); color: var(--color-text-secondary);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <form @submit.prevent="uploadFont" style="display: flex; flex-direction: column; gap: var(--space-5);">
          <div class="grid grid-cols-1 md:grid-cols-2" style="gap: var(--space-5);">
            <div class="form-group">
              <label class="form-label">Font Family Name</label>
              <input
                v-model="fontFamily"
                type="text"
                placeholder="e.g. My Custom Font"
                required
              />
              <p style="font-size: var(--text-xs); color: var(--color-text-muted); margin-top: var(--space-2);">This name will appear in the font dropdown</p>
            </div>
            <div class="form-group">
              <label class="form-label">Font Files</label>
              <input
                ref="fileInput"
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                @change="onFileChange"
                multiple
                required
              />
              <p style="font-size: var(--text-xs); color: var(--color-text-muted); margin-top: var(--space-2);">Select multiple files (Regular, Bold, Italic, etc.)</p>
            </div>
          </div>
          
          <div v-if="selectedFiles.length > 0" class="card" style="padding: var(--space-4); background: var(--color-surface-hover);">
            <p class="text-body-sm" style="font-weight: var(--weight-semibold); margin-bottom: var(--space-3);">Selected files ({{ selectedFiles.length }})</p>
            <ul style="display: flex; flex-direction: column; gap: var(--space-2);">
              <li v-for="(file, idx) in selectedFiles" :key="idx" class="text-caption" style="color: var(--color-text-secondary); display: flex; align-items: center; gap: var(--space-2);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <path d="M14 2v6h6"/>
                </svg>
                {{ file.name }} <span style="color: var(--color-text-muted);">({{ formatBytes(file.size) }})</span>
              </li>
            </ul>
          </div>

          <button
            type="submit"
            :disabled="selectedFiles.length === 0 || !fontFamily || uploading"
            class="btn-primary"
            style="align-self: flex-start;"
          >
            {{ uploading ? `Uploading ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}...` : `Upload ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}` }}
          </button>
        </form>
      </div>

      <div v-if="pending" class="card" style="padding: var(--space-16); text-align: center;">
        <div class="text-body" style="color: var(--color-text-secondary);">Loading fonts...</div>
      </div>

      <div v-else-if="error" class="card" style="padding: var(--space-16); text-align: center;">
        <div class="text-body" style="color: var(--color-text-secondary);">Failed to load fonts</div>
      </div>

      <div v-else-if="fonts.length === 0" class="card-empty">
        <div class="text-body" style="color: var(--color-text-secondary); margin-bottom: var(--space-5);">No custom fonts yet</div>
        <button v-if="!showUploadForm" @click="showUploadForm = true" class="btn-secondary btn-sm">
          Upload your first font
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style="gap: var(--space-6);">
        <div
          v-for="family in fontFamilies"
          :key="family.name"
          class="card"
          style="padding: var(--space-6);"
        >
          <div class="flex items-center justify-between" style="margin-bottom: var(--space-4);">
            <div class="flex items-center" style="gap: var(--space-3);">
              <div style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: var(--color-accent-muted); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="4 7 4 4 20 4 20 7"/>
                  <line x1="9" y1="20" x2="15" y2="20"/>
                  <line x1="12" y1="4" x2="12" y2="20"/>
                </svg>
              </div>
              <div>
                <h3 class="text-body" style="font-weight: var(--weight-semibold); margin-bottom: var(--space-1);">
                  {{ family.name }}
                </h3>
                <p class="text-caption" style="color: var(--color-text-muted);">
                  {{ family.variants.length }} variant{{ family.variants.length > 1 ? 's' : '' }}
                </p>
              </div>
            </div>
            <button
              @click="deleteFontFamily(family.name)"
              class="btn-ghost"
              style="padding: var(--space-2); color: var(--color-text-muted);"
              title="Delete font family"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>

          <div style="padding: var(--space-4); background: var(--color-surface-hover); border-radius: var(--radius-lg); margin-bottom: var(--space-4);">
            <p :style="`font-family: '${family.name}'; font-size: var(--text-2xl); text-align: center;`">
              The quick brown fox
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: var(--space-2);">
            <div v-for="variant in family.variants" :key="variant.id" class="text-caption" style="color: var(--color-text-secondary); display: flex; justify-content: space-between; padding: var(--space-2); background: var(--color-surface-hover); border-radius: var(--radius-md);">
              <span>{{ variant.filename }}</span>
              <span style="color: var(--color-text-muted);">{{ variant.fontWeight }} {{ variant.fontStyle !== 'normal' ? variant.fontStyle : '' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: fonts, pending, error, refresh } = await useFetch('/api/fonts')

const showUploadForm = ref(false)
const fontFamily = ref('')
const selectedFiles = ref<File[]>([])
const uploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Group fonts by family
const fontFamilies = computed(() => {
  if (!fonts.value) return []
  
  const families = new Map<string, any[]>()
  
  fonts.value.forEach(font => {
    if (!families.has(font.fontFamily)) {
      families.set(font.fontFamily, [])
    }
    families.get(font.fontFamily)!.push(font)
  })
  
  return Array.from(families.entries()).map(([name, variants]) => ({
    name,
    variants: variants.sort((a, b) => {
      // Sort by weight first, then style
      const weightA = parseInt(a.fontWeight || '400')
      const weightB = parseInt(b.fontWeight || '400')
      if (weightA !== weightB) return weightA - weightB
      return a.fontStyle === 'italic' ? 1 : -1
    })
  }))
})

// Load custom fonts dynamically
watch(fonts, (newFonts) => {
  if (newFonts && newFonts.length > 0) {
    newFonts.forEach(font => {
      const fontFace = new FontFace(
        font.fontFamily, 
        `url(${font.filepath})`,
        {
          weight: font.fontWeight || 'normal',
          style: font.fontStyle || 'normal'
        }
      )
      fontFace.load().then((loadedFont) => {
        document.fonts.add(loadedFont)
      }).catch(err => {
        console.error(`Failed to load font ${font.fontFamily}:`, err)
      })
    })
  }
}, { immediate: true })

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 10) / 10 + ' ' + sizes[i]
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  
  if (files.length === 0) {
    selectedFiles.value = []
    return
  }

  // Validate each file
  const validFiles = files.filter(file => {
    if (file.size > 5_000_000) {
      alert(`${file.name} is too large (max 5MB)`)
      return false
    }
    return true
  })

  selectedFiles.value = validFiles
}

async function uploadFont() {
  if (selectedFiles.value.length === 0 || !fontFamily.value) return

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('fontFamily', fontFamily.value)
    
    selectedFiles.value.forEach(file => {
      formData.append('files', file)
    })

    await $fetch('/api/fonts', {
      method: 'POST',
      body: formData,
    })

    selectedFiles.value = []
    fontFamily.value = ''
    if (fileInput.value) fileInput.value.value = ''
    showUploadForm.value = false
    refresh()
  } catch (e) {
    alert('Upload failed: ' + (e as Error).message)
  } finally {
    uploading.value = false
  }
}

async function deleteFontFamily(familyName: string) {
  if (!confirm(`Delete all variants of "${familyName}"? This cannot be undone.`)) return

  try {
    const familyFonts = fonts.value?.filter(f => f.fontFamily === familyName) || []
    
    for (const font of familyFonts) {
      await $fetch(`/api/fonts/${font.id}`, { method: 'DELETE' })
    }
    
    refresh()
  } catch (e) {
    alert('Failed to delete font family')
  }
}
</script>
