<template>
  <div class="al-root">
    <!-- TOP BAR -->
    <header class="al-topbar">
      <NuxtLink to="/" class="al-logo">
        <span class="al-logo-mark">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="9.5" r="5.5" stroke="#F5521E" stroke-width="2"/>
            <path d="M9 14l-2 7 5-3 5 3-2-7" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="al-logo-text">Certif<span class="al-logo-accent">y</span></span>
      </NuxtLink>

      <div class="al-topbar-divider" />

      <nav class="al-breadcrumb">
        <NuxtLink to="/templates" class="al-breadcrumb-link">Templates</NuxtLink>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#6E665E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="al-breadcrumb-current">Asset Library</span>
      </nav>

      <div class="al-topbar-actions">
        <div class="al-plan-badge">
          Free plan
          <a href="/#pricing" class="al-plan-upgrade">Upgrade</a>
        </div>
        <NuxtLink to="/templates/new" class="al-btn-editor">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 20l3.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20z" stroke="#14110E" stroke-width="1.8" stroke-linejoin="round"/></svg>
          Open editor
        </NuxtLink>
        <div class="al-avatar">A</div>
      </div>
    </header>

    <!-- BODY -->
    <div class="al-body">
      <!-- SIDEBAR -->
      <aside class="al-sidebar">
        <div class="al-sidebar-label">Categories</div>
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="al-tab"
          :class="{ 'al-tab--active': activeTab === tab.key }"
          @click="switchTab(tab.key)"
        >
          <span class="al-tab-icon" v-html="tab.iconSvg" />
          <span class="al-tab-label">{{ tab.label }}</span>
          <span class="al-tab-count">{{ tab.count }}</span>
          <span v-if="tab.locked" class="al-tab-pro">PRO</span>
        </button>

        <div class="al-pro-cta">
          <div class="al-pro-cta-title">Unlock all assets</div>
          <div class="al-pro-cta-desc">Logos, custom fonts and unlimited backgrounds on Pro.</div>
          <a href="/#pricing" class="al-pro-cta-btn">See plans</a>
        </div>
      </aside>

      <!-- MAIN -->
      <main class="al-main">
        <!-- header -->
        <div class="al-header">
          <div>
            <h1 class="al-title">{{ currentTab.title }}</h1>
            <p class="al-subtitle">{{ currentTab.subtitle }}</p>
          </div>
          <div class="al-toolbar">
            <BaseSearchInput
              v-model="searchQ"
              :placeholder="`Search ${currentTab.label.toLowerCase()}…`"
            />
            <button
              class="al-upload-btn"
              :class="{ 'al-upload-btn--locked': currentTab.locked }"
              :disabled="currentTab.locked"
              @click="onUploadClick"
              @mouseenter="ctaIn"
              @mouseleave="ctaOut"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M12 16V4m0 0l-4 4m4-4l4 4M5 20h14" :stroke="currentTab.locked ? '#6E665E' : '#fff'" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ currentTab.locked ? '🔒 Pro only' : `Upload ${currentTab.label.toLowerCase()}` }}
            </button>
          </div>
        </div>

        <!-- usage bar -->
        <div v-if="activeTab === 'backgrounds'" class="al-usage">
          <div class="al-usage-main">
            <div class="al-usage-row">
              <span class="al-usage-title">Storage usage</span>
              <span class="al-usage-stat">{{ bgAssets.length }} / 1 slot used</span>
            </div>
            <div class="al-usage-bar">
              <div class="al-usage-fill" :style="{ width: Math.min(bgAssets.length * 100, 100) + '%' }" />
            </div>
            <div class="al-usage-note">Free plan: 1 background slot. Upgrade for unlimited.</div>
          </div>
          <a href="/#pricing" class="al-usage-upgrade">Upgrade for more</a>
        </div>

        <!-- locked -->
        <div v-if="currentTab.locked" class="al-locked">
          <div class="al-locked-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="9" rx="2" stroke="#F5521E" stroke-width="1.9"/>
              <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#F5521E" stroke-width="1.9"/>
            </svg>
          </div>
          <div class="al-locked-title">{{ lockedTitle }}</div>
          <div class="al-locked-desc">{{ lockedDesc }}</div>
          <a href="/#pricing" class="al-locked-btn">
            Upgrade to Pro
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
        </div>

        <!-- grid -->
        <div v-if="!currentTab.locked && filteredAssets.length > 0" class="al-grid">
          <div
            v-for="item in filteredAssets"
            :key="item.id"
            class="al-card"
            :class="{ 'al-card--selected': selectedId === item.id }"
            @click="toggleSelect(item.id)"
          >
            <div class="al-card-thumb">
              <!-- background image -->
              <div v-if="activeTab === 'backgrounds'" class="al-thumb-bg">
                <img v-if="item.filepath" :src="item.filepath" :alt="item._name" class="al-thumb-bg-img" />
                <div v-else class="al-thumb-bg-fallback" :style="{ background: item._gradient }">
                  <div class="al-thumb-bg-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="#14110E" stroke-width="2"/><path d="M3 16l5-4 4 3 4-4 5 4" stroke="#14110E" stroke-width="2" stroke-linejoin="round"/></svg>
                  </div>
                </div>
              </div>
              <!-- font sample -->
              <div v-else-if="activeTab === 'fonts'" class="al-thumb-font">
                <span class="al-thumb-font-aa" :style="{ fontFamily: item._fontFamily }">Aa</span>
                <span class="al-thumb-font-name">{{ item._fontFamily }}</span>
              </div>
              <!-- logo -->
              <div v-else class="al-thumb-img">
                <img v-if="item.filepath" :src="item.filepath" :alt="item._name" class="al-thumb-img-el" />
              </div>

              <div v-if="item._inUse" class="al-badge-inuse">In use</div>
              <div v-if="selectedId === item.id" class="al-badge-check">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l4.5 4.5L19 7" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
            </div>

            <div class="al-card-info">
              <div class="al-card-info-row">
                <div class="al-card-info-text">
                  <div class="al-card-name">{{ item._name }}</div>
                  <div class="al-card-meta">{{ item._meta }}</div>
                </div>
                <BaseContextMenu>
                  <template #trigger="{ toggle }">
                    <button class="al-card-menu" @click.stop="toggle" @mouseenter="softIn" @mouseleave="softOut">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1.4" fill="#6E665E"/><circle cx="12" cy="12" r="1.4" fill="#6E665E"/><circle cx="12" cy="19" r="1.4" fill="#6E665E"/></svg>
                    </button>
                  </template>
                  <template #default="{ close }">
                    <button class="al-menu-item" @click.stop="copyAssetUrl(item); close()" @mouseenter="softIn" @mouseleave="softOut">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="#14110E" stroke-width="1.8"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="#14110E" stroke-width="1.8"/></svg>
                      {{ copiedId === item.id ? 'Copied!' : 'Copy URL' }}
                    </button>
                    <div class="al-menu-divider" />
                    <button class="al-menu-item al-menu-item--danger" @click.stop="confirmDeleteAsset(item); close()" @mouseenter="delHoverIn" @mouseleave="delHoverOut">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13" stroke="#DC3545" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      Delete
                    </button>
                  </template>
                </BaseContextMenu>
              </div>
            </div>
          </div>

          <!-- empty upload slot -->
          <button
            v-if="activeTab === 'backgrounds' && bgAssets.length < 1 && !searchQ"
            class="al-slot-card"
            @click="onUploadClick"
            @mouseenter="slotIn"
            @mouseleave="slotOut"
          >
            <span class="al-slot-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 16V4m0 0l-4 4m4-4l4 4M5 20h14" stroke="#14110E" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <span class="al-slot-label">Upload</span>
          </button>
        </div>

        <!-- empty search -->
        <div v-if="!currentTab.locked && filteredAssets.length === 0 && searchQ" class="al-empty">
          <div class="al-empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#6E665E" stroke-width="1.8"/><path d="M20 20l-3-3" stroke="#6E665E" stroke-width="1.8" stroke-linecap="round"/></svg>
          </div>
          <div class="al-empty-title">No assets match "{{ searchQ }}"</div>
          <div class="al-empty-desc">Try a different search or clear the filter.</div>
          <button class="al-empty-clear" @click="searchQ = ''">Clear search</button>
        </div>
      </main>

      <!-- DETAIL PANEL -->
      <aside v-if="selectedAsset" class="al-detail">
        <div class="al-detail-head">
          <div class="al-detail-head-title">Asset detail</div>
          <button class="al-detail-head-close" @click="selectedId = null" @mouseenter="softIn" @mouseleave="softOut">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#14110E" stroke-width="1.9" stroke-linecap="round"/></svg>
          </button>
        </div>

        <div class="al-detail-preview">
          <div v-if="activeTab === 'backgrounds'" class="al-detail-preview-bg">
            <img v-if="selectedAsset.filepath" :src="selectedAsset.filepath" class="al-detail-preview-bg-img" />
            <div v-else class="al-detail-preview-bg-fallback" :style="{ background: selectedAsset._gradient || '#F7F1E9' }" />
          </div>
          <div v-else-if="activeTab === 'fonts'" class="al-detail-preview-font">
            <span class="al-detail-preview-aa" :style="{ fontFamily: selectedAsset._fontFamily }">Aa</span>
          </div>
          <img v-else-if="selectedAsset.filepath" :src="selectedAsset.filepath" class="al-detail-preview-img" />
        </div>

        <div class="al-detail-body">
          <div class="al-detail-name">{{ selectedAsset._name }}</div>
          <div class="al-detail-meta">{{ selectedAsset._meta }}</div>

          <div class="al-detail-fields">
            <div class="al-detail-field"><span>Type</span><span>{{ selectedAsset._typeLabel }}</span></div>
            <div class="al-detail-divider" />
            <div class="al-detail-field"><span>Size</span><span>{{ selectedAsset._size || '—' }}</span></div>
            <div class="al-detail-divider" />
            <div class="al-detail-field"><span>Added</span><span>{{ selectedAsset._date }}</span></div>
            <div class="al-detail-divider" />
            <div class="al-detail-field"><span>Used in</span><span>{{ selectedAsset._usedIn }}</span></div>
          </div>

          <div class="al-detail-actions">
            <button class="al-detail-use" @click="useInEditor">Use in editor</button>
            <button class="al-detail-delete" @click="confirmDeleteAsset(selectedAsset)">Delete asset</button>
          </div>
        </div>
      </aside>
    </div>

    <!-- UPLOAD MODAL -->
    <Teleport to="body">
      <Transition name="al-modal">
        <div v-if="showUploadModal" class="al-modal-overlay" @click.self="closeUploadModal">
          <div class="al-modal" @click.stop>
            <div class="al-modal-head">
              <div class="al-modal-title">Upload {{ currentTab.label.toLowerCase() }}</div>
              <button class="al-modal-close" @click="closeUploadModal">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#14110E" stroke-width="1.9" stroke-linecap="round"/></svg>
              </button>
            </div>

            <!-- drop zone -->
            <div
              class="al-dropzone"
              :class="{ 'al-dropzone--error': validationError }"
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="onDrop"
            >
              <div class="al-dropzone-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="#14110E" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M5 20h14" stroke="#F5521E" stroke-width="1.9" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="al-dropzone-title">{{ selectedFile ? selectedFile.name : 'Drop file here' }}</div>
              <div class="al-dropzone-sub">or <span class="al-dropzone-link">browse</span> to upload</div>
              <div class="al-dropzone-accept">{{ currentTab.accept }}</div>
              
              <!-- File info -->
              <div v-if="selectedFile && !validationError" class="al-dropzone-info">
                <div class="al-info-item">
                  <span>Size:</span>
                  <span>{{ formatBytes(originalSize) }}</span>
                </div>
                <div v-if="compressedSize && compressedSize < originalSize" class="al-info-item al-info-compressed">
                  <span>Compressed:</span>
                  <span>{{ formatBytes(compressedSize) }} ({{ Math.round((1 - compressedSize / originalSize) * 100) }}% saved)</span>
                </div>
              </div>
            </div>

            <!-- Validation error -->
            <div v-if="validationError" class="al-validation-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#DC3545" stroke-width="1.8"/><path d="M12 8v5M12 16v.5" stroke="#DC3545" stroke-width="2" stroke-linecap="round"/></svg>
              {{ validationError }}
            </div>

            <!-- Compression status -->
            <div v-if="compressing" class="al-compression-status">
              <div class="al-compression-spinner"></div>
              <span>Compressing image...</span>
            </div>

            <!-- Upload progress -->
            <div v-if="isUploading" class="al-upload-progress">
              <div class="al-progress-bar-wrap">
                <div class="al-progress-bar-fill" :style="{ width: progress + '%' }"></div>
              </div>
              <div class="al-progress-info">
                <span>{{ progress }}%</span>
                <span class="al-progress-speed">{{ formatSpeed }}</span>
              </div>
            </div>

            <!-- asset type select (for backgrounds/logos) -->
            <div v-if="activeTab !== 'fonts'" class="al-modal-field">
              <div class="al-modal-label">Category</div>
              <select v-model="uploadType" class="al-modal-select">
                <option value="background">Background</option>
                <option value="logo">Logo</option>
                <option value="free-image">Free Image</option>
              </select>
            </div>

            <!-- font family input -->
            <div v-if="activeTab === 'fonts'" class="al-modal-field">
              <div class="al-modal-label">Font Family Name</div>
              <input
                v-model="fontFamilyInput"
                type="text"
                placeholder="e.g. My Custom Font"
                class="al-modal-input"
              />
            </div>

            <input ref="fileInput" type="file" :accept="currentTab.fileAccept" class="al-file-hidden" @change="onFileChange" />

            <div class="al-modal-footer">
              <button class="al-modal-cancel" @click="closeUploadModal">Cancel</button>
              <button
                class="al-modal-submit"
                :disabled="!selectedFile || uploading || compressing || validationError || (activeTab === 'fonts' && !fontFamilyInput.trim())"
                @click="confirmUpload"
                @mouseenter="ctaIn"
                @mouseleave="ctaOut"
              >
                <span v-if="compressing">Compressing...</span>
                <span v-else-if="uploading">Uploading {{ progress }}%...</span>
                <span v-else>Upload file</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- DELETE CONFIRMATION -->
    <Teleport to="body">
      <Transition name="al-modal">
        <div v-if="showDeleteConfirm" class="al-modal-overlay" @click.self="cancelDelete">
          <div class="al-modal" style="width:420px" @click.stop>
            <div class="al-modal-title" style="margin-bottom:16px">Delete Asset</div>
            <p class="al-delete-text">Are you sure you want to delete <strong>"{{ deletingAsset?._name || deletingAsset?.filename }}"</strong>? This cannot be undone.</p>
            <div class="al-modal-footer">
              <button class="al-modal-cancel" @click="cancelDelete">Cancel</button>
              <button class="al-modal-delete" @click="executeDelete">Delete</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- TOAST -->
    <BaseToast :visible="toastVisible" :icon-color="toastOk ? '#F5521E' : '#F5521E'">
      <svg v-if="toastOk" width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12l4.5 4.5L19 7" stroke="#F5521E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#F5521E" stroke-width="1.9"/></svg>
      {{ toastMessage }}
    </BaseToast>
  </div>
</template>

<script setup lang="ts">
const { data: assets, refresh: refreshAssets } = await useFetch('/api/assets')
const { data: fonts, refresh: refreshFonts } = await useFetch('/api/fonts')

const activeTab = ref('backgrounds')
const selectedId = ref<string | number | null>(null)
const searchQ = ref('')
const showUploadModal = ref(false)
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const fileInput = ref<HTMLInputElement>()
const uploadType = ref('background')
const fontFamilyInput = ref('')
const copiedId = ref<number | null>(null)
const showDeleteConfirm = ref(false)
const deletingAsset = ref<any>(null)
const toastMessage = ref('')
const toastVisible = ref(false)
const toastOk = ref(true)
let toastTimer: ReturnType<typeof setTimeout> | null = null

// Validation & Performance
const { validateImage, validateFont, formatBytes: formatBytesUtil } = useFileValidation()
const { compressImage, useUploadProgress, useNetworkStatus } = usePerformance()
const { retry } = useRateLimit()

const validationError = ref('')
const compressing = ref(false)
const originalSize = ref(0)
const compressedSize = ref(0)

const { isOnline, isSlow } = useNetworkStatus()
const { progress, isUploading, formatSpeed, start, update, complete, reset: resetProgress } = useUploadProgress()

const { softIn, softOut, ctaIn, ctaOut, delHoverIn, delHoverOut } = useHoverIntents()

// Watch network status
watchEffect(() => {
  if (!isOnline.value) {
    showToast('⚠️ You are offline', false)
  } else if (isSlow.value && uploading.value) {
    showToast('⚠️ Slow connection detected', false)
  }
})

const bgAssets = computed(() => (assets.value as any[])?.filter(a => a.type === 'background') || [])
const logoAssets = computed(() => (assets.value as any[])?.filter(a => a.type === 'logo') || [])
const fontAssets = computed(() => (fonts.value as any[]) || [])

const tabs = computed(() => [
  { key: 'backgrounds', label: 'Backgrounds', count: bgAssets.value.length, locked: false, iconSvg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 15l5-4 4 3 4-4 5 4"/></svg>', title: 'Backgrounds', subtitle: 'Add as the base layer in your certificate canvas.', accept: 'PNG, JPG, SVG — max 10 MB', fileAccept: 'image/png,image/jpeg,image/svg+xml' },
  { key: 'logos', label: 'Logos', count: logoAssets.value.length, locked: false, iconSvg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>', title: 'Logos', subtitle: 'Upload your brand logo to place on certificates.', accept: 'SVG, PNG (transparent) — max 8 MB', fileAccept: 'image/png,image/svg+xml' },
  { key: 'fonts', label: 'Custom fonts', count: fontAssets.value.length, locked: false, iconSvg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 6h14"/><path d="M9 6v13"/></svg>', title: 'Custom fonts', subtitle: 'Upload your own typefaces to use in the canvas editor.', accept: 'TTF, OTF, WOFF, WOFF2 — max 6 MB', fileAccept: '.ttf,.otf,.woff,.woff2' },
])

const currentTab = computed(() => tabs.value.find(t => t.key === activeTab.value) || tabs.value[0])

const rawAssets = computed(() => {
  if (activeTab.value === 'backgrounds') return bgAssets.value
  if (activeTab.value === 'logos') return logoAssets.value
  if (activeTab.value === 'fonts') return fontAssets.value
  return []
})

const filteredAssets = computed(() => {
  let list = rawAssets.value.map((a: any) => {
    if (activeTab.value === 'backgrounds') {
      return {
        ...a,
        _name: a.filename || a.name || 'Background',
        _meta: `PNG · ${formatBytes(a.metadata?.size || 0)}`,
        _size: formatBytes(a.metadata?.size || 0),
        _date: formatDate(a.uploadedAt || a.createdAt),
        _usedIn: '—',
        _inUse: false,
        _gradient: extractGradient(a),
        _typeLabel: 'PNG image',
      }
    }
    if (activeTab.value === 'logos') {
      return {
        ...a,
        _name: a.filename || 'Logo',
        _meta: `PNG · ${formatBytes(a.metadata?.size || 0)}`,
        _size: formatBytes(a.metadata?.size || 0),
        _date: formatDate(a.uploadedAt || a.createdAt),
        _usedIn: '—',
        _inUse: false,
        _typeLabel: 'PNG image',
      }
    }
    if (activeTab.value === 'fonts') {
      return {
        ...a,
        _name: a.filename || a.name,
        _meta: a.fontFamily || '',
        _size: '—',
        _date: formatDate(a.uploadedAt),
        _usedIn: '—',
        _inUse: false,
        _fontFamily: a.fontFamily || 'sans-serif',
        _typeLabel: `${(a.fontWeight || '400')}/${(a.fontStyle || 'normal')}`,
      }
    }
    return a
  })

  const q = searchQ.value.toLowerCase().trim()
  if (q) list = list.filter((a: any) => a._name.toLowerCase().includes(q) || (a._meta || '').toLowerCase().includes(q))
  return list
})

const selectedAsset = computed(() => filteredAssets.value.find((a: any) => a.id === selectedId.value) || null)

const lockedTitle = computed(() => {
  if (activeTab.value === 'logos') return 'Upload logos with Pro'
  if (activeTab.value === 'fonts') return 'Custom fonts require Pro'
  return ''
})

const lockedDesc = computed(() => {
  if (activeTab.value === 'logos') return 'Add your brand logo to every certificate — unlimited uploads on Pro.'
  if (activeTab.value === 'fonts') return 'Use your own typefaces in the canvas. Upload TTF, OTF, or WOFF files on Pro.'
  return ''
})

function switchTab(key: string) {
  activeTab.value = key
  selectedId.value = null
  searchQ.value = ''
}

function toggleSelect(id: string | number) {
  selectedId.value = selectedId.value === id ? null : id
}

function onUploadClick() {
  if (currentTab.value.locked) {
    showToast('🔒 Upgrade to Pro to upload', false)
  } else {
    uploadType.value = activeTab.value === 'logos' ? 'logo' : 'background'
    showUploadModal.value = true
  }
}

function closeUploadModal() {
  showUploadModal.value = false
  selectedFile.value = null
  validationError.value = ''
  resetProgress()
  compressing.value = false
  originalSize.value = 0
  compressedSize.value = 0
}

function triggerFileInput() {
  fileInput.value?.click()
}

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  validationError.value = ''
  originalSize.value = file.size
  
  // Validate based on type
  if (activeTab.value === 'fonts') {
    const result = validateFont(file, {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['.ttf', '.otf', '.woff', '.woff2']
    })
    if (!result.valid) {
      validationError.value = result.error || 'Invalid font file'
      selectedFile.value = null
      input.value = ''
      return
    }
  } else {
    const result = await validateImage(file, {
      maxSize: 10 * 1024 * 1024, // 10MB
      maxWidth: 4096,
      maxHeight: 4096,
      allowedTypes: ['image/png', 'image/jpeg', 'image/jpg']
    })
    if (!result.valid) {
      validationError.value = result.error || 'Invalid image file'
      selectedFile.value = null
      input.value = ''
      return
    }
  }
  
  selectedFile.value = file
}

async function onDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0]
  if (!file) return
  
  validationError.value = ''
  originalSize.value = file.size
  
  // Validate
  if (activeTab.value === 'fonts') {
    const result = validateFont(file)
    if (!result.valid) {
      validationError.value = result.error || 'Invalid font file'
      return
    }
  } else {
    const result = await validateImage(file)
    if (!result.valid) {
      validationError.value = result.error || 'Invalid image file'
      return
    }
  }
  
  selectedFile.value = file
}

async function confirmUpload() {
  if (!selectedFile.value) return
  
  validationError.value = ''
  uploading.value = true
  resetProgress()

  try {
    let fileToUpload = selectedFile.value

    // Compress images before upload (not fonts)
    if (activeTab.value !== 'fonts') {
      compressing.value = true
      try {
        // Detect if image has transparency
        const hasTransparency = await checkImageTransparency(selectedFile.value)
        
        // Preserve PNG for transparent images, convert others to JPEG
        const format = hasTransparency ? 'image/png' : 'image/jpeg'
        const quality = hasTransparency ? 0.95 : 0.85 // PNG uses higher quality
        
        fileToUpload = await compressImage(selectedFile.value, {
          maxWidth: 2048,
          maxHeight: 2048,
          quality,
          format
        })
        compressedSize.value = fileToUpload.size
        compressing.value = false
        
        const savings = Math.round((1 - fileToUpload.size / selectedFile.value.size) * 100)
        if (savings > 10) {
          showToast(`Compressed ${formatBytesUtil(selectedFile.value.size)} → ${formatBytesUtil(fileToUpload.size)} (${savings}% smaller)`)
        }
      } catch (compressionError) {
        console.warn('Compression failed, uploading original:', compressionError)
        fileToUpload = selectedFile.value
        compressing.value = false
      }
    }

    start(fileToUpload.size)

    // Upload with retry logic
    await retry(
      () => uploadWithProgress(fileToUpload),
      {
        maxRetries: 3,
        initialDelay: 1000,
        maxDelay: 10000,
        onRetry: (attempt, error) => {
          showToast(`Retrying upload (${attempt}/3)...`, false)
          console.warn(`Upload retry ${attempt}:`, error)
        }
      }
    )

    complete()
    
    // Refresh data
    if (activeTab.value === 'fonts') {
      await refreshFonts()
    } else {
      await refreshAssets()
    }
    
    showUploadModal.value = false
    selectedFile.value = null
    fontFamilyInput.value = ''
    showToast('✓ File uploaded successfully!')
  } catch (e: any) {
    resetProgress()
    const errorMsg = e?.data?.message || e?.message || 'Upload failed'
    validationError.value = errorMsg
    showToast(`❌ ${errorMsg}`, false)
  } finally {
    uploading.value = false
    compressing.value = false
  }
}

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
        try {
          resolve(JSON.parse(xhr.responseText))
        } catch {
          resolve(xhr.responseText)
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Network error'))
    })

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload cancelled'))
    })

    const endpoint = activeTab.value === 'fonts' ? '/api/fonts' : '/api/assets'
    xhr.open('POST', endpoint)
    xhr.send(formData)
  })
}

// Check if image has transparent pixels
async function checkImageTransparency(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    // Non-PNG files don't have transparency
    if (!file.type.includes('png')) {
      resolve(false)
      return
    }

    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      resolve(false)
      return
    }

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      try {
        // Sample pixels to check for transparency
        // Check corners and center for performance
        const samplePoints = [
          { x: 0, y: 0 },
          { x: img.width - 1, y: 0 },
          { x: 0, y: img.height - 1 },
          { x: img.width - 1, y: img.height - 1 },
          { x: Math.floor(img.width / 2), y: Math.floor(img.height / 2) }
        ]

        for (const point of samplePoints) {
          const pixel = ctx.getImageData(point.x, point.y, 1, 1).data
          // Check alpha channel (index 3)
          if (pixel[3] < 255) {
            resolve(true)
            URL.revokeObjectURL(img.src)
            return
          }
        }

        // More thorough check: sample 100 random pixels
        const imageData = ctx.getImageData(0, 0, img.width, img.height)
        const data = imageData.data
        const sampleSize = Math.min(100, data.length / 4)
        
        for (let i = 0; i < sampleSize; i++) {
          const randomIndex = Math.floor(Math.random() * (data.length / 4)) * 4
          // Check alpha channel
          if (data[randomIndex + 3] < 255) {
            resolve(true)
            URL.revokeObjectURL(img.src)
            return
          }
        }

        resolve(false)
      } catch (error) {
        console.warn('Transparency check failed:', error)
        resolve(false)
      }

      URL.revokeObjectURL(img.src)
    }

    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      resolve(false)
    }

    img.src = URL.createObjectURL(file)
  })
}

function useInEditor() {
  selectedId.value = null
  navigateTo('/templates/new')
}

async function copyAssetUrl(item: any) {
  try {
    const url = item.filepath ? window.location.origin + item.filepath : ''
    await navigator.clipboard.writeText(url)
    copiedId.value = item.id
    showToast('URL copied')
    setTimeout(() => { copiedId.value = null }, 2000)
  } catch {
    showToast('Failed to copy', false)
  }
}

function confirmDeleteAsset(item: any) {
  deletingAsset.value = item
  showDeleteConfirm.value = true
}

function cancelDelete() {
  showDeleteConfirm.value = false
  deletingAsset.value = null
}

async function executeDelete() {
  if (!deletingAsset.value) return
  try {
    if (activeTab.value === 'fonts') {
      await $fetch(`/api/fonts/${deletingAsset.value.id}`, { method: 'DELETE' })
      refreshFonts()
    } else {
      await $fetch(`/api/assets/${deletingAsset.value.id}`, { method: 'DELETE' })
      refreshAssets()
    }
    showDeleteConfirm.value = false
    if (selectedId.value === deletingAsset.value.id) selectedId.value = null
    deletingAsset.value = null
    showToast('Asset deleted')
  } catch {
    showToast('Failed to delete', false)
  }
}

async function deleteSelected() {
  if (!selectedAsset.value) return
  try {
    if (activeTab.value === 'fonts') {
      await $fetch(`/api/fonts/${selectedAsset.value.id}`, { method: 'DELETE' })
      refreshFonts()
    } else {
      await $fetch(`/api/assets/${selectedAsset.value.id}`, { method: 'DELETE' })
      refreshAssets()
    }
    selectedId.value = null
    showToast('Asset deleted')
  } catch {
    showToast('Failed to delete', false)
  }
}

function showToast(msg: string, ok = true) {
  toastMessage.value = msg
  toastVisible.value = true
  toastOk.value = ok
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastVisible.value = false }, 2400)
}

function formatBytes(bytes: number) {
  return formatBytesUtil(bytes)
}

function formatDate(date: any) {
  if (!date) return '—'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function extractGradient(a: any): string {
  try {
    const meta = typeof a.metadata === 'string' ? JSON.parse(a.metadata) : a.metadata
    if (meta?.gradient) return meta.gradient
  } catch {}
  return 'linear-gradient(135deg,#F7F1E9,#EDE4D8)'
}

function slotIn(e: MouseEvent) { (e.currentTarget as HTMLElement).style.borderColor = '#F5521E'; (e.currentTarget as HTMLElement).style.background = '#FFF8F6' }
function slotOut(e: MouseEvent) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(20,17,14,0.18)'; (e.currentTarget as HTMLElement).style.background = '#fff' }

onUnmounted(() => { if (toastTimer) clearTimeout(toastTimer) })
</script>

<style scoped>
.al-root {
  --al-accent: #F5521E; --al-ink: #14110E; --al-muted: #6E665E;
  --al-cream: #F2ECE7; --al-panel: #FBF9F7; --al-line: rgba(20,17,14,0.09);
  height: 100vh; display: flex; flex-direction: column;
  background: var(--al-cream);
  font-family: 'General Sans', system-ui, sans-serif;
  color: var(--al-ink); -webkit-font-smoothing: antialiased;
}

::selection { background: #F5521E; color: #fff; }

/* top bar */
.al-topbar {
  position: sticky; top: 0; flex: 0 0 auto; height: 58px;
  background: rgba(255,255,255,0.86); backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--al-line);
  display: flex; align-items: center; padding: 0 28px; gap: 16px; z-index: 30;
}
.al-logo { display: flex; align-items: center; gap: 9px; text-decoration: none; color: var(--al-ink); }
.al-logo-mark { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 8px; background: var(--al-ink); }
.al-logo-text { font-weight: 600; font-size: 15px; }
.al-logo-accent { color: var(--al-accent); }
.al-topbar-divider { width: 1px; height: 24px; background: var(--al-line); }
.al-breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 14px; }
.al-breadcrumb-link { color: var(--al-muted); text-decoration: none; font-weight: 500; }
.al-breadcrumb-link:hover { text-decoration: underline; }
.al-breadcrumb-current { font-weight: 600; color: var(--al-ink); }
.al-topbar-actions { margin-left: auto; display: flex; align-items: center; gap: 10px; }
.al-plan-badge {
  display: flex; align-items: center; gap: 7px;
  background: #FFF4F0; border: 1px solid rgba(245,82,30,0.2);
  padding: 7px 8px 7px 13px; border-radius: 999px;
  font-size: 12.5px; font-weight: 500; color: var(--al-accent);
}
.al-plan-upgrade {
  text-decoration: none; background: var(--al-ink); color: #fff;
  font-size: 12px; font-weight: 600; padding: 5px 11px; border-radius: 999px;
}
.al-btn-editor {
  text-decoration: none; border: 1px solid var(--al-line); background: #fff;
  font-size: 13.5px; font-weight: 600; color: var(--al-ink);
  padding: 9px 15px; border-radius: 9px; display: flex; align-items: center; gap: 7px;
  transition: background .15s;
}
.al-btn-editor:hover { background: rgba(20,17,14,0.05); }
.al-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(135deg,#F5521E,#ff8a5b);
  display: grid; place-items: center;
  color: #fff; font-size: 13px; font-weight: 600;
}

/* body */
.al-body { flex: 1; display: flex; min-height: 0; }

/* sidebar */
.al-sidebar {
  flex: 0 0 220px; background: #fff; border-right: 1px solid var(--al-line);
  padding: 20px 14px; display: flex; flex-direction: column; gap: 3px; overflow-y: auto;
}
.al-sidebar-label {
  font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--al-muted);
  padding: 0 8px; margin-bottom: 8px;
}
.al-tab {
  display: flex; align-items: center; gap: 10px; border: none;
  background: transparent; cursor: pointer; font-family: inherit;
  font-size: 13.5px; font-weight: 500; color: var(--al-muted);
  padding: 10px 11px; border-radius: 10px; width: 100%;
  border: 1px solid transparent; transition: all .15s; text-align: left;
}
.al-tab:hover { background: rgba(20,17,14,0.04); }
.al-tab--active {
  background: #fff; color: var(--al-ink); font-weight: 600;
  border-color: rgba(20,17,14,0.09); box-shadow: 0 2px 8px rgba(20,17,14,0.06);
}
.al-tab-icon { flex: 0 0 auto; display: flex; color: inherit; }
.al-tab--active .al-tab-icon :deep(svg) { stroke: var(--al-ink); }
.al-tab:not(.al-tab--active) .al-tab-icon :deep(svg) { stroke: var(--al-muted); }
.al-tab-label { flex: 1; text-align: left; }
.al-tab-count { font-size: 11.5px; font-weight: 600; }
.al-tab--active .al-tab-count { color: var(--al-accent); }
.al-tab-pro {
  display: inline-flex; align-items: center;
  background: rgba(20,17,14,0.08); border-radius: 5px;
  padding: 2px 6px; font-size: 10px; font-weight: 700;
  letter-spacing: 0.04em; color: var(--al-muted);
}
.al-pro-cta {
  margin-top: auto; background: #FFF4F0;
  border: 1px solid rgba(245,82,30,0.18); border-radius: 14px; padding: 16px;
}
.al-pro-cta-title { font-size: 13px; font-weight: 600; line-height: 1.3; }
.al-pro-cta-desc { font-size: 12px; color: var(--al-muted); margin-top: 5px; line-height: 1.45; }
.al-pro-cta-btn {
  text-decoration: none; display: block; text-align: center;
  background: var(--al-accent); color: #fff; font-weight: 600;
  font-size: 13px; padding: 10px; border-radius: 9px; margin-top: 14px;
  box-shadow: 0 6px 16px rgba(245,82,30,0.28);
}

/* main */
.al-main { flex: 1; min-width: 0; overflow-y: auto; padding: 28px 32px; }
.al-main::-webkit-scrollbar { width: 8px; }
.al-main::-webkit-scrollbar-thumb { background: rgba(20,17,14,0.14); border-radius: 8px; }
.al-main::-webkit-scrollbar-track { background: transparent; }

.al-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 20px; flex-wrap: wrap; margin-bottom: 26px;
}
.al-title { margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -0.025em; }
.al-subtitle { margin: 6px 0 0; font-size: 14px; color: var(--al-muted); }
.al-toolbar { display: flex; align-items: center; gap: 10px; }
.al-upload-btn {
  display: flex; align-items: center; gap: 8px; border: none;
  cursor: pointer; font-family: inherit; font-size: 13.5px; font-weight: 600;
  padding: 10px 16px; border-radius: 10px; transition: transform .2s;
  background: var(--al-ink); color: #fff;
  box-shadow: 0 6px 18px rgba(20,17,14,0.18);
}
.al-upload-btn--locked { background: rgba(20,17,14,0.07); color: var(--al-muted); cursor: not-allowed; box-shadow: none; }

/* usage bar */
.al-usage {
  background: #fff; border: 1px solid var(--al-line);
  border-radius: 14px; padding: 16px 20px; margin-bottom: 24px;
  display: flex; align-items: center; gap: 20px;
  animation: fadeUp .35s ease both;
}
.al-usage-main { flex: 1; }
.al-usage-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.al-usage-title { font-size: 13.5px; font-weight: 600; }
.al-usage-stat { font-size: 12px; color: var(--al-muted); }
.al-usage-bar { height: 7px; border-radius: 6px; background: var(--al-cream); overflow: hidden; }
.al-usage-fill { height: 100%; background: var(--al-accent); border-radius: 6px; transition: width .6s cubic-bezier(.16,1,.3,1); }
.al-usage-note { font-size: 12px; color: var(--al-muted); margin-top: 7px; }
.al-usage-upgrade {
  text-decoration: none; flex: 0 0 auto; background: var(--al-ink); color: #fff;
  font-size: 13px; font-weight: 600; padding: 10px 16px; border-radius: 9px; white-space: nowrap;
}

/* locked */
.al-locked {
  border: 2px dashed rgba(245,82,30,0.35); border-radius: 18px;
  padding: 48px 24px; text-align: center;
  background: rgba(245,82,30,0.03);
  animation: fadeUp .3s ease both;
}
.al-locked-icon {
  display: grid; place-items: center; width: 56px; height: 56px;
  border-radius: 16px; background: #fff; border: 1px solid var(--al-line);
  margin: 0 auto 16px; box-shadow: 0 8px 24px rgba(20,17,14,0.06);
}
.al-locked-title { font-size: 18px; font-weight: 600; letter-spacing: -0.01em; }
.al-locked-desc { font-size: 14px; color: var(--al-muted); margin-top: 8px; max-width: 360px; line-height: 1.5; margin-left: auto; margin-right: auto; }
.al-locked-btn {
  text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
  background: var(--al-accent); color: #fff; font-weight: 600;
  font-size: 15px; padding: 13px 24px; border-radius: 999px;
  margin-top: 22px; box-shadow: 0 8px 22px rgba(245,82,30,0.32);
}

/* grid */
.al-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 16px;
}
.al-card {
  background: #fff; border: 1px solid rgba(20,17,14,0.09);
  border-radius: 16px; cursor: pointer;
  box-shadow: 0 4px 14px rgba(20,17,14,0.05);
  transition: border-color .15s, box-shadow .15s;
  overflow: visible;
  animation: popIn .3s cubic-bezier(.16,1,.3,1) both;
}
.al-card:hover { border-color: rgba(20,17,14,0.18); }
.al-card--selected { border-color: var(--al-accent); box-shadow: 0 0 0 4px rgba(245,82,30,0.12); }
.al-card-thumb {
  position: relative; aspect-ratio: 4/3; background: #F7F4F1;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; border-bottom: 1px solid rgba(20,17,14,0.07);
}
.al-thumb-bg { width: 100%; height: 100%; position: relative; }
.al-thumb-bg-img { width: 100%; height: 100%; object-fit: cover; }
.al-thumb-bg-fallback { width: 100%; height: 100%; border-radius: 10px; overflow: hidden; position: relative; }
.al-thumb-bg-icon {
  position: absolute; inset: 0; display: grid; place-items: center; opacity: .06;
}
.al-thumb-font {
  width: 100%; height: 100%; display: flex; align-items: center;
  justify-content: center; flex-direction: column; gap: 4px;
}
.al-thumb-font-aa { font-size: 40px; font-weight: 600; color: var(--al-ink); line-height: 1; }
.al-thumb-font-name {
  font-size: 10px; color: var(--al-muted); font-weight: 500;
  letter-spacing: 0.04em; text-transform: uppercase;
}
.al-thumb-img { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 12px; }
.al-thumb-img-el { max-width: 100%; max-height: 100%; object-fit: contain; }
.al-badge-inuse {
  position: absolute; top: 8px; left: 8px;
  background: rgba(20,17,14,0.72); backdrop-filter: blur(6px);
  color: #fff; font-size: 10px; font-weight: 600;
  padding: 3px 8px; border-radius: 999px; letter-spacing: 0.03em;
}
.al-badge-check {
  position: absolute; top: 8px; right: 8px;
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--al-accent); display: grid; place-items: center;
  box-shadow: 0 2px 8px rgba(245,82,30,0.4);
}
.al-card-info { padding: 10px 12px 12px; }
.al-card-info-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.al-card-info-text { min-width: 0; }
.al-card-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.al-card-meta { font-size: 11.5px; color: var(--al-muted); margin-top: 2px; }
.al-card-menu {
  border: none; background: transparent; cursor: pointer;
  width: 28px; height: 28px; border-radius: 7px;
  display: grid; place-items: center; flex: 0 0 auto;
}

/* upload slot */
.al-slot-card {
  border: 1.5px dashed rgba(20,17,14,0.18); background: #fff;
  border-radius: 16px; cursor: pointer;
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 10px; aspect-ratio: 4/3;
  transition: border-color .2s, background .2s;
  font-family: inherit;
}
.al-slot-icon {
  display: grid; place-items: center; width: 42px; height: 42px;
  border-radius: 13px; background: var(--al-cream);
}
.al-slot-label { font-size: 13px; font-weight: 600; color: var(--al-ink); }

/* empty */
.al-empty {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 80px 24px; text-align: center;
  animation: fadeUp .35s ease both;
}
.al-empty-icon {
  display: grid; place-items: center; width: 64px; height: 64px;
  border-radius: 18px; background: #fff; border: 1px solid var(--al-line);
  box-shadow: 0 8px 24px rgba(20,17,14,0.06); margin-bottom: 18px;
}
.al-empty-title { font-size: 17px; font-weight: 600; }
.al-empty-desc { font-size: 14px; color: var(--al-muted); margin-top: 6px; }
.al-empty-clear {
  margin-top: 16px; border: 1px solid var(--al-line); background: #fff;
  font-family: inherit; font-size: 14px; font-weight: 600;
  padding: 10px 18px; border-radius: 9px; cursor: pointer;
}

/* detail panel */
.al-detail {
  flex: 0 0 280px; background: var(--al-panel);
  border-left: 1px solid var(--al-line);
  overflow-y: auto; animation: fadeUp .25s ease both;
}
.al-detail::-webkit-scrollbar { width: 8px; }
.al-detail::-webkit-scrollbar-thumb { background: rgba(20,17,14,0.14); border-radius: 8px; }
.al-detail-head {
  padding: 18px 18px 0; display: flex; align-items: center;
  justify-content: space-between;
}
.al-detail-head-title { font-size: 14px; font-weight: 600; }
.al-detail-head-close {
  border: none; background: transparent; cursor: pointer;
  width: 30px; height: 30px; border-radius: 8px;
  display: grid; place-items: center;
}
.al-detail-preview {
  margin: 14px 18px; border-radius: 14px; background: #fff;
  border: 1px solid var(--al-line); aspect-ratio: 4/3;
  overflow: hidden; display: flex; align-items: center; justify-content: center;
}
.al-detail-preview-bg { width: 100%; height: 100%; }
.al-detail-preview-bg-img { width: 100%; height: 100%; object-fit: cover; border-radius: 10px; }
.al-detail-preview-bg-fallback { width: 100%; height: 100%; border-radius: 10px; }
.al-detail-preview-font { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
.al-detail-preview-aa { font-size: 64px; font-weight: 600; color: var(--al-ink); }
.al-detail-preview-img { max-width: 100%; max-height: 100%; object-fit: contain; }
.al-detail-body { padding: 0 18px 18px; }
.al-detail-name { font-size: 17px; font-weight: 600; letter-spacing: -0.01em; }
.al-detail-meta { font-size: 12.5px; color: var(--al-muted); margin-top: 4px; }
.al-detail-fields { margin-top: 18px; display: flex; flex-direction: column; gap: 11px; }
.al-detail-field { display: flex; justify-content: space-between; font-size: 13px; }
.al-detail-field span:first-child { color: var(--al-muted); }
.al-detail-field span:last-child { font-weight: 500; }
.al-detail-divider { height: 1px; background: var(--al-line); }
.al-detail-actions { margin-top: 20px; display: flex; flex-direction: column; gap: 8px; }
.al-detail-use {
  border: none; background: var(--al-ink); color: #fff;
  font-family: inherit; font-size: 14px; font-weight: 600;
  padding: 13px; border-radius: 11px; cursor: pointer;
  transition: transform .2s;
}
.al-detail-use:hover { transform: translateY(-1px); }
.al-detail-delete {
  border: 1px solid rgba(220,53,69,0.3); background: transparent;
  color: #DC3545; font-family: inherit; font-size: 14px;
  font-weight: 500; padding: 12px; border-radius: 11px; cursor: pointer;
}
.al-detail-delete:hover { background: rgba(220,53,69,0.06); }

/* upload modal */
.al-modal-overlay {
  position: fixed; inset: 0; background: rgba(20,17,14,0.44);
  backdrop-filter: blur(4px); z-index: 50;
  display: flex; align-items: center; justify-content: center;
}
.al-modal {
  background: #fff; border-radius: 22px; padding: 32px;
  width: 460px; box-shadow: 0 40px 80px rgba(20,17,14,0.28);
  animation: popIn .3s cubic-bezier(.16,1,.3,1) both;
}
.al-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.al-modal-title { font-size: 18px; font-weight: 600; }
.al-modal-close {
  border: none; background: var(--al-cream); cursor: pointer;
  width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center;
}
.al-dropzone {
  border: 2px dashed rgba(20,17,14,0.18); border-radius: 16px;
  padding: 40px 24px; text-align: center; cursor: pointer;
  background: var(--al-cream);
  transition: border-color .2s, background .2s;
}
.al-dropzone:hover { border-color: var(--al-accent); background: #FFF8F6; }
.al-dropzone--error { border-color: #DC3545; background: rgba(220,53,69,0.04); }
.al-dropzone-icon {
  display: grid; place-items: center; width: 52px; height: 52px;
  border-radius: 14px; background: #fff;
  box-shadow: 0 6px 18px rgba(20,17,14,0.08); margin: 0 auto 14px;
}
.al-dropzone-title { font-size: 15px; font-weight: 600; }
.al-dropzone-sub { font-size: 13px; color: var(--al-muted); margin-top: 6px; }
.al-dropzone-link { color: var(--al-accent); font-weight: 600; cursor: pointer; }
.al-dropzone-accept { font-size: 12px; color: var(--al-muted); margin-top: 10px; }
.al-dropzone-info {
  margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--al-line);
  display: flex; flex-direction: column; gap: 8px;
}
.al-info-item {
  display: flex; justify-content: space-between; font-size: 12.5px;
}
.al-info-item span:first-child { color: var(--al-muted); }
.al-info-item span:last-child { font-weight: 600; }
.al-info-compressed { color: #1F8A5B; }
.al-info-compressed span:last-child { color: #1F8A5B; }

.al-validation-error {
  display: flex; align-items: center; gap: 9px;
  background: rgba(220,53,69,0.07); border: 1px solid rgba(220,53,69,0.22);
  border-radius: 10px; padding: 11px 14px; margin-top: 12px;
  font-size: 13.5px; color: #B91C2E;
}

.al-compression-status {
  display: flex; align-items: center; gap: 10px;
  background: rgba(31,138,91,0.08); border: 1px solid rgba(31,138,91,0.18);
  border-radius: 10px; padding: 11px 14px; margin-top: 12px;
  font-size: 13.5px; color: #1F8A5B; font-weight: 500;
}
.al-compression-spinner {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(31,138,91,0.2);
  border-top-color: #1F8A5B;
  animation: spin 0.6s linear infinite;
}

.al-upload-progress {
  margin-top: 12px;
}
.al-progress-bar-wrap {
  height: 7px; border-radius: 6px; background: rgba(20,17,14,0.08);
  overflow: hidden;
}
.al-progress-bar-fill {
  height: 100%; background: var(--al-accent); border-radius: 6px;
  transition: width 0.3s ease;
}
.al-progress-info {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 8px; font-size: 12.5px;
}
.al-progress-info span:first-child { font-weight: 600; color: var(--al-ink); }
.al-progress-speed { color: var(--al-muted); }

@keyframes spin {
  to { transform: rotate(360deg); }
}
.al-file-hidden { display: none; }
.al-modal-footer { margin-top: 16px; display: flex; gap: 9px; }
.al-modal-cancel {
  flex: 1; border: 1px solid var(--al-line); background: #fff;
  font-family: inherit; font-size: 14px; font-weight: 600;
  padding: 13px; border-radius: 11px; cursor: pointer;
}
.al-modal-submit {
  flex: 2; border: none; background: #F5521E; color: #fff;
  font-family: inherit; font-size: 14px; font-weight: 600;
  padding: 13px; border-radius: 11px; cursor: pointer;
  box-shadow: 0 6px 16px rgba(245,82,30,0.3);
  transition: transform .2s;
}
.al-modal-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.al-modal-submit:not(:disabled):hover { transform: translateY(-1px); }

@keyframes popIn {
  0% { transform: scale(.88); opacity: 0; }
  70% { transform: scale(1.03); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes fadeUp {
  0% { transform: translateY(14px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.al-modal-enter-active { transition: opacity .2s ease-out; }
.al-modal-enter-active .al-modal { transition: transform .25s ease-out, opacity .2s ease-out; }
.al-modal-leave-active { transition: opacity .15s ease-in; }
.al-modal-leave-active .al-modal { transition: transform .15s ease-in, opacity .15s ease-in; }
.al-modal-enter-from { opacity: 0; }
.al-modal-enter-from .al-modal { transform: scale(0.95) translateY(8px); opacity: 0; }
.al-modal-leave-to { opacity: 0; }
.al-modal-leave-to .al-modal { transform: scale(0.95) translateY(8px); opacity: 0; }

/* menu items */
.al-menu-item {
  width: 100%; border: none; background: transparent; cursor: pointer;
  font-family: inherit; font-size: 13.5px; font-weight: 500;
  padding: 9px 12px; border-radius: 8px; text-align: left;
  display: flex; align-items: center; gap: 9px; color: var(--al-ink);
}
.al-menu-item--danger { color: #DC3545; }
.al-menu-divider { height: 1px; background: var(--al-line); margin: 4px 0; }

/* modal fields */
.al-modal-field { margin-top: 14px; }
.al-modal-label { font-size: 12px; font-weight: 600; color: var(--al-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
.al-modal-select {
  width: 100%; border: 1px solid var(--al-line); background: #fff; border-radius: 9px;
  padding: 10px 12px; font-family: inherit; font-size: 13.5px; color: var(--al-ink);
  outline: none; cursor: pointer; box-sizing: border-box;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236E665E' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px;
}
.al-modal-input {
  width: 100%; border: 1px solid var(--al-line); background: #fff; border-radius: 9px;
  padding: 10px 12px; font-family: inherit; font-size: 13.5px; color: var(--al-ink);
  outline: none;
}

/* delete confirmation */
.al-delete-text {
  font-size: 14px; color: var(--al-muted); line-height: 1.55; margin-bottom: 20px;
}
.al-modal-delete {
  flex: 1; border: none; background: #EF4444; color: #fff;
  font-family: inherit; font-size: 14px; font-weight: 600;
  padding: 13px; border-radius: 11px; cursor: pointer;
}
.al-modal-delete:hover { background: #dc2626; }
</style>
