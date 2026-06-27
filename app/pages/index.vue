<template>
  <div class="page">
    <div class="page-container">
      <header class="pt-16 pb-12 mb-12 text-center">
        <div class="flex items-center justify-center gap-2 mb-8">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:var(--color-obsidian)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <path d="M7 8h10M7 12h6M7 16h8"/>
            </svg>
          </div>
          <span class="font-semibold tracking-tight" style="font-size:16px;">certgen</span>
        </div>

        <h1 class="font-bold tracking-tight mb-4" style="font-size:56px; line-height:1.12; color:var(--color-obsidian);">
          Certificates,<br />
          <span style="color:var(--color-steel);">bulk generated.</span>
        </h1>
        <p class="text-body-lg" style="color:var(--color-steel); max-width:560px; margin:0 auto;">
          Design templates with a drag-and-drop canvas. Upload CSV data. Download hundreds of certificates in seconds.
        </p>
      </header>

      <div class="grid grid-cols-12 gap-4 mb-8">
        <NuxtLink to="/templates" class="col-span-12 md:col-span-7 card card-action group min-h-[140px] flex flex-col justify-between p-6">
          <div>
            <div class="w-10 h-10 rounded-xl bg-mist border border-border flex items-center justify-center mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="color:var(--color-obsidian)">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <h2 class="font-semibold mb-2 group-hover:text-obsidian transition-colors" style="font-size:32px; line-height:1.28;">
              Templates
            </h2>
            <p class="text-body-lg max-w-sm" style="color:var(--color-steel);">
              Drag-and-drop canvas editor. Position text, images, and logos exactly where you want them.
            </p>
          </div>
          <div class="flex items-center gap-2 text-body mt-6" style="color:var(--color-obsidian); font-weight:500;">
            <span>Create template</span>
            <span>→</span>
          </div>
        </NuxtLink>

        <NuxtLink to="/templates/assets" class="col-span-12 md:col-span-5 card card-action group min-h-[140px] flex flex-col justify-between p-6">
          <div>
            <div class="w-10 h-10 rounded-xl bg-mist border border-border flex items-center justify-center mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="color:var(--color-ember)">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
            <h2 class="font-semibold mb-2 group-hover:text-obsidian transition-colors" style="font-size:32px; line-height:1.28;">
              Assets
            </h2>
            <p class="text-body-lg max-w-sm" style="color:var(--color-steel);">
              Logos, backgrounds, free images. Drag in any file, categorized automatically.
            </p>
          </div>
          <div class="flex items-center gap-2 text-body mt-6" style="color:var(--color-obsidian); font-weight:500;">
            <span>Manage assets</span>
            <span>→</span>
          </div>
        </NuxtLink>
      </div>

      <div class="mb-8">
        <NuxtLink to="/generate" class="card card-action group min-h-[140px] flex flex-col justify-between p-6 relative overflow-hidden">
          <div class="relative z-10">
            <div class="w-10 h-10 rounded-xl bg-mist border border-border flex items-center justify-center mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="color:#f59e0b">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <h2 class="font-semibold mb-2 group-hover:text-obsidian transition-colors" style="font-size:32px; line-height:1.28;">
              Bulk Generate
            </h2>
            <p class="text-body-lg max-w-lg" style="color:var(--color-steel);">
              Upload CSV or paste JSON. Select output format. Download a ZIP with every certificate rendered at 2x resolution.
            </p>
          </div>
          <div class="flex items-center gap-2 text-body mt-6 relative z-10" style="color:var(--color-obsidian); font-weight:500;">
            <span>Start generating</span>
            <span>→</span>
          </div>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-12 gap-4 mb-12">
        <div class="col-span-12 md:col-span-4 card p-6 flex flex-col items-center text-center">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style="background:var(--color-accent-muted);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-obsidian)" stroke-width="2.5" stroke-linecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </div>
          <div class="text-body font-semibold mb-1" style="font-weight:600;">CSV Upload</div>
          <div class="text-body" style="color:var(--color-steel);">Paste or upload your recipient data</div>
        </div>
        <div class="col-span-12 md:col-span-4 card p-6 flex flex-col items-center text-center">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style="background:var(--color-accent-muted);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-obsidian)" stroke-width="2.5" stroke-linecap="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <path d="M14 2v6h6"/>
            </svg>
          </div>
          <div class="text-body font-semibold mb-1" style="font-weight:600;">PDF Output</div>
          <div class="text-body" style="color:var(--color-steel);">Individual PDFs bundled in a ZIP</div>
        </div>
        <div class="col-span-12 md:col-span-4 card p-6 flex flex-col items-center text-center">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style="background:var(--color-accent-muted);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-obsidian)" stroke-width="2.5" stroke-linecap="round">
              <rect x="2" y="2" width="20" height="20" rx="2"/>
              <path d="M2 8h20"/>
            </svg>
          </div>
          <div class="text-body font-semibold mb-1" style="font-weight:600;">PNG Output</div>
          <div class="text-body" style="color:var(--color-steel);">High-res images at 2x scale</div>
        </div>
      </div>

      <footer class="pb-6 text-center">
        <span class="text-body font-mono" style="color:var(--color-ash);">fully local · no keys · no limits</span>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
