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
        <NuxtLink to="/templates/new" class="btn-primary" style="display: flex; align-items: center; gap: var(--space-2); flex-shrink: 0;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Template
        </NuxtLink>
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