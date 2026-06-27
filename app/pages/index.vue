<template>
  <div class="page">
    <div class="page-container">
      <header class="pt-16 pb-12 mb-12 text-center">
        <div class="flex items-center justify-center gap-2 mb-6">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:var(--color-accent)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="2.5" stroke-linecap="round">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <path d="M7 8h10M7 12h6M7 16h8"/>
            </svg>
          </div>
          <span class="text-body-sm font-semibold tracking-tight">certgen</span>
        </div>

        <h1 class="font-bold tracking-tight leading-[1.08]" style="font-size:36px;">
          Certificates,<br />
          <span class="text-accent">bulk generated.</span>
        </h1>
      </header>

      <div class="grid grid-cols-12 gap-4 mb-8">
        <NuxtLink to="/templates" class="col-span-12 md:col-span-7 card card-action group min-h-[100px] flex flex-col justify-between p-4">
          <div>
            <div class="w-8 h-8 rounded-lg bg-bg border border-border flex items-center justify-center mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-accent">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <h2 class="text-heading font-semibold mb-1 group-hover:text-accent transition-colors">
              Templates
            </h2>
            <p class="text-body-sm text-muted max-w-sm">
              Drag-and-drop canvas editor. Position text, images, and logos exactly where you want them.
            </p>
          </div>
          <div class="flex items-center gap-2 text-body-sm text-accent mt-4">
            <span>Create template</span>
            <span>→</span>
          </div>
        </NuxtLink>

        <NuxtLink to="/templates/assets" class="col-span-12 md:col-span-5 card card-action group min-h-[100px] flex flex-col justify-between p-4">
          <div>
            <div class="w-8 h-8 rounded-lg bg-bg border border-border flex items-center justify-center mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-accent-secondary">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
            <h2 class="text-heading font-semibold mb-1 group-hover:text-accent transition-colors">
              Assets
            </h2>
            <p class="text-body-sm text-muted max-w-sm">
              Logos, backgrounds, free images. Drag in any file, categorized automatically.
            </p>
          </div>
          <div class="flex items-center gap-2 text-body-sm text-accent mt-4">
            <span>Manage assets</span>
            <span>→</span>
          </div>
        </NuxtLink>
      </div>

      <div class="mb-8">
        <NuxtLink to="/generate" class="card card-action group min-h-[100px] flex flex-col justify-between p-4 relative overflow-hidden">
          <div class="relative z-10">
            <div class="w-8 h-8 rounded-lg bg-bg border border-border flex items-center justify-center mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-[#f59e0b]">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <h2 class="text-heading font-semibold mb-1 group-hover:text-accent transition-colors">
              Bulk Generate
            </h2>
            <p class="text-body-sm text-muted max-w-lg">
              Upload CSV or paste JSON. Select output format. Download a ZIP with every certificate rendered at 2x resolution.
            </p>
          </div>
          <div class="flex items-center gap-2 text-body-sm text-accent mt-4 relative z-10">
            <span>Start generating</span>
            <span>→</span>
          </div>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-12 gap-4 mb-12">
        <div class="col-span-12 md:col-span-4 card p-4 flex flex-col items-center text-center">
          <div class="w-7 h-7 rounded-md flex items-center justify-center mb-2" style="background:var(--color-accent-muted);">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </div>
          <div class="text-body-sm font-semibold mb-1">CSV Upload</div>
          <div class="text-body-sm text-muted">Paste or upload your recipient data</div>
        </div>
        <div class="col-span-12 md:col-span-4 card p-4 flex flex-col items-center text-center">
          <div class="w-7 h-7 rounded-md flex items-center justify-center mb-2" style="background:var(--color-accent-muted);">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <path d="M14 2v6h6"/>
            </svg>
          </div>
          <div class="text-body-sm font-semibold mb-1">PDF Output</div>
          <div class="text-body-sm text-muted">Individual PDFs bundled in a ZIP</div>
        </div>
        <div class="col-span-12 md:col-span-4 card p-4 flex flex-col items-center text-center">
          <div class="w-7 h-7 rounded-md flex items-center justify-center mb-2" style="background:var(--color-accent-muted);">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round">
              <rect x="2" y="2" width="20" height="20" rx="2"/>
              <path d="M2 8h20"/>
            </svg>
          </div>
          <div class="text-body-sm font-semibold mb-1">PNG Output</div>
          <div class="text-body-sm text-muted">High-res images at 2x scale</div>
        </div>
      </div>

      <footer class="pb-6 text-center">
        <span class="text-body-sm text-muted font-mono">fully local · no keys · no limits</span>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
