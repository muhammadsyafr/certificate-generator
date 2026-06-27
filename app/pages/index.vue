<template>
  <div class="page">
    <div class="page-container py-32">
      <header class="text-center mb-20 max-w-3xl mx-auto">
        <div class="inline-flex items-center gap-2 badge badge-accent mb-6 text-body-sm px-3 py-1.5">
          <span class="font-mono text-xs">v1.0</span>
          <span>Zero-config · Fully local</span>
        </div>
        <h1 class="text-display mb-6 tracking-tight">
          Certificate<br />Generator
        </h1>
        <p class="text-body-lg text-muted max-w-lg mx-auto">
          Design templates, upload data, and generate certificates in bulk.
          Everything runs locally — no uploads, no accounts.
        </p>
      </header>

      <div class="card-grid card-grid-3 max-w-4xl mx-auto">
        <NuxtLink to="/templates" class="card card-action group">
          <div class="text-3xl mb-5">&#8203;</div>
          <div class="brand-mark mb-4" style="width:36px;height:36px;font-size:14px;">T</div>
          <h2 class="text-heading-sm mb-2 group-hover:text-accent transition-colors duration-150">
            Templates
          </h2>
          <p class="text-body-sm text-muted">
            Create and manage certificate layouts with drag-and-drop positioning
          </p>
        </NuxtLink>

        <NuxtLink to="/templates/assets" class="card card-action group">
          <div class="brand-mark mb-4" style="width:36px;height:36px;font-size:14px;background:var(--color-accent-secondary);">A</div>
          <h2 class="text-heading-sm mb-2 group-hover:text-accent transition-colors duration-150">
            Assets
          </h2>
          <p class="text-body-sm text-muted">
            Upload logos and backgrounds to use across your templates
          </p>
        </NuxtLink>

        <NuxtLink to="/generate" class="card card-action group">
          <div class="brand-mark mb-4" style="width:36px;height:36px;font-size:14px;background:#f59e0b;">G</div>
          <h2 class="text-heading-sm mb-2 group-hover:text-accent transition-colors duration-150">
            Generate
          </h2>
          <p class="text-body-sm text-muted">
            Bulk generate certificates from CSV or JSON data in one click
          </p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>