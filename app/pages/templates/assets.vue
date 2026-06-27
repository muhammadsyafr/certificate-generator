<template>
  <div class="page">
    <div class="page-container">
      <header class="pt-8 pb-6 mb-8">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-body-sm text-muted hover:text-foreground transition-colors mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>Back</span>
        </NuxtLink>
        <h1 class="text-heading-xl font-bold tracking-tight mb-2">Asset Library</h1>
        <p class="text-body text-muted">Upload logos, backgrounds, and free images for your certificates</p>
      </header>

      <div class="card p-6 mb-8">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </div>
          <h2 class="text-heading font-semibold">Upload New Asset</h2>
        </div>
        <form @submit.prevent="uploadAsset" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-body-sm font-medium mb-2">Category</label>
              <select v-model="uploadType" class="w-full">
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
                class="w-full mt-2"
              />
            </div>
            <div>
              <label class="block text-body-sm font-medium mb-2">File (PNG/JPG only, max 2MB)</label>
              <input
                ref="fileInput"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                @change="onFileChange"
                class="w-full"
              />
            </div>
          </div>
          <button
            type="submit"
            :disabled="!selectedFile || uploading"
            class="btn-primary"
          >
            {{ uploading ? 'Uploading...' : 'Upload Asset' }}
          </button>
        </form>
      </div>

      <div v-if="pending" class="card p-12 text-center">
        <div class="text-muted text-body">Loading assets...</div>
      </div>

      <div v-else-if="error" class="card p-12 text-center">
        <div class="text-muted text-body">Failed to load assets</div>
      </div>

      <div v-else class="space-y-8">
        <section v-for="cat in categories" :key="cat">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
            <h2 class="text-heading font-semibold capitalize">{{ cat }}</h2>
          </div>
          <div v-if="getByCategory(cat).length === 0" class="card p-8 text-center">
            <div class="text-muted text-body-sm">No assets in this category</div>
          </div>
          <div v-else class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div
              v-for="asset in getByCategory(cat)"
              :key="asset.id"
              class="card p-2 group hover:border-accent/50 transition-colors"
            >
              <div :class="cat === 'background' ? 'aspect-video' : 'aspect-square'" class="bg-bg rounded mb-2 flex items-center justify-center overflow-hidden border border-border cursor-pointer" @click="viewAsset(asset)">
                <img :src="asset.filepath" :alt="asset.filename" class="max-w-full max-h-full object-contain" />
              </div>
              <div class="text-caption mb-2 truncate" :title="asset.filename">
                {{ asset.filename }}
              </div>
              <div class="flex gap-1">
                <button
                  @click="viewAsset(asset)"
                  class="btn-secondary btn-sm flex-1 text-xs"
                >
                  View
                </button>
                <button
                  @click="deleteAsset(asset.id)"
                  class="btn-secondary btn-sm flex-1 text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Fullscreen Modal -->
      <div v-if="selectedAsset" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" @click="closeModal">
        <button @click="closeModal" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div class="max-w-6xl w-full flex items-center justify-center" @click.stop style="max-height: 90vh;">
          <img :src="selectedAsset.filepath" :alt="selectedAsset.filename" class="max-w-full max-h-full object-contain" />
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

const categories = computed(() => [...new Set(assets.value?.map(a => a.type) || [])].sort())

function getByCategory(type: string) {
  return assets.value?.filter(a => a.type === type) || []
}

function viewAsset(asset: any) {
  selectedAsset.value = asset
}

function closeModal() {
  selectedAsset.value = null
}

function formatFileSize(filepath: string) {
  // Placeholder - would need actual file size from API
  return 'Image'
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
    refresh()
  } catch (e) {
    alert('Upload failed: ' + (e as Error).message)
  } finally {
    uploading.value = false
  }
}

async function deleteAsset(id: number) {
  if (!confirm('Delete this asset?')) return

  try {
    await $fetch(`/api/assets/${id}`, { method: 'DELETE' })
    refresh()
  } catch (e) {
    alert('Failed to delete asset')
  }
}
</script>