<template>
  <div class="page">
    <div class="page-container">
      <header class="page-header">
        <NuxtLink to="/" class="back-link">← Back</NuxtLink>
        <h1 class="page-title">Bulk Generate Certificates</h1>
        <p class="page-desc">Upload CSV or JSON data to generate multiple certificates at once</p>
      </header>

      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="card">
            <h2 class="section-title mb-5">Select Template</h2>
            <select v-model="selectedTemplateId">
              <option value="">Choose a template...</option>
              <option v-for="tpl in templates" :key="tpl.id" :value="tpl.id">
                {{ tpl.name }}
              </option>
            </select>
          </div>

          <div class="card">
            <h2 class="section-title mb-5">Upload Data</h2>

            <div class="tabs mb-5">
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
            </div>

            <div v-if="uploadMode === 'csv'">
              <div class="form-group">
                <label class="form-label">Upload CSV File</label>
                <input type="file" accept=".csv" @change="onCsvUpload" />
                <span class="text-caption">CSV should have columns: name, date, certificate_id</span>
              </div>
              <a href="/example.csv" download class="inline-block mt-2 text-body-sm text-accent hover:underline">
                Download example CSV
              </a>
            </div>

            <div v-else>
              <div class="form-group">
                <label class="form-label">Paste JSON Array</label>
                <textarea
                  v-model="jsonInput"
                  rows="8"
                  class="font-mono text-body-sm"
                  placeholder='[{"name": "John Doe", "date": "2026-06-27", "certificate_id": "CERT-001"}]'
                ></textarea>
              </div>
              <button @click="parseJson" class="btn-primary mt-3">
                Parse JSON
              </button>
            </div>
          </div>

          <div v-if="data.length > 0" class="card">
            <div class="section-head mb-5">
              <h2 class="section-title">Data Preview ({{ data.length }} records)</h2>
              <button @click="clearData" class="btn-ghost">Clear</button>
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
            <p v-if="data.length > 10" class="text-caption mt-3">
              Showing first 10 of {{ data.length }} records
            </p>
          </div>
        </div>

        <div class="card h-fit">
          <h2 class="section-title mb-6">Generate</h2>

          <div class="space-y-4">
            <div class="bg-bg rounded-md p-4 border border-border">
              <div class="text-caption mb-1">Template</div>
              <div class="text-body font-medium">
                {{ selectedTemplateId ? templates?.find(t => t.id === selectedTemplateId)?.name : 'Not selected' }}
              </div>
            </div>

            <div class="bg-bg rounded-md p-4 border border-border">
              <div class="text-caption mb-1">Records</div>
              <div class="text-body font-medium text-mono">{{ data.length }}</div>
            </div>

            <div class="form-group">
              <label class="form-label">Output Format</label>
              <select v-model="outputFormat">
                <option value="pdf">PDF (individual files in ZIP)</option>
                <option value="png">PNG (images in ZIP)</option>
              </select>
            </div>

            <button
              @click="generateBulk"
              :disabled="!selectedTemplateId || data.length === 0 || generating"
              class="btn-primary btn-lg w-full"
            >
              {{ generating ? `Generating... (${progress}/${data.length})` : 'Generate All' }}
            </button>

            <div v-if="generating" class="bg-bg rounded-md p-4 border border-border">
              <div class="text-caption mb-2">Progress</div>
              <div class="progress">
                <div
                  class="progress-bar"
                  :style="{ width: (progress / data.length * 100) + '%' }"
                ></div>
              </div>
              <div class="text-caption text-right mt-1 text-mono">{{ progress }}/{{ data.length }}</div>
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

const selectedTemplateId = ref<number | null>(null)
const uploadMode = ref<'csv' | 'json'>('csv')
const jsonInput = ref('')
const data = ref<Record<string, any>[]>([])
const outputFormat = ref<'pdf' | 'png'>('pdf')
const generating = ref(false)
const progress = ref(0)

if (route.query.template) {
  selectedTemplateId.value = parseInt(route.query.template as string)
}

const dataKeys = computed(() => {
  if (data.value.length === 0) return []
  return Object.keys(data.value[0])
})

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

    if (el.type === 'text') {
      let content = el.content || ''
      for (const [key, value] of Object.entries(data)) {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
      }
      div.textContent = content
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
    scale: 2,
  })

  document.body.removeChild(container)

  if (format === 'png') {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png')
    })
  } else {
    const pdf = new jsPDF({
      orientation: layout.width > layout.height ? 'landscape' : 'portrait',
      unit: 'pt',
      format: [layout.width, layout.height],
    })

    const imgData = canvas.toDataURL('image/png')
    pdf.addImage(imgData, 'PNG', 0, 0, layout.width, layout.height)

    return pdf.output('blob')
  }
}
</script>