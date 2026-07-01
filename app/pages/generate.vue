<template>
  <div class="gr-root">
    <!-- TOP BAR -->
    <header class="gr-topbar">
      <NuxtLink to="/" class="gr-logo">
        <span class="gr-logo-mark">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="9.5" r="5.5" stroke="#F5521E" stroke-width="2"/>
            <path d="M9 14l-2 7 5-3 5 3-2-7" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="gr-logo-text">Certif<span class="gr-logo-accent">y</span></span>
      </NuxtLink>
      <div class="gr-topbar-divider" />
      <nav class="gr-topbar-nav">
        <NuxtLink to="/templates" class="gr-tab">Templates</NuxtLink>
        <NuxtLink to="/templates/assets" class="gr-tab">Assets</NuxtLink>
        <NuxtLink to="/generate" class="gr-tab gr-tab--active">Generate</NuxtLink>
      </nav>
      <div class="gr-topbar-actions">
        <div v-if="user" class="gr-plan-badge">
          {{ user.plan === 'pro' ? 'Pro' : 'Free' }} plan
          <a v-if="user.plan !== 'pro'" href="/#pricing" class="gr-plan-upgrade">Upgrade</a>
        </div>
        <SharedUserMenu />
      </div>
    </header>

    <main class="gr-main">
      <div class="gr-header">
        <div>
          <h1 class="gr-title">Generate certificates</h1>
          <p class="gr-subtitle">Upload CSV or JSON data to produce bulk certificates in seconds.</p>
        </div>
      </div>

      <div class="gr-layout">
        <!-- Left: Data input -->
        <div class="gr-card">
          <h2 class="gr-card-title">Select Template</h2>
          <select v-model="selectedTemplateId" class="gr-select">
            <option value="">Choose a template…</option>
            <option v-for="tpl in templates" :key="tpl.id" :value="tpl.id">{{ tpl.name }}</option>
          </select>

          <h2 class="gr-card-title" style="margin-top:24px">Upload Data</h2>
          <div class="gr-tabs">
            <button class="gr-tab-btn" :class="{ 'gr-tab-btn--active': uploadMode === 'csv' }" @click="uploadMode = 'csv'">CSV Upload</button>
            <button class="gr-tab-btn" :class="{ 'gr-tab-btn--active': uploadMode === 'json' }" @click="uploadMode = 'json'">JSON Input</button>
            <button class="gr-tab-btn" :class="{ 'gr-tab-btn--active': uploadMode === 'single' }" @click="uploadMode = 'single'">Single Entry</button>
          </div>

          <div v-if="uploadMode === 'csv'" class="gr-upload-zone">
            <div class="gr-field-label">Upload CSV File</div>
            <input type="file" accept=".csv" @change="onCsvUpload" class="gr-file-input" />
            <div class="gr-hint">CSV columns: {{ csvColumnsHint || 'select a template to see expected columns' }}</div>
            <a v-if="csvDownloadUrl" :href="csvDownloadUrl" download="example.csv" class="gr-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M8 11l4 4 4-4M5 19h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Download example CSV
            </a>
          </div>

          <div v-else-if="uploadMode === 'json'" class="gr-upload-zone">
            <div class="gr-field-label">Paste JSON Array</div>
            <textarea
              v-model="jsonInput"
              rows="8"
              class="gr-textarea"
              :placeholder="jsonPlaceholder"
            ></textarea>
            <div class="gr-hint">Each object should have keys matching template placeholders: {{ templatePlaceholders.join(', ') || 'none' }}</div>
            <button class="gr-btn" @click="parseJson">Parse JSON</button>
          </div>

          <div v-else-if="uploadMode === 'single'" class="gr-upload-zone">
            <div v-if="!selectedTemplateId" class="gr-empty">
              <p>Please select a template first</p>
            </div>
            <div v-else-if="templatePlaceholders.length === 0" class="gr-empty">
              <p>This template has no placeholders</p>
            </div>
            <div v-else style="display:flex;flex-direction:column;gap:12px">
              <div v-for="field in templatePlaceholders" :key="field" class="gr-field">
                <label class="gr-field-label">{{ field.replace(/_/g, ' ') }}</label>
                <input v-if="field === 'date'" v-model="singleData[field]" type="date" class="gr-input" />
                <input v-else v-model="singleData[field]" type="text" class="gr-input" :placeholder="`Enter ${field}`" />
              </div>
              <button class="gr-btn" @click="useSingleData">Use This Data</button>
            </div>
          </div>

          <!-- Data Preview -->
          <div v-if="data.length > 0">
            <div class="gr-preview-head">
              <h2 class="gr-card-title">Data Preview <span class="gr-preview-count">({{ data.length }} records)</span></h2>
              <button class="gr-btn-clear" @click="clearData">Clear</button>
            </div>
            <div class="gr-table-wrap">
              <table class="gr-table">
                <thead>
                  <tr><th v-for="key in dataKeys" :key="key">{{ key }}</th></tr>
                </thead>
                <tbody>
                  <tr v-for="(row, idx) in data.slice(0, 10)" :key="idx">
                    <td v-for="key in dataKeys" :key="key">{{ row[key] || '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="data.length > 10" class="gr-hint" style="margin-top:12px">Showing first 10 of {{ data.length }} records</div>
          </div>
        </div>

        <!-- Right: Generate panel -->
        <div class="gr-card gr-card--sticky">
          <h2 class="gr-card-title">Generate</h2>

          <div class="gr-stat">
            <div class="gr-stat-label">Template</div>
            <div class="gr-stat-val">{{ selectedTemplateId ? templates?.find(t => t.id === selectedTemplateId)?.name : 'Not selected' }}</div>
          </div>
          <div class="gr-stat">
            <div class="gr-stat-label">Records</div>
            <div class="gr-stat-val gr-stat-val--mono">{{ data.length }}</div>
          </div>

          <div class="gr-field">
            <label class="gr-field-label">Output Format</label>
            <select v-model="outputFormat" class="gr-select">
              <option value="pdf">PDF (individual files in ZIP)</option>
              <option value="png">PNG (images in ZIP)</option>
            </select>
          </div>

          <div class="gr-field">
            <label class="gr-field-label">Quality</label>
            <div class="gr-quality-row">
              <button
                v-for="opt in qualityOptions"
                :key="opt.value"
                class="gr-quality-btn"
                :class="{ 'gr-quality-btn--active': quality === opt.value }"
                @click="quality = opt.value"
              >
                <div class="gr-quality-label">{{ opt.label }}</div>
                <div class="gr-quality-desc">{{ opt.desc }}</div>
              </button>
            </div>
          </div>

          <button
            class="gr-generate-btn"
            :class="{ 'gr-generate-btn--done': generationDone }"
            :disabled="!selectedTemplateId || data.length === 0 || generating"
            @click="generateBulk"
            title="Start bulk generation"
          >
            <svg v-if="!generating && !generationDone" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13 3L5 13h6l-1 8 8-10h-6l1-8z" stroke="#fff" stroke-width="1.9" stroke-linejoin="round"/></svg>
            <svg v-if="generationDone" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12l4.5 4.5L19 7" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ generating ? `Generating… (${progress}/${data.length})` : generationDone ? 'Done!' : 'Generate All' }}
          </button>

          <div v-if="generating || generationDone" class="gr-progress">
            <div class="gr-progress-bar">
              <div class="gr-progress-fill" :class="{ 'gr-progress-fill--done': generationDone }" :style="{ width: generationDone ? '100%' : (progress / data.length * 100) + '%' }" />
            </div>
            <div class="gr-progress-text">{{ generationDone ? 'Complete' : `${progress}/${data.length}` }}</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Papa from 'papaparse'
import JSZip from 'jszip'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

const { user } = useAuth()
const route = useRoute()
const templates = ref<any[]>([]);
const fonts = ref<any[]>([]);

const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl || 'http://localhost:4000';

async function loadData() {
  try {
    const { get } = useApi();
    templates.value = await get('/api/templates');
    
    const rawFonts = await get('/api/fonts');
    fonts.value = rawFonts.map((f: any) => ({
      ...f,
      filepath: f.filepath ? `${apiBaseUrl}/uploads/${f.filepath}` : null
    }));
  } catch (err) {
    console.error('Failed to load data:', err);
  }
}

onMounted(() => {
  loadData();
});

watch(fonts, (newFonts) => {
  if (newFonts && newFonts.length > 0) {
    newFonts.forEach((font: any) => {
      const fontFace = new FontFace(font.fontFamily, `url(${font.filepath})`, {
        weight: font.fontWeight || '400',
        style: font.fontStyle || 'normal',
      })
      fontFace.load().then(f => document.fonts.add(f)).catch(console.error)
    })
  }
}, { immediate: true })

const selectedTemplateId = ref<number | null>(null)
const uploadMode = ref<'csv' | 'json' | 'single'>('csv')
const jsonInput = ref('')
const data = ref<Record<string, any>[]>([])
const singleData = ref<Record<string, any>>({})
const outputFormat = ref<'pdf' | 'png'>('pdf')
const quality = ref<'standard' | 'high' | 'maximum'>('high')
const qualityOptions = [
  { value: 'standard' as const, label: 'Standard', desc: 'smaller file' },
  { value: 'high' as const, label: 'High', desc: 'balanced' },
  { value: 'maximum' as const, label: 'Maximum', desc: 'best quality' },
]
const dataKeys = computed(() => data.value.length === 0 ? [] : Object.keys(data.value[0]))
const generating = ref(false)
const generationDone = ref(false)
const progress = ref(0)

if (route.query.template) selectedTemplateId.value = parseInt(route.query.template as string)

const templatePlaceholders = computed(() => {
  if (!selectedTemplateId.value || !templates.value) return []
  const template = templates.value.find(t => t.id === selectedTemplateId.value)
  if (!template) return []
  try {
    const layout = typeof template.layout === 'string' ? JSON.parse(template.layout) : template.layout
    const placeholders = new Set<string>()
    ;(layout.elements || []).forEach((el: any) => {
      const content = el.content || el.text || ''
      const matches = content.match(/\{(\w+)\}/g)
      if (matches) matches.forEach((m: string) => placeholders.add(m.replace(/[{}]/g, '').trim()))
      if (el.field) { const fm = el.field.match(/\{?(\w+)\}?/); if (fm) placeholders.add(fm[1]) }
    })
    return Array.from(placeholders).sort()
  } catch { return [] }
})

watch([selectedTemplateId, templatePlaceholders], () => {
  const d: Record<string, any> = {}
  templatePlaceholders.value.forEach(key => { d[key] = key === 'date' ? new Date().toISOString().split('T')[0] : '' })
  singleData.value = d
}, { immediate: true })

const jsonPlaceholder = computed(() => {
  if (templatePlaceholders.value.length === 0) return '[{"name":"John Doe","date":"2026-06-27"}]'
  const sample: Record<string, string> = {}
  for (const key of templatePlaceholders.value) {
    if (key.includes('date') || key.includes('Date')) sample[key] = '2026-06-27'
    else if (key.includes('name') || key.includes('Name')) sample[key] = 'John Doe'
    else sample[key] = `your ${key.replace(/_/g, ' ')}`
  }
  return JSON.stringify([sample])
})

const csvColumnsHint = computed(() => templatePlaceholders.value.length > 0 ? templatePlaceholders.value.join(', ') : '')
const csvDownloadUrl = ref('')

watch(templatePlaceholders, () => {
  if (csvDownloadUrl.value) URL.revokeObjectURL(csvDownloadUrl.value)
  if (templatePlaceholders.value.length === 0) { csvDownloadUrl.value = ''; return }
  const header = templatePlaceholders.value.join(',')
  const sample = templatePlaceholders.value.map(key => {
    if (key.includes('date') || key.includes('Date')) return '2026-06-27'
    if (key.includes('name') || key.includes('Name')) return 'John Doe'
    return `your ${key.replace(/_/g, ' ')}`
  }).join(',')
  const blob = new Blob([`${header}\n${sample}\n`], { type: 'text/csv' })
  csvDownloadUrl.value = URL.createObjectURL(blob)
}, { immediate: true })

function onCsvUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  Papa.parse(file, { header: true, skipEmptyLines: true, complete: (r) => { data.value = r.data as any[] }, error: (e) => alert('CSV error: ' + e.message) })
}

function parseJson() {
  try {
    const parsed = JSON.parse(jsonInput.value)
    if (!Array.isArray(parsed)) { alert('JSON must be an array'); return }
    data.value = parsed
  } catch (e) { alert('Invalid JSON: ' + (e as Error).message) }
}

function useSingleData() {
  if (!Object.values(singleData.value).some(v => v !== '')) { alert('Fill at least one field'); return }
  data.value = [{ ...singleData.value }]
}

function clearData() { data.value = []; jsonInput.value = '' }

async function generateBulk() {
  if (!selectedTemplateId.value || data.value.length === 0) return
  generating.value = true; generationDone.value = false; progress.value = 0
  try {
    const { get } = useApi();
    const zip = new JSZip()
    const template = await get(`/api/templates/${selectedTemplateId.value}`)
    const layout = typeof template.layout === 'string' ? JSON.parse(template.layout) : template.layout
    for (let i = 0; i < data.value.length; i++) {
      const blob = await renderCertificate(layout, data.value[i], outputFormat.value)
      const ext = outputFormat.value === 'pdf' ? 'pdf' : 'png'
      zip.file(`cert-${String(i + 1).padStart(3, '0')}.${ext}`, blob)
      progress.value = i + 1
      await new Promise(r => setTimeout(r, 10))
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(zipBlob)
    link.download = `certificates-${Date.now()}.zip`
    link.click()
    generating.value = false
    generationDone.value = true
    setTimeout(() => { generationDone.value = false }, 3000)
  } catch (e) { generating.value = false; generationDone.value = false; alert('Generation failed: ' + (e as Error).message) }
}

// Normalize asset path: strip old full URL if present, rebuild with current apiBaseUrl
function normalizeAssetPath(path: string): string {
  if (!path) return path;
  // Skip data URIs (inline SVG)
  if (path.startsWith('data:')) return path;
  // Strip old full URL prefix if present
  const uploadsMatch = path.match(/https?:\/\/[^/]+\/uploads\/(.+)/);
  if (uploadsMatch) {
    return `${apiBaseUrl}/uploads/${uploadsMatch[1]}`;
  }
  // If already starts with current apiBaseUrl, keep as-is
  if (path.startsWith(apiBaseUrl)) return path;
  // If relative path, prepend current apiBaseUrl
  if (!path.startsWith('http')) {
    return `${apiBaseUrl}/uploads/${path}`;
  }
  // Other absolute URLs (external), keep as-is
  return path;
}

async function renderCertificate(layout: any, record: Record<string, any>, format: 'pdf' | 'png'): Promise<Blob> {
  console.log('=== renderCertificate DEBUG ===')
  console.log('layout.background:', layout.background)
  console.log('layout.elements:', layout.elements?.map((el: any) => ({ kind: el.kind, src: el.src, filepath: el.filepath })))
  
  const presets: Record<string, any> = { standard: { scale: 1, jpeg: 0.75 }, high: { scale: 1.5, jpeg: 0.85 }, maximum: { scale: 2, jpeg: 0.95 } }
  const preset = presets[quality.value]
  const container = document.createElement('div')
  container.style.cssText = `position:absolute;left:-9999px;width:${layout.width}px;height:${layout.height}px;background:${layout.backgroundColor || '#fff'}`
  document.body.appendChild(container)
  
  const imagesToLoad: Promise<any>[] = []
  const imageElements: { img: HTMLImageElement; containerW: number; containerH: number }[] = []
  
  // Background image - load before appending
  if (layout.background) {
    const bg = document.createElement('img');
    const normalizedBg = normalizeAssetPath(layout.background)
    console.log('background normalized:', normalizedBg)
    bg.style.cssText = 'width:100%;height:100%;object-fit:contain;position:absolute'
    
    const bgPromise = new Promise((resolve, reject) => {
      bg.onload = () => resolve(true)
      bg.onerror = () => reject(new Error(`Background failed: ${normalizedBg}`))
      setTimeout(() => reject(new Error(`Background timeout: ${normalizedBg}`)), 10000)
      bg.src = normalizedBg
    })
    imagesToLoad.push(bgPromise)
    container.appendChild(bg)
  }
  for (const el of (layout.elements || [])) {
    const div = document.createElement('div')
    div.style.cssText = `position:absolute;left:${el.x}px;top:${el.y}px;width:${el.width || el.w}px;height:${el.height || el.h}px;overflow:hidden`
    if (el.type === 'text' || el.kind === 'text' || el.kind === 'field') {
      let content = el.content || el.text || ''
      for (const [k, v] of Object.entries(record)) content = content.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
      const textDiv = document.createElement('div')
      textDiv.textContent = content
      textDiv.style.fontFamily = el.fontFamily || el.font || 'serif'
      textDiv.style.fontSize = (el.fontSize || el.size || 24) + 'px'
      textDiv.style.color = el.color || '#000'
      textDiv.style.fontWeight = el.fontWeight || el.weight || '400'
      textDiv.style.fontStyle = el.fontStyle || (el.italic ? 'italic' : 'normal')
      textDiv.style.textAlign = el.textAlign || el.align || 'left'
      textDiv.style.letterSpacing = (el.letterSpacing || el.letter || 0) + 'px'
      textDiv.style.opacity = String((el.opacity || 100) / 100)
      textDiv.style.display = 'flex'
      textDiv.style.alignItems = 'center'
      textDiv.style.justifyContent = el.textAlign === 'left' || el.align === 'left' ? 'flex-start' : el.textAlign === 'right' || el.align === 'right' ? 'flex-end' : 'center'
      textDiv.style.width = '100%'
      textDiv.style.height = '100%'
      textDiv.style.lineHeight = '1.25'
      div.appendChild(textDiv)
    } else if ((el.type === 'image' || el.kind === 'image') && (el.src || el.filepath)) {
      const img = document.createElement('img');
      const imgSrc = el.src || el.filepath;
      const normalizedSrc = normalizeAssetPath(imgSrc)
      console.log('image element:', { original: imgSrc, normalized: normalizedSrc })
      img.style.display = 'block'
      const containerW = el.width || el.w
      const containerH = el.height || el.h
      const imgPromise = new Promise((resolve, reject) => {
        img.onload = () => resolve(true)
        img.onerror = () => reject(new Error(`Image failed: ${normalizedSrc}`))
        setTimeout(() => reject(new Error(`Image timeout: ${normalizedSrc}`)), 10000)
        img.src = normalizedSrc
      })
      imagesToLoad.push(imgPromise)
      imageElements.push({ img, containerW, containerH })
      div.appendChild(img)
    } else if (el.kind === 'bar' || el.kind === 'shape') {
      div.style.background = el.color || '#000'
      div.style.borderRadius = '2px'
    } else if (el.kind === 'seal') {
      div.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="9" r="6" stroke="${el.color}" stroke-width="1.5"/><circle cx="32" cy="9" r="2" fill="${el.color}"/><path d="M26 18l-4 15 10-5 10 5-4-15" stroke="${el.color}" stroke-width="1.5" stroke-linejoin="round"/><circle cx="32" cy="42" r="16" stroke="${el.color}" stroke-width="1.2"/><path d="M32 32v14M25 44h14M28 38l4-4 4 4M29 48l3-3 3 3" stroke="${el.color}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    }
    container.appendChild(div)
  }
  
  // Wait for all images to load
  console.log(`Waiting for ${imagesToLoad.length} images to load...`)
  try {
    await Promise.all(imagesToLoad)
    console.log('All images loaded successfully')
  } catch (err) {
    console.error('Image loading error:', err)
  }

  // Manual object-fit:contain — compute exact px size/pos to avoid html2canvas quirks
  for (const { img, containerW, containerH } of imageElements) {
    if (!img.naturalWidth || !img.naturalHeight) continue
    const nw = img.naturalWidth
    const nh = img.naturalHeight
    const scale = Math.min(containerW / nw, containerH / nh)
    const rw = Math.round(nw * scale)
    const rh = Math.round(nh * scale)
    const ox = Math.round((containerW - rw) / 2)
    const oy = Math.round((containerH - rh) / 2)
    img.style.position = 'absolute'
    img.style.left = ox + 'px'
    img.style.top = oy + 'px'
    img.style.width = rw + 'px'
    img.style.height = rh + 'px'
  }
  
  // Extra wait for render
  await new Promise(r => setTimeout(r, 300))
  const canvas = await html2canvas(container, { 
    backgroundColor: '#ffffff', 
    scale: preset.scale,
    useCORS: true,
    allowTaint: false,
    logging: true
  })
  document.body.removeChild(container)
  if (format === 'png') {
    return new Promise(resolve => canvas.toBlob(b => resolve(b!), 'image/jpeg', preset.jpeg))
  }
  const pdf = new jsPDF({ orientation: layout.width > layout.height ? 'landscape' : 'portrait', unit: 'pt', format: [layout.width, layout.height] })
  pdf.addImage(canvas.toDataURL('image/jpeg', preset.jpeg), 'JPEG', 0, 0, layout.width, layout.height)
  return pdf.output('blob')
}
</script>

<style scoped>
.gr-root {
  --gr-accent: #F5521E; --gr-ink: #14110E; --gr-muted: #6E665E;
  --gr-cream: #F2ECE7; --gr-line: rgba(20,17,14,0.09); --gr-surface: #fff;
  min-height: 100vh; display: flex; flex-direction: column;
  background: var(--gr-cream);
  font-family: 'General Sans', system-ui, sans-serif;
  color: var(--gr-ink); -webkit-font-smoothing: antialiased;
}

/* top bar */
.gr-topbar {
  position: sticky; top: 0; flex: 0 0 auto; height: 58px;
  background: rgba(255,255,255,0.86); backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--gr-line);
  display: flex; align-items: center; padding: 0 28px; gap: 16px; z-index: 30;
}
.gr-logo { display: flex; align-items: center; gap: 9px; text-decoration: none; color: var(--gr-ink); }
.gr-logo-mark { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 8px; background: var(--gr-ink); }
.gr-logo-text { font-weight: 600; font-size: 15px; }
.gr-logo-accent { color: var(--gr-accent); }
.gr-topbar-divider { width: 1px; height: 24px; background: var(--gr-line); }
.gr-topbar-nav { display: flex; align-items: center; gap: 2px; }
.gr-tab { text-decoration: none; font-size: 14px; font-weight: 500; color: var(--gr-muted); padding: 8px 13px; border-radius: 8px; transition: background .15s, color .15s; }
.gr-tab:hover { background: rgba(20,17,14,0.05); color: var(--gr-ink); }
.gr-tab--active { font-weight: 600; color: var(--gr-ink); background: rgba(20,17,14,0.06); }
.gr-topbar-actions { margin-left: auto; display: flex; align-items: center; gap: 10px; }
.gr-plan-badge { display: flex; align-items: center; gap: 7px; background: #FFF4F0; border: 1px solid rgba(245,82,30,0.2); padding: 7px 8px 7px 13px; border-radius: 999px; font-size: 12.5px; font-weight: 500; color: var(--gr-accent); }
.gr-plan-upgrade { text-decoration: none; background: var(--gr-ink); color: #fff; font-size: 12px; font-weight: 600; padding: 5px 11px; border-radius: 999px; }
.gr-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg,#F5521E,#ff8a5b); display: grid; place-items: center; color: #fff; font-size: 13px; font-weight: 600; }

/* main */
.gr-main { flex: 1; padding: 32px 32px 64px; max-width: 1240px; margin: 0 auto; width: 100%; }
.gr-header { margin-bottom: 26px; }
.gr-title { margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -0.025em; }
.gr-subtitle { margin: 6px 0 0; font-size: 14px; color: var(--gr-muted); }

.gr-layout { display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: start; }

/* card */
.gr-card {
  background: var(--gr-surface); border: 1px solid var(--gr-line);
  border-radius: 18px; padding: 28px;
  box-shadow: 0 4px 16px rgba(20,17,14,0.04);
}
.gr-card--sticky { position: sticky; top: 82px; }
.gr-card-title { font-size: 16px; font-weight: 600; margin: 0 0 14px; }

/* form */
.gr-field { margin-bottom: 14px; }
.gr-field-label { display: block; font-size: 12px; font-weight: 600; color: var(--gr-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
.gr-select, .gr-input {
  width: 100%; border: 1px solid var(--gr-line); background: #fff; border-radius: 9px;
  padding: 10px 12px; font-family: inherit; font-size: 13.5px; color: var(--gr-ink);
  outline: none; box-sizing: border-box;
}
.gr-select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236E665E' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
.gr-file-input { font-size: 13.5px; font-family: inherit; width: 100%; }
.gr-textarea {
  width: 100%; border: 1px solid var(--gr-line); background: #fff; border-radius: 9px;
  padding: 10px 12px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--gr-ink);
  outline: none; resize: vertical; box-sizing: border-box;
}
.gr-hint { font-size: 12px; color: var(--gr-muted); margin-top: 8px; line-height: 1.45; }
.gr-link {
  display: inline-flex; align-items: center; gap: 6px;
  color: var(--gr-accent); text-decoration: none; font-size: 13px; font-weight: 600; margin-top: 10px;
}
.gr-upload-zone { margin-top: 14px; }

/* tabs */
.gr-tabs { display: flex; gap: 4px; margin-bottom: 4px; background: var(--gr-cream); border-radius: 10px; padding: 4px; }
.gr-tab-btn {
  flex: 1; border: none; background: transparent; cursor: pointer;
  font-family: inherit; font-size: 13px; font-weight: 500; color: var(--gr-muted);
  padding: 9px 12px; border-radius: 8px; transition: all .15s;
}
.gr-tab-btn--active { background: #fff; color: var(--gr-ink); font-weight: 600; box-shadow: 0 2px 6px rgba(20,17,14,0.08); }

/* btn */
.gr-btn {
  border: none; background: var(--gr-ink); color: #fff;
  font-family: inherit; font-size: 13.5px; font-weight: 600;
  padding: 10px 18px; border-radius: 9px; cursor: pointer; margin-top: 12px;
  transition: transform .2s;
}
.gr-btn:hover { transform: translateY(-1px); }
.gr-btn-clear { border: none; background: transparent; cursor: pointer; font-family: inherit; font-size: 13px; color: var(--gr-muted); font-weight: 500; }

/* preview */
.gr-preview-head { display: flex; align-items: center; justify-content: space-between; margin-top: 24px; }
.gr-preview-count { color: var(--gr-muted); font-weight: 400; font-size: 14px; }
.gr-table-wrap { overflow-x: auto; margin-top: 12px; border: 1px solid var(--gr-line); border-radius: 10px; }
.gr-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.gr-table th { background: var(--gr-cream); font-weight: 600; padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--gr-line); white-space: nowrap; }
.gr-table td { padding: 10px 14px; border-bottom: 1px solid var(--gr-line); white-space: nowrap; }
.gr-table tr:last-child td { border-bottom: none; }

/* stats */
.gr-stat { border-radius: 10px; padding: 12px 14px; border: 1px solid var(--gr-line); background: var(--gr-cream); margin-bottom: 10px; }
.gr-stat-label { font-size: 11px; color: var(--gr-muted); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.04em; font-weight: 600; }
.gr-stat-val { font-size: 14px; font-weight: 600; }
.gr-stat-val--mono { font-family: 'JetBrains Mono', monospace; }

/* quality */
.gr-quality-row { display: flex; gap: 8px; }
.gr-quality-btn {
  flex: 1; border: 1px solid var(--gr-line); background: #fff; cursor: pointer;
  font-family: inherit; padding: 10px; border-radius: 10px; transition: all .15s;
}
.gr-quality-btn--active { border-color: var(--gr-accent); background: #FFF4F0; }
.gr-quality-label { font-size: 13px; font-weight: 600; }
.gr-quality-desc { font-size: 11px; color: var(--gr-muted); margin-top: 2px; }

/* generate */
.gr-generate-btn {
  width: 100%; border: none; background: var(--gr-accent); color: #fff;
  font-family: inherit; font-size: 14px; font-weight: 600;
  padding: 14px; border-radius: 12px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  box-shadow: 0 8px 20px rgba(245,82,30,0.3); margin-top: 16px;
  transition: transform .2s;
}
.gr-generate-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.gr-generate-btn:not(:disabled):hover { transform: translateY(-1px); }

.gr-progress { margin-top: 14px; }
.gr-progress-bar { height: 7px; border-radius: 6px; background: var(--gr-cream); overflow: hidden; }
.gr-progress-fill { height: 100%; background: var(--gr-accent); border-radius: 6px; transition: width .3s ease; }
.gr-progress-fill--done { background: #1F8A5B; }
.gr-progress-text { font-size: 12px; color: var(--gr-muted); text-align: right; margin-top: 6px; font-family: 'JetBrains Mono', monospace; }
.gr-generate-btn--done { background: #1F8A5B; box-shadow: 0 8px 20px rgba(31,138,91,0.3); }

.gr-empty { padding: 20px; text-align: center; color: var(--gr-muted); font-size: 14px; }
</style>
