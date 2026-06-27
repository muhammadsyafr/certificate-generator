<template>
  <div class="page">
    <div class="page-container">
      <header class="flex justify-between items-center page-header">
        <div>
          <NuxtLink to="/" class="back-link">← Back</NuxtLink>
          <h1 class="page-title">Certificate Templates</h1>
        </div>
        <NuxtLink to="/templates/new" class="btn-primary">
          + New Template
        </NuxtLink>
      </header>

      <div v-if="pending" class="card-empty">
        <div class="text-muted text-body-lg">Loading templates...</div>
      </div>

      <div v-else-if="error" class="card-empty">
        <div class="text-muted text-body-lg">Failed to load templates</div>
      </div>

      <div v-else-if="!templates || templates.length === 0" class="card-empty">
        <div class="text-muted text-body-lg mb-4">No templates yet</div>
        <NuxtLink to="/templates/new" class="btn-primary">Create your first template</NuxtLink>
      </div>

      <div v-else class="card-grid card-grid-3">
        <div
          v-for="template in templates"
          :key="template.id"
          class="card group"
        >
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-heading-sm group-hover:text-accent transition-colors">
              {{ template.name }}
            </h3>
            <button
              @click="deleteTemplate(template.id)"
              class="icon-btn icon-btn-danger"
              title="Delete template"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <path d="M1 1l12 12M13 1L1 13"/>
              </svg>
            </button>
          </div>

          <div class="text-caption mb-5">
            Created {{ new Date(template.createdAt).toLocaleDateString() }}
          </div>

          <div class="flex gap-2">
            <NuxtLink :to="`/templates/${template.id}`" class="btn-primary btn-sm flex-1 text-center">
              Edit
            </NuxtLink>
            <NuxtLink :to="`/generate?template=${template.id}`" class="btn-secondary btn-sm flex-1 text-center">
              Use
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: templates, pending, error, refresh } = await useFetch('/api/templates')

async function deleteTemplate(id: number) {
  if (!confirm('Delete this template?')) return

  try {
    await $fetch(`/api/templates/${id}`, { method: 'DELETE' })
    refresh()
  } catch (e) {
    alert('Failed to delete template')
  }
}
</script>