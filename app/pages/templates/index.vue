<template>
  <div class="page">
    <div class="page-container">
      <header style="padding-top: var(--space-10); padding-bottom: var(--space-8); margin-bottom: var(--space-8); display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <NuxtLink to="/" class="inline-flex items-center" style="gap: var(--space-2); margin-bottom: var(--space-6); color: var(--color-text-secondary); font-size: var(--text-sm); font-weight: var(--weight-medium); transition: color var(--duration-fast) var(--ease-standard);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back</span>
          </NuxtLink>
          <h1 class="text-heading-lg" style="margin-bottom: var(--space-3);">Certificate Templates</h1>
          <p class="text-body" style="color: var(--color-text-secondary);">Design and manage your certificate layouts</p>
        </div>
      </header>

      <div v-if="pending" class="card-empty">
        <div class="text-body" style="color: var(--color-text-secondary);">Loading templates...</div>
      </div>

      <div v-else-if="error" class="card-empty">
        <div class="text-body" style="color: var(--color-text-secondary);">Failed to load templates</div>
      </div>

      <div v-else-if="!templates || templates.length === 0" class="card-empty">
        <div class="text-body" style="color: var(--color-text-secondary); margin-bottom: var(--space-5);">No templates yet</div>
        <NuxtLink to="/templates/new" class="btn-primary">Create your first template</NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style="gap: var(--space-6);">
        <!-- Existing Templates -->
        <div
          v-for="template in templates"
          :key="template.id"
          class="card group"
          style="padding: var(--space-6);"
        >
          <div class="flex justify-between items-start" style="margin-bottom: var(--space-4);">
            <h3 class="text-heading-sm" style="font-weight: var(--weight-semibold); color: var(--color-text); transition: color var(--duration-fast) var(--ease-standard);">
              {{ template.name }}
            </h3>
            <button
              @click="deleteTemplate(template.id)"
              class="btn-ghost"
              style="padding: var(--space-2); color: var(--color-text-muted); transition: color var(--duration-fast) var(--ease-standard);"
              title="Delete template"
              @mouseenter="$event.currentTarget.style.color = 'var(--color-danger)'"
              @mouseleave="$event.currentTarget.style.color = 'var(--color-text-muted)'"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>

          <div class="text-caption" style="color: var(--color-text-muted); margin-bottom: var(--space-6);">
            Created {{ new Date(template.createdAt).toLocaleDateString() }}
          </div>

          <div class="flex" style="gap: var(--space-3);">
            <NuxtLink :to="`/templates/${template.id}`" class="btn-primary btn-sm" style="flex: 1; text-align: center;">
              Edit
            </NuxtLink>
            <NuxtLink :to="`/generate?template=${template.id}`" class="btn-secondary btn-sm" style="flex: 1; text-align: center;">
              Use
            </NuxtLink>
          </div>
        </div>

        <!-- Create New Template Card -->
        <div class="card placeholder-card" style="padding: var(--space-6); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; cursor: pointer; transition: all var(--duration-normal) var(--ease-out-expo);" @click="goToCreateTemplate" @keyup.enter="goToCreateTemplate" tabindex="0">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-obsidian); margin-bottom: var(--space-4);">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <h3 class="text-heading-sm" style="font-weight: var(--weight-semibold); color: var(--color-obsidian); margin-bottom: var(--space-2);">Create New</h3>
          <p class="text-caption" style="color: var(--color-text-secondary); text-align: center;">Start designing a new template</p>
          <button @click="goToCreateTemplate" class="btn-primary" style="margin-top: var(--space-5); padding: 10px 20px; font-size: var(--text-sm);">New Template</button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 z-[9999] flex items-center justify-center"
          style="background: hsla(0, 0%, 5%, 0.45); backdrop-filter: blur(4px);"
          @click.self="cancelDelete"
        >
          <div
            class="surface-raised"
            style="
              max-width: 420px;
              width: calc(100% - 2rem);
              padding: var(--space-8);
              box-shadow: var(--shadow-lg);
            "
          >
            <div style="margin-bottom: var(--space-5);">
              <h2
                class="text-heading-sm"
                style="margin-bottom: var(--space-3); color: var(--color-text);"
              >
                Delete Template
              </h2>
              <p
                style="
                  color: var(--color-text-secondary);
                  font-size: var(--text-sm);
                  line-height: var(--leading-relaxed);
                "
              >
                Are you sure you want to delete
                <strong style="color: var(--color-text);">"{{ deletingTemplate?.name }}"</strong>?
                This action cannot be undone.
              </p>
            </div>
            <div
              style="
                display: flex;
                justify-content: flex-end;
                gap: var(--space-3);
              "
            >
              <button
                @click="cancelDelete"
                class="btn-secondary"
              >
                Cancel
              </button>
              <button
                @click="confirmDelete"
                class="btn-danger"
                :disabled="deleting"
              >
                {{ deleting ? "Deleting..." : "Delete Template" }}
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

const showDeleteModal = ref(false)
const deleting = ref(false)
const deletingTemplate = ref<{ id: number; name: string } | null>(null)

function goToCreateTemplate() {
  navigateTo('/templates/new')
}

function deleteTemplate(id: number) {
  const tmpl = templates.value?.find((t: any) => t.id === id)
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
.placeholder-card {
  border: 2px dashed var(--color-border);
  background: linear-gradient(135deg, rgba(244, 244, 245, 0.5) 0%, rgba(236, 236, 238, 0.5) 100%);
  transition: all var(--duration-normal) var(--ease-out-expo);
}

.placeholder-card:hover {
  border-color: var(--color-obsidian);
  background: linear-gradient(135deg, var(--color-mist) 0%, var(--color-fog) 100%);
  transform: translateY(-4px);
}

.placeholder-card:focus {
  outline: none;
  border-color: var(--color-obsidian);
}

.modal-enter-active {
  transition: opacity 0.2s ease-out;
}
.modal-leave-active {
  transition: opacity 0.15s ease-in;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div {
  transition: transform 0.25s var(--ease-spring), opacity 0.2s ease-out;
}
.modal-leave-active > div {
  transition: transform 0.15s ease-in, opacity 0.15s ease-in;
}
.modal-enter-from > div {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
.modal-leave-to > div {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
</style>