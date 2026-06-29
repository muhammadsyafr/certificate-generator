<template>
  <div class="tpl-page">
    <div class="tpl-container">
      <BackLink to="/" />
      <PageHeader
        title="Certificate Templates"
        description="Design and manage your certificate layouts"
      >
        <BaseButton variant="accent" @click="goToCreateTemplate">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Template
        </BaseButton>
      </PageHeader>

      <LoadingState v-if="pending" message="Loading templates..." />
      <ErrorState v-else-if="error" message="Failed to load templates" />

      <EmptyState
        v-else-if="!enrichedTemplates || enrichedTemplates.length === 0"
        title="No templates yet"
        description="Start designing your first certificate template."
      >
        <template #action>
          <BaseButton variant="primary" size="lg" @click="goToCreateTemplate" style="margin-top:18px">
            Create your first template
          </BaseButton>
        </template>
      </EmptyState>

      <div v-else class="tpl-grid">
        <div
          v-for="template in enrichedTemplates"
          :key="template.id"
          class="tpl-card"
        >
          <div class="tpl-card-thumb">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F5521E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="15" rx="2"/>
              <path d="M3 15l5-4 4 3 4-4 5 4"/>
            </svg>
          </div>

          <div class="tpl-card-body">
            <h3 class="tpl-card-name">{{ template.name }}</h3>
            <div class="tpl-card-meta">
              <span class="tpl-meta-chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20l3.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20z"/></svg>
                {{ template.elementCount }} elements
              </span>
              <span v-if="template.hasBackground" class="tpl-meta-chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="16" rx="2"/></svg>
                BG
              </span>
              <span class="tpl-meta-chip dim">
                {{ template.layoutSize }}
              </span>
              <span class="tpl-meta-chip dim">
                {{ new Date(template.createdAt).toLocaleDateString() }}
              </span>
            </div>
          </div>

          <div class="tpl-card-actions">
            <NuxtLink :to="`/templates/${template.id}`" class="tpl-action-btn primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 20l3.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20z"/>
              </svg>
              Edit
            </NuxtLink>
            <NuxtLink :to="`/generate?template=${template.id}`" class="tpl-action-btn secondary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M13 3L5 13h6l-1 8 8-10h-6l1-8z"/>
              </svg>
              Use
            </NuxtLink>
            <button class="tpl-action-btn danger" @click.stop="deleteTemplate(template.id)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Create new -->
        <button class="tpl-card tpl-card-new" @click="goToCreateTemplate">
          <div class="tpl-new-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
          <span class="tpl-new-label">Create New Template</span>
        </button>
      </div>
    </div>

    <!-- Delete Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteModal" class="tpl-modal-overlay" @click.self="cancelDelete">
          <div class="tpl-modal">
            <h3 class="tpl-modal-title">Delete Template</h3>
            <p class="tpl-modal-text">
              Are you sure you want to delete
              <strong>"{{ deletingTemplate?.name }}"</strong>?
              This action cannot be undone.
            </p>
            <div class="tpl-modal-actions">
              <button class="tpl-modal-btn cancel" @click="cancelDelete">Cancel</button>
              <button class="tpl-modal-btn delete" @click="confirmDelete" :disabled="deleting">
                {{ deleting ? "Deleting..." : "Delete" }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { navigateTo } from '#app'

const { data: templates, pending, error, refresh } = await useFetch('/api/templates')

const enrichedTemplates = computed(() => {
  if (!templates.value) return []
  return templates.value.map((t: any) => {
    let elementCount = 0
    let hasBackground = false
    let layoutWidth = 0
    let layoutHeight = 0
    try {
      const layout = typeof t.layout === 'string' ? JSON.parse(t.layout) : t.layout
      if (layout) {
        elementCount = layout.elements?.length || 0
        hasBackground = !!layout.background
        layoutWidth = layout.width || 0
        layoutHeight = layout.height || 0
      }
    } catch (e) { /* ignore parse errors */ }
    return {
      ...t,
      elementCount,
      hasBackground,
      layoutSize: layoutWidth && layoutHeight ? `${layoutWidth}×${layoutHeight}` : 'A4',
    }
  })
})

const showDeleteModal = ref(false)
const deleting = ref(false)
const deletingTemplate = ref<{ id: number; name: string } | null>(null)

function goToCreateTemplate() {
  navigateTo('/templates/new')
}

function deleteTemplate(id: number) {
  const tmpl = enrichedTemplates.value?.find((t: any) => t.id === id)
  if (!tmpl) return
  deletingTemplate.value = { id: tmpl.id, name: tmpl.name }
  showDeleteModal.value = true
}

function cancelDelete() {
  showDeleteModal.value = false
  deletingTemplate.value = null
}

async function confirmDelete() {
  if (!deletingTemplate.value) return
  deleting.value = true
  try {
    await $fetch(`/api/templates/${deletingTemplate.value.id}`, { method: 'DELETE' })
    showDeleteModal.value = false
    deletingTemplate.value = null
    refresh()
  } catch (e) {
    alert('Failed to delete template')
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
/* ── Page tokens ── */
.tpl-page {
  --accent: #F5521E; --ink: #14110E; --muted: #6E665E;
  --cream: #F2ECE7; --line: rgba(20,17,14,0.08); --surface: #fff;
  min-height: 100vh; background: var(--cream);
  font-family: 'General Sans', system-ui, sans-serif;
  color: var(--ink); -webkit-font-smoothing: antialiased;
}
.tpl-container { max-width: 1140px; margin: 0 auto; padding: 60px 32px; }

/* ── Grid ── */
.tpl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

/* ── Template card ── */
.tpl-card {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: 20px; padding: 24px; display: flex; flex-direction: column;
  gap: 16px; box-shadow: 0 8px 24px rgba(20,17,14,0.04);
  transition: transform .2s, box-shadow .2s;
}
.tpl-card:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(20,17,14,0.08); }
.tpl-card-thumb {
  width: 52px; height: 52px; border-radius: 13px;
  background: var(--cream); display: grid; place-items: center;
}
.tpl-card-body { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.tpl-card-name { font-size: 16px; font-weight: 600; margin: 0; }
.tpl-card-meta { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.tpl-meta-chip {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11.5px; font-weight: 500; color: var(--muted);
  background: var(--cream); padding: 3px 8px; border-radius: 6px;
}
.tpl-meta-chip.dim { background: transparent; padding: 3px 6px; }
.tpl-card-actions { display: flex; gap: 8px; }
.tpl-action-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: 999px; font-size: 13px;
  font-weight: 600; border: none; cursor: pointer;
  font-family: inherit; text-decoration: none;
  transition: background .15s, color .15s;
}
.tpl-action-btn.primary { background: var(--ink); color: #fff; }
.tpl-action-btn.primary:hover { background: #2a2420; }
.tpl-action-btn.secondary { background: var(--cream); color: var(--ink); border: 1px solid var(--line); }
.tpl-action-btn.secondary:hover { background: #ece4dc; }
.tpl-action-btn.danger { background: transparent; color: var(--muted); padding: 8px; }
.tpl-action-btn.danger:hover { color: #EF4444; background: rgba(239,68,68,0.06); }

/* ── Create new card ── */
.tpl-card-new {
  border: 2px dashed var(--line); background: transparent;
  align-items: center; justify-content: center; cursor: pointer;
  min-height: 0; box-shadow: none;
}
.tpl-card-new:hover { border-color: var(--accent); background: rgba(245,82,30,0.03); }
.tpl-new-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--surface); border: 1px solid var(--line);
  display: grid; place-items: center; color: var(--ink);
}
.tpl-new-label { font-size: 14px; font-weight: 600; color: var(--ink); }

/* ── Modal ── */
.tpl-modal-overlay {
  position: fixed; inset: 0; z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  background: rgba(20,17,14,0.4); backdrop-filter: blur(4px);
}
.tpl-modal {
  background: #fff; border-radius: 24px; padding: 32px;
  max-width: 420px; width: calc(100% - 2rem);
  box-shadow: 0 30px 60px rgba(20,17,14,0.2);
}
.tpl-modal-title { font-size: 18px; font-weight: 600; margin: 0 0 16px; }
.tpl-modal-text { font-size: 14px; color: var(--muted); line-height: 1.55; margin: 0 0 24px; }
.tpl-modal-actions { display: flex; justify-content: flex-end; gap: 12px; }
.tpl-modal-btn {
  padding: 10px 20px; border-radius: 999px; font-size: 14px;
  font-weight: 600; cursor: pointer; font-family: inherit;
  border: none; transition: background .15s;
}
.tpl-modal-btn.cancel { background: #F2ECE7; color: #14110E; }
.tpl-modal-btn.cancel:hover { background: #ece4dc; }
.tpl-modal-btn.delete { background: #EF4444; color: #fff; }
.tpl-modal-btn.delete:hover { background: #dc2626; }
.tpl-modal-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* transitions */
.modal-enter-active { transition: opacity .2s ease-out; }
.modal-enter-active .tpl-modal { transition: transform .25s ease-out, opacity .2s ease-out; }
.modal-leave-active { transition: opacity .15s ease-in; }
.modal-leave-active .tpl-modal { transition: transform .15s ease-in, opacity .15s ease-in; }
.modal-enter-from { opacity: 0; }
.modal-enter-from .tpl-modal { transform: scale(0.95) translateY(8px); opacity: 0; }
.modal-leave-to { opacity: 0; }
.modal-leave-to .tpl-modal { transform: scale(0.95) translateY(8px); opacity: 0; }
</style>
