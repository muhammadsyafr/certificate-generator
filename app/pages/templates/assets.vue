<template>
  <div class="page">
    <div class="page-container">
      <header class="page-header">
        <NuxtLink to="/" class="back-link">← Back</NuxtLink>
        <h1 class="page-title">Asset Library</h1>
        <p class="page-desc">Upload logos, backgrounds, and free images for your certificates</p>
      </header>

      <div class="card mb-12">
        <h2 class="section-title mb-6">Upload New Asset</h2>
        <form @submit.prevent="uploadAsset" class="space-y-5">
          <div class="form-group">
            <label class="form-label">Category</label>
            <select v-model="uploadType" class="flex-1">
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
              class="mt-2"
            />
          </div>
          <div class="form-group">
            <label class="form-label">File (PNG/JPG only, max 2MB)</label>
            <input
              ref="fileInput"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              @change="onFileChange"
            />
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

      <div v-if="pending" class="card-empty">
        <div class="text-muted text-body-lg">Loading assets...</div>
      </div>

      <div v-else-if="error" class="card-empty">
        <div class="text-muted text-body-lg">Failed to load assets</div>
      </div>

      <div v-else>
        <section v-for="cat in categories" :key="cat" class="mb-12">
          <h2 class="section-title mb-6 capitalize">{{ cat }}</h2>
          <div v-if="getByCategory(cat).length === 0" class="text-muted text-body">No assets in this category</div>
          <div v-else class="card-grid card-grid-4">
            <div
              v-for="asset in getByCategory(cat)"
              :key="asset.id"
              class="card group"
            >
              <div :class="cat === 'background' ? 'aspect-video' : 'aspect-square'" class="bg-bg rounded-md mb-4 flex items-center justify-center overflow-hidden">
                <img :src="asset.filepath" :alt="asset.filename" class="max-w-full max-h-full object-contain" />
              </div>
              <div class="text-caption mb-3 truncate" :title="asset.filename">
                {{ asset.filename }}
              </div>
              <button
                @click="deleteAsset(asset.id)"
                class="btn-secondary btn-sm w-full"
              >
                Delete
              </button>
            </div>
          </div>
        </section>
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

const categories = computed(() => [...new Set(assets.value?.map(a => a.type) || [])].sort())

function getByCategory(type: string) {
  return assets.value?.filter(a => a.type === type) || []
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