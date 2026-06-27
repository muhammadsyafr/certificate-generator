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
            <h1 class="text-heading-lg" style="margin-bottom: var(--space-3);">Asset Library</h1>
            <p class="text-body" style="color: var(--color-text-secondary);">Upload and manage images for your certificate templates</p>
          </div>
          <button @click="showUploadForm = !showUploadForm" class="btn-primary" style="display: flex; align-items: center; gap: var(--space-2); flex-shrink: 0;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Upload Asset
          </button>
        </div>

        <!-- Search and Filter -->
        <div class="card" style="padding: var(--space-5); display: flex; align-items: center; gap: var(--space-4);">
          <div style="flex: 1; position: relative;">
            <div style="position: absolute; left: var(--space-4); top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--color-text-muted);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search assets..."
              style="padding-left: calc(var(--space-4) * 2 + 18px);"
            />
          </div>
          <div style="width: 1px; height: 32px; background: var(--color-border);"></div>
          <div style="min-width: 220px; position: relative;">
            <div style="position: absolute; left: var(--space-4); top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--color-text-muted);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18M7 12h10M10 18h4"/>
              </svg>
            </div>
            <select v-model="filterCategory" style="padding-left: calc(var(--space-4) * 2 + 18px); appearance: none; background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg width=%2712%27 height=%278%27 viewBox=%270 0 12 8%27 fill=%27none%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M1 1.5L6 6.5L11 1.5%27 stroke=%27%23666%27 stroke-width=%271.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3e%3c/svg%3e'); background-repeat: no-repeat; background-position: right var(--space-4) center; padding-right: calc(var(--space-4) * 2 + 12px);">
              <option value="">All Categories</option>
              <option v-for="cat in categories" :key="cat" :value="cat" class="capitalize">{{ cat }}</option>
            </select>
          </div>
        </div>
      </header>

      <!-- Upload Form (Collapsible) -->
      <div v-if="showUploadForm" class="card" style="padding: var(--space-8); margin-bottom: var(--space-8);">
        <div class="flex items-center justify-between" style="margin-bottom: var(--space-6);">
          <div class="flex items-center" style="gap: var(--space-4);">
            <div style="width: 48px; height: 48px; border-radius: var(--radius-xl); background: var(--color-accent-muted); display: flex; align-items: center; justify-content: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            <h2 class="text-heading-sm">Upload New Asset</h2>
          </div>
          <button @click="showUploadForm = false" class="btn-ghost" style="padding: var(--space-2); color: var(--color-text-secondary);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <form @submit.prevent="uploadAsset" style="display: flex; flex-direction: column; gap: var(--space-5);">
          <div class="grid grid-cols-1 md:grid-cols-2" style="gap: var(--space-5);">
            <div class="form-group">
              <label class="form-label">Category</label>
              <select v-model="uploadType">
                <option value="logo">Logo</option>
                <option value="background">Background</option>
                <option value="free-image">Free Image</option>
                <option value="__custom__">Custom...</option>
              </select>
              <input
                v-if="uploadType === '__custom__'"
                v-model="customCategory"
                type="text"
                placeholder="Enter category name..."
                style="margin-top: var(--space-3);"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Image File</label>
              <input
                ref="fileInput"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                @change="onFileChange"
              />
              <p style="font-size: var(--text-xs); color: var(--color-text-muted); margin-top: var(--space-2);">PNG or JPG, max 2MB</p>
            </div>
          </div>
          <button
            type="submit"
            :disabled="!selectedFile || uploading"
            class="btn-primary"
            style="align-self: flex-start;"
          >
            {{ uploading ? 'Uploading...' : 'Upload Asset' }}
          </button>
        </form>
      </div>

      <div v-if="pending" class="card" style="padding: var(--space-16); text-align: center;">
        <div class="text-body" style="color: var(--color-text-secondary);">Loading assets...</div>
      </div>

      <div v-else-if="error" class="card" style="padding: var(--space-16); text-align: center;">
        <div class="text-body" style="color: var(--color-text-secondary);">Failed to load assets</div>
      </div>

      <div v-else-if="filteredAssets.length === 0" class="card-empty">
        <div class="text-body" style="color: var(--color-text-secondary); margin-bottom: var(--space-4);">
          {{ searchQuery || filterCategory ? 'No assets match your search' : 'No assets yet' }}
        </div>
        <button v-if="!showUploadForm && !searchQuery && !filterCategory" @click="showUploadForm = true" class="btn-secondary btn-sm">
          Upload your first asset
        </button>
      </div>

      <div v-else style="display: flex; flex-direction: column; gap: var(--space-10);">
        <section v-for="cat in visibleCategories" :key="cat">
          <div class="flex items-center" style="gap: var(--space-4); margin-bottom: var(--space-6);">
            <div style="width: 44px; height: 44px; border-radius: var(--radius-xl); background: var(--color-accent-muted); display: flex; align-items: center; justify-content: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
            <h2 class="text-heading-sm capitalize">{{ cat }}</h2>
            <span class="text-body-sm" style="color: var(--color-text-muted);">({{ getFilteredByCategory(cat).length }})</span>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" style="gap: var(--space-5);">
            <div
              v-for="asset in getFilteredByCategory(cat)"
              :key="asset.id"
              class="card group hover:border-obsidian"
              style="padding: var(--space-4);"
            >
              <div 
                :class="cat === 'background' ? 'aspect-video' : 'aspect-square'" 
                style="border-radius: var(--radius-lg); margin-bottom: var(--space-4); display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid var(--color-border); background: var(--color-surface-hover); cursor: pointer;" 
                @click="viewAsset(asset)"
              >
                <img :src="asset.filepath" :alt="asset.filename" style="max-width: 100%; max-height: 100%; object-fit: contain;" loading="lazy" />
              </div>
              
              <div class="text-body-sm" style="margin-bottom: var(--space-3); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: var(--weight-medium);" :title="asset.filename">
                {{ asset.filename }}
              </div>
              
              <!-- Metadata -->
              <div v-if="asset.metadata" class="flex items-center" style="gap: var(--space-2); margin-bottom: var(--space-4); font-size: var(--text-xs); color: var(--color-text-muted);">
                <span v-if="asset.metadata.width && asset.metadata.height">{{ asset.metadata.width }}×{{ asset.metadata.height }}</span>
                <span v-if="asset.metadata.width && asset.metadata.height && asset.metadata.size">•</span>
                <span v-if="asset.metadata.size">{{ formatBytes(asset.metadata.size) }}</span>
              </div>
              
              <!-- Quick Actions -->
              <div style="display: flex; flex-direction: column; gap: var(--space-2);">
                <button
                  @click="copyAssetUrl(asset)"
                  class="btn-secondary btn-sm"
                  style="display: flex; align-items: center; justify-content: center; gap: var(--space-2); font-size: var(--text-xs);"
                  :title="'Copy URL'"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                  </svg>
                  {{ copiedId === asset.id ? 'Copied!' : 'Copy URL' }}
                </button>
                <button
                  @click="deleteAsset(asset.id)"
                  class="btn-ghost btn-sm"
                  style="font-size: var(--text-xs);"
                  title="Delete asset"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Fullscreen Modal -->
      <div v-if="selectedAsset" class="fixed inset-0 z-50 flex items-center justify-center" style="background: rgba(0, 0, 0, 0.92); padding: var(--space-6);" @click="closeModal">
        <button @click="closeModal" class="absolute btn-ghost" style="top: var(--space-6); right: var(--space-6); width: 48px; height: 48px; border-radius: var(--radius-full); background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; transition: background var(--duration-fast) var(--ease-standard); z-index: 10;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        
        <!-- Asset Info Overlay -->
        <div class="absolute" style="top: var(--space-6); left: var(--space-6); background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(12px); border-radius: var(--radius-xl); padding: var(--space-5); color: white; max-width: 320px;">
          <div style="font-size: var(--text-base); font-weight: var(--weight-semibold); margin-bottom: var(--space-2); word-break: break-word;">{{ selectedAsset.filename }}</div>
          <div v-if="selectedAsset.metadata" style="font-size: var(--text-sm); opacity: 0.85; display: flex; flex-direction: column; gap: var(--space-1);">
            <div v-if="selectedAsset.metadata.width && selectedAsset.metadata.height">
              Dimensions: {{ selectedAsset.metadata.width }} × {{ selectedAsset.metadata.height }}
            </div>
            <div v-if="selectedAsset.metadata.size">Size: {{ formatBytes(selectedAsset.metadata.size) }}</div>
            <div class="capitalize">Category: {{ selectedAsset.type }}</div>
          </div>
        </div>
        
        <div style="max-width: 90vw; max-height: 90vh; width: 100%; display: flex; align-items: center; justify-content: center;" @click.stop>
          <img :src="selectedAsset.filepath" :alt="selectedAsset.filename" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: var(--radius-lg);" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: assets, pending, error, refresh } = await useFetch('/api/assets')

const uploadType = ref('logo')
const customCategory = ref('')
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const selectedAsset = ref<any>(null)
const showUploadForm = ref(false)
const searchQuery = ref('')
const filterCategory = ref('')
const copiedId = ref<number | null>(null)

const categories = computed(() => [...new Set(assets.value?.map(a => a.type) || [])].sort())

const filteredAssets = computed(() => {
  let result = assets.value || []
  
  if (filterCategory.value) {
    result = result.filter(a => a.type === filterCategory.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(a => 
      a.filename.toLowerCase().includes(query) ||
      a.type.toLowerCase().includes(query)
    )
  }
  
  return result
})

const visibleCategories = computed(() => {
  const cats = [...new Set(filteredAssets.value.map(a => a.type))].sort()
  return cats
})

function getByCategory(type: string) {
  return assets.value?.filter(a => a.type === type) || []
}

function getFilteredByCategory(type: string) {
  return filteredAssets.value.filter(a => a.type === type)
}

function viewAsset(asset: any) {
  selectedAsset.value = asset
}

function closeModal() {
  selectedAsset.value = null
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 10) / 10 + ' ' + sizes[i]
}

async function copyAssetUrl(asset: any) {
  try {
    const fullUrl = window.location.origin + asset.filepath
    await navigator.clipboard.writeText(fullUrl)
    copiedId.value = asset.id
    setTimeout(() => {
      copiedId.value = null
    }, 2000)
  } catch (e) {
    alert('Failed to copy URL')
  }
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    selectedFile.value = null
    return
  }

  if (file.size > 2_000_000) {
    alert('File must be under 2 MB')
    selectedFile.value = null
    if (fileInput.value) fileInput.value.value = ''
    return
  }

  selectedFile.value = file
}

async function uploadAsset() {
  if (!selectedFile.value) return

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    const type = uploadType.value === '__custom__' ? (customCategory.value || 'misc') : uploadType.value
    formData.append('type', type)

    await $fetch('/api/assets', {
      method: 'POST',
      body: formData,
    })

    selectedFile.value = null
    if (fileInput.value) fileInput.value.value = ''
    showUploadForm.value = false
    refresh()
  } catch (e) {
    alert('Upload failed: ' + (e as Error).message)
  } finally {
    uploading.value = false
  }
}

async function deleteAsset(id: number) {
  if (!confirm('Delete this asset? This cannot be undone.')) return

  try {
    await $fetch(`/api/assets/${id}`, { method: 'DELETE' })
    refresh()
  } catch (e) {
    alert('Failed to delete asset')
  }
}
</script>