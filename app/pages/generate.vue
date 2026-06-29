<template>
  <div class="page">
    <div class="page-container">
      <header style="padding-top: var(--space-10); padding-bottom: var(--space-8); margin-bottom: var(--space-8);">
        <NuxtLink to="/" class="inline-flex items-center" style="gap: var(--space-2); margin-bottom: var(--space-6); color: var(--color-text-secondary); font-size: var(--text-sm); font-weight: var(--weight-medium); transition: color var(--duration-fast) var(--ease-standard);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>Back</span>
        </NuxtLink>
        <h1 class="text-heading-lg" style="margin-bottom: var(--space-3);">Bulk Generate Certificates</h1>
        <p class="text-body" style="color: var(--color-text-secondary);">Upload CSV or JSON data to generate multiple certificates at once</p>
      </header>

      <div class="grid lg:grid-cols-3" style="gap: var(--space-8);">
        <div class="lg:col-span-2" style="display: flex; flex-direction: column; gap: var(--space-8);">
          <div class="card" style="padding: var(--space-8);">
            <h2 class="text-heading-sm" style="margin-bottom: var(--space-6);">Select Template</h2>
            <select v-model="selectedTemplateId">
              <option value="">Choose a template...</option>
              <option v-for="tpl in templates" :key="tpl.id" :value="tpl.id">
                {{ tpl.name }}
              </option>
            </select>
          </div>

          <div class="card" style="padding: var(--space-8);">
            <h2 class="text-heading-sm" style="margin-bottom: var(--space-6);">Upload Data</h2>

            <div class="tabs" style="margin-bottom: var(--space-6);">
              <button
                @click="uploadMode = 'csv'"
                :class="['tab', uploadMode === 'csv' && 'tab-active']"
              >
                CSV Upload
              </button>
              <button
                @click="uploadMode = 'json'"
                :class="['tab', uploadMode === 'json' && 'tab-active']"
              >
                JSON Input
              </button>
              <button
                @click="uploadMode = 'single'"
                :class="['tab', uploadMode === 'single' && 'tab-active']"
              >
                Single Certificate
              </button>
            </div>

            <div v-if="uploadMode === 'csv'">
              <div class="form-group">
                <label class="form-label">Upload CSV File</label>
                <input type="file" accept=".csv" @change="onCsvUpload" />
                <span class="text-caption" style="color: var(--color-text-muted); display: block; margin-top: var(--space-2);">CSV columns: {{ csvColumnsHint || 'select a template to see expected columns' }}</span>
              </div>
              <a
                v-if="csvDownloadUrl"
                :href="csvDownloadUrl"
                download="example.csv"
                class="inline-flex items-center"
                style="margin-top: var(--space-3); color: var(--color-primary); font-weight: var(--weight-medium); font-size: var(--text-sm); gap: var(--space-2); transition: color var(--duration-fast) var(--ease-standard);"
              >
                <BaseIcon name="download" :size="16" />
                Download example CSV
              </a>
            </div>

            <div v-else-if="uploadMode === 'json'">
              <div class="form-group">
                <label class="form-label">Paste JSON Array</label>
                <textarea
                  v-model="jsonInput"
                  rows="8"
                  style="font-family: var(--font-mono); font-size: var(--text-sm);"
                  :placeholder="jsonPlaceholder"
                ></textarea>
                <span class="text-caption" style="color: var(--color-text-muted); display: block; margin-top: var(--space-2);">Each object should have keys matching template placeholders: {{ templatePlaceholders.join(', ') || 'none' }}</span>
              </div>
              <button @click="parseJson" class="btn-primary" style="margin-top: var(--space-4);">
                Parse JSON
              </button>
            </div>

            <div v-else-if="uploadMode === 'single'">
              <div v-if="!selectedTemplateId" class="card" style="padding: var(--space-8); text-align: center; background: var(--color-surface-hover);">
                <p class="text-body" style="color: var(--color-text-secondary);">Please select a template first</p>
              </div>
              <div v-else-if="templatePlaceholders.length === 0" class="card" style="padding: var(--space-8); text-align: center; background: var(--color-surface-hover);">
                <p class="text-body" style="color: var(--color-text-secondary);">This template has no placeholders</p>
              </div>
              <div v-else style="display: flex; flex-direction: column; gap: var(--space-4);">
                <div v-for="field in templatePlaceholders" :key="field" class="form-group">
                  <label class="form-label" style="text-transform: capitalize;">{{ field.replace(/_/g, ' ') }}</label>
                  <input
                    v-if="field === 'date'"
                    v-model="singleData[field]"
                    type="date"
                  />
                  <input
                    v-else
                    v-model="singleData[field]"
                    type="text"
                    :placeholder="`Enter ${field.replace(/_/g, ' ')}`"
                  />
                </div>
                <button @click="useSingleData" class="btn-primary" style="margin-top: var(--space-2);">
                  Use This Data
                </button>
              </div>
            </div>
          </div>

          <div v-if="data.length > 0" class="card" style="padding: var(--space-8);">
            <div class="flex justify-between items-center" style="margin-bottom: var(--space-6);">
              <h2 class="text-heading-sm">Data Preview <span style="color: var(--color-text-muted); font-weight: var(--weight-normal);">({{ data.length }} records)</span></h2>
              <button @click="clearData" class="btn-ghost" style="padding: var(--space-2) var(--space-3); font-size: var(--text-sm);">Clear</button>
            </div>

            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th v-for="key in dataKeys" :key="key">{{ key }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, idx) in data.slice(0, 10)" :key="idx">
                    <td v-for="key in dataKeys" :key="key">{{ row[key] || '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-if="data.length > 10" class="text-caption" style="margin-top: var(--space-4); color: var(--color-text-muted);">
              Showing first 10 of {{ data.length }} records
            </p>
          </div>
        </div>

        <div class="card" style="padding: var(--space-8); height: fit-content;">
          <h2 class="text-heading-sm" style="margin-bottom: var(--space-8);">Generate</h2>

          <div style="display: flex; flex-direction: column; gap: var(--space-5);">
            <div style="border-radius: var(--radius-xl); padding: var(--space-5); border: 1px solid var(--color-border); background: var(--color-surface-hover);">
              <div class="text-caption" style="color: var(--color-text-muted); margin-bottom: var(--space-2);">Template</div>
              <div class="text-body" style="font-weight: var(--weight-medium);">
                {{ selectedTemplateId ? templates?.find(t => t.id === selectedTemplateId)?.name : 'Not selected' }}
              </div>
            </div>

            <div style="border-radius: var(--radius-xl); padding: var(--space-5); border: 1px solid var(--color-border); background: var(--color-surface-hover);">
              <div class="text-caption" style="color: var(--color-text-muted); margin-bottom: var(--space-2);">Records</div>
              <div class="text-body" style="font-weight: var(--weight-medium); font-family: var(--font-mono);">{{ data.length }}</div>
            </div>

            <div class="form-group">
              <label class="form-label">Output Format</label>
              <select v-model="outputFormat">
                <option value="pdf">PDF (individual files in ZIP)</option>
                <option value="png">PNG (images in ZIP)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Quality</label>
              <div style="display: flex; gap: var(--space-2);">
                <button
                  v-for="opt in qualityOptions"
                  :key="opt.value"
                  @click="quality = opt.value"
                  class="btn-ghost quality-btn"
                  :class="{ 'quality-btn--active': quality === opt.value }"
                  style="flex: 1; padding: var(--space-3) var(--space-2); font-size: var(--text-xs); border-radius: var(--radius-lg);"
                >
                  <div style="font-weight: var(--weight-semibold);">{{ opt.label }}</div>
                  <div class="text-caption" style="color: var(--color-text-muted); margin-top: var(--space-1);">{{ opt.desc }}</div>
                </button>
              </div>
            </div>

            <button
              @click="generateBulk"
              :disabled="!selectedTemplateId || data.length === 0 || generating"
              class="btn-primary btn-lg"
              style="width: 100%; display: flex; align-items: center; justify-content: center; gap: var(--space-2);"
            >
              <BaseIcon v-if="!generating" name="generate" :size="18" />
              {{ generating ? `Generating... (${progress}/${data.length})` : 'Generate All' }}
            </button>

            <div v-if="generating" style="border-radius: var(--radius-xl); padding: var(--space-5); border: 1px solid var(--color-border); background: var(--color-surface-hover);">
              <div class="text-caption" style="color: var(--color-text-muted); margin-bottom: var(--space-3);">Progress</div>
              <div class="progress">
                <div
                  class="progress-bar"
                  :style="{ width: (progress / data.length * 100) + '%' }"
                ></div>
              </div>
              <div class="text-caption" style="text-align: right; margin-top: var(--space-2); font-family: var(--font-mono);">{{ progress }}/{{ data.length }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Papa from 'papaparse'
import JSZip from 'jszip'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

const route = useRoute()

const { data: templates } = await useFetch('/api/templates')
const { data: fonts } = await useFetch('/api/fonts')

// Load custom fonts dynamically
watch(fonts, (newFonts) => {
  if (newFonts && newFonts.length > 0) {
    newFonts.forEach(font => {
      const fontFace = new FontFace(
        font.fontFamily,
        `url(${font.filepath})`,
        {
          weight: font.fontWeight || '400',
          style: font.fontStyle || 'normal'
        }
      )
      fontFace.load().then((loadedFont) => {
        document.fonts.add(loadedFont)
      }).catch(err => {
        console.error(`Failed to load font ${font.fontFamily}:`, err)
      })
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
const dataKeys = computed(() => {
  if (data.value.length === 0) return []
  return Object.keys(data.value[0])
})

const generating = ref(false)
const progress = ref(0)

if (route.query.template) {
  selectedTemplateId.value = parseInt(route.query.template as string)
}

// Extract placeholders from selected template
const templatePlaceholders = computed(() => {
  if (!selectedTemplateId.value || !templates.value) return []
  
  const template = templates.value.find(t => t.id === selectedTemplateId.value)
  if (!template) return []
  
  try {
    const layout = JSON.parse(template.layout)
    const placeholders = new Set<string>()
    
    layout.elements.forEach((el: any) => {
      // extract from content/text
      const content = el.content || el.text || ''
      const matches = content.match(/\{(\w+)\}/g)
      if (matches) {
        matches.forEach((match: string) => {
          placeholders.add(match.replace(/[{}]/g, '').trim())
        })
      }
      // extract from field property
      if (el.field) {
        const fm = el.field.match(/\{?(\w+)\}?/)
        if (fm) placeholders.add(fm[1])
      }
    })
    
    return Array.from(placeholders).sort()
  } catch (e) {
    return []
  }
})

// Initialize singleData when template changes
watch([selectedTemplateId, templatePlaceholders], () => {
  const newData: Record<string, any> = {}
  templatePlaceholders.value.forEach(key => {
    // Set default values
    if (key === 'date') {
      newData[key] = new Date().toISOString().split('T')[0]
    } else {
      newData[key] = ''
    }
  })
  singleData.value = newData
}, { immediate: true })

const jsonPlaceholder = computed(() => {
  if (templatePlaceholders.value.length === 0) {
    return '[{"name": "John Doe", "date": "2026-06-27", "certificate_id": "CERT-001"}]'
  }
  const sample: Record<string, string> = {}
  for (const key of templatePlaceholders.value) {
    if (key.includes('date') || key.includes('Date')) {
      sample[key] = '2026-06-27'
    } else if (key.includes('name') || key.includes('Name')) {
      sample[key] = 'John Doe'
    } else {
      sample[key] = `your ${key.replace(/_/g, ' ')}`
    }
  }
  return JSON.stringify([sample])
})

const csvColumnsHint = computed(() =>
  templatePlaceholders.value.length > 0 ? templatePlaceholders.value.join(', ') : ''
)

const csvDownloadUrl = ref('')

watch(templatePlaceholders, () => {
  // Revoke previous blob URL
  if (csvDownloadUrl.value) URL.revokeObjectURL(csvDownloadUrl.value)

  if (templatePlaceholders.value.length === 0) {
    csvDownloadUrl.value = ''
    return
  }

  const header = templatePlaceholders.value.join(',')
  const sample: string[] = []
  for (const key of templatePlaceholders.value) {
    if (key.includes('date') || key.includes('Date')) {
      sample.push('2026-06-27')
    } else if (key.includes('name') || key.includes('Name')) {
      sample.push('John Doe')
    } else {
      sample.push(`your ${key.replace(/_/g, ' ')}`)
    }
  }
  const row = sample.join(',')

  const blob = new Blob([`${header}\n${row}\n`], { type: 'text/csv' })
  csvDownloadUrl.value = URL.createObjectURL(blob)
}, { immediate: true })

function onCsvUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      data.value = results.data as Record<string, any>[]
    },
    error: (error) => {
      alert('CSV parsing failed: ' + error.message)
    },
  })
}

function parseJson() {
  try {
    const parsed = JSON.parse(jsonInput.value)
    if (!Array.isArray(parsed)) {
      alert('JSON must be an array of objects')
      return
    }
    data.value = parsed
  } catch (e) {
    alert('Invalid JSON: ' + (e as Error).message)
  }
}

function useSingleData() {
  // Validate that at least one field is filled
  const hasData = Object.values(singleData.value).some(val => val !== '')
  if (!hasData) {
    alert('Please fill in at least one field')
    return
  }
  data.value = [{ ...singleData.value }]
}

function clearData() {
  data.value = []
  jsonInput.value = ''
}

async function generateBulk() {
  if (!selectedTemplateId.value || data.value.length === 0) return

  generating.value = true
  progress.value = 0

  try {
    const zip = new JSZip()

    const template = await $fetch(`/api/templates/${selectedTemplateId.value}`)
    const layout = JSON.parse(template.layout)

    for (let i = 0; i < data.value.length; i++) {
      const record = data.value[i]

      const blob = await renderCertificate(layout, record, outputFormat.value)

      const ext = outputFormat.value === 'pdf' ? 'pdf' : 'png'
      const filename = `certificate-${record.name || i + 1}-${record.certificate_id || Date.now()}.${ext}`

      zip.file(filename, blob)

      progress.value = i + 1

      await new Promise(resolve => setTimeout(resolve, 10))
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(zipBlob)
    link.download = `certificates-${Date.now()}.zip`
    link.click()

  } catch (e) {
    alert('Generation failed: ' + (e as Error).message)
  } finally {
    generating.value = false
  }
}

async function renderCertificate(layout: any, data: Record<string, any>, format: 'pdf' | 'png'): Promise<Blob> {
  const qualityPresets = {
    standard: { scale: 1, jpeg: 0.75 },
    high: { scale: 1.5, jpeg: 0.85 },
    maximum: { scale: 2, jpeg: 0.95 },
  }
  const preset = qualityPresets[quality.value]

  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.style.width = layout.width + 'px'
  container.style.height = layout.height + 'px'
  document.body.appendChild(container)

  if (layout.background) {
    const bgImg = document.createElement('img')
    bgImg.src = layout.background
    bgImg.style.width = '100%'
    bgImg.style.height = '100%'
    bgImg.style.objectFit = 'cover'
    bgImg.style.position = 'absolute'
    container.appendChild(bgImg)
  }

  for (const el of layout.elements) {
    const div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.left = el.x + 'px'
    div.style.top = el.y + 'px'
    div.style.width = el.width + 'px'
    div.style.height = el.height + 'px'
    div.style.overflow = 'hidden'

    if (el.type === 'text') {
      let content = el.content || ''
      for (const [key, value] of Object.entries(data)) {
        content = content.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value))
      }
      div.textContent = content
      div.style.fontFamily = el.fontFamily || 'Source Serif 4, serif'
      div.style.fontSize = (el.fontSize || 24) + 'px'
      div.style.color = el.color || '#000000'
      div.style.fontWeight = el.fontWeight || '400'
      div.style.fontStyle = el.fontStyle || 'normal'
      div.style.textDecoration = el.textDecoration || 'none'
      div.style.textAlign = el.textAlign || 'left'
    } else if (el.type === 'image' && el.src) {
      const img = document.createElement('img')
      img.src = el.src
      img.style.width = '100%'
      img.style.height = '100%'
      img.style.objectFit = 'contain'
      div.appendChild(img)
    }

    container.appendChild(div)
  }

  await new Promise(resolve => setTimeout(resolve, 100))

  const canvas = await html2canvas(container, {
    backgroundColor: '#ffffff',
    scale: preset.scale,
  })

  document.body.removeChild(container)

  if (format === 'png') {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', preset.jpeg)
    })
  } else {
    const pdf = new jsPDF({
      orientation: layout.width > layout.height ? 'landscape' : 'portrait',
      unit: 'pt',
      format: [layout.width, layout.height],
    })

    const imgData = canvas.toDataURL('image/jpeg', preset.jpeg)
    pdf.addImage(imgData, 'JPEG', 0, 0, layout.width, layout.height)

    return pdf.output('blob')
  }
}
</script>

<style scoped>
.quality-btn {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  transition: border-color var(--duration-fast) var(--ease-standard);
}

.quality-btn:hover {
  border-color: var(--color-text-muted);
}

.quality-btn--active {
  border-color: var(--color-primary);
  background: var(--color-primary-muted);
}
</style>