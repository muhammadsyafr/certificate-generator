<template>
  <div class="page">
    <div class="page-container">
      <header class="flex justify-between items-center page-header">
        <div>
          <NuxtLink to="/templates" class="back-link">← Back to Templates</NuxtLink>
          <h1 class="page-title">{{ isNew ? 'New Template' : 'Edit Template' }}</h1>
        </div>
        <button
          @click="saveTemplate"
          :disabled="saving || !templateName"
          class="btn-primary"
        >
          {{ saving ? 'Saving...' : 'Save Template' }}
        </button>
      </header>

      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 card">
          <div class="section-head mb-6">
            <h2 class="section-title">Canvas Preview</h2>
            <button
              @click="fullscreen = !fullscreen"
              class="btn-ghost btn-sm"
            >
              {{ fullscreen ? 'Exit Fullscreen' : 'Fullscreen' }}
            </button>
          </div>
          <div class="bg-white rounded-md min-h-[600px] overflow-auto border border-border">
            <div :style="canvasStyle" class="relative flex-shrink-0">
              <div v-if="layout.background" class="absolute inset-0">
                <img :src="layout.background" class="w-full h-full object-cover" />
              </div>

              <div
                v-for="(el, idx) in layout.elements"
                :key="idx"
                class="absolute cursor-move border border-dashed border-transparent hover:border-accent transition-colors group"
                :style="elementStyle(el)"
                @mousedown="startDrag(idx, $event)"
                @click="selectedElement = idx"
              >
                <div v-if="el.type === 'text'" :style="textStyle(el)">
                  {{ el.content }}
                </div>
                <img v-else-if="el.type === 'image'" :src="el.src" class="w-full h-full object-contain" />
                <template v-if="selectedElement === idx">
                  <div class="absolute -top-1.5 -left-1.5 w-3 h-3 bg-accent rounded-full cursor-nwse-resize" @mousedown.stop="startResize(idx, 'nw', $event)"></div>
                  <div class="absolute -top-1.5 -right-1.5 w-3 h-3 bg-accent rounded-full cursor-nesw-resize" @mousedown.stop="startResize(idx, 'ne', $event)"></div>
                  <div class="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-accent rounded-full cursor-nesw-resize" @mousedown.stop="startResize(idx, 'sw', $event)"></div>
                  <div class="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-accent rounded-full cursor-nwse-resize" @mousedown.stop="startResize(idx, 'se', $event)"></div>
                  <div class="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-accent rounded-full cursor-ew-resize" @mousedown.stop="startResize(idx, 'w', $event)"></div>
                  <div class="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-accent rounded-full cursor-ew-resize" @mousedown.stop="startResize(idx, 'e', $event)"></div>
                  <div class="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 bg-accent rounded-full cursor-ns-resize" @mousedown.stop="startResize(idx, 'n', $event)"></div>
                  <div class="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-accent rounded-full cursor-ns-resize" @mousedown.stop="startResize(idx, 's', $event)"></div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <Teleport to="body">
          <div
            v-if="fullscreen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            @click.self="fullscreen = false"
          >
            <button
              @click="fullscreen = false"
              class="absolute top-4 right-4 btn-ghost text-white hover:bg-white/10 text-body"
            >
              ✕ Close
            </button>
            <div class="overflow-auto w-full h-full flex items-center justify-center p-8">
              <div :style="fullscreenCanvasStyle" class="relative flex-shrink-0">
                <div v-if="layout.background" class="absolute inset-0">
                  <img :src="layout.background" class="w-full h-full object-cover" />
                </div>

                <div
                  v-for="(el, idx) in layout.elements"
                  :key="'fs-' + idx"
                  class="absolute cursor-move border border-dashed border-accent/40 group"
                  :style="elementStyle(el)"
                  @mousedown="startDrag(idx, $event)"
                  @click="selectedElement = idx"
                >
                  <div v-if="el.type === 'text'" :style="textStyle(el)">
                    {{ el.content }}
                  </div>
                  <img v-else-if="el.type === 'image'" :src="el.src" class="w-full h-full object-contain" />
                  <template v-if="selectedElement === idx">
                    <div class="absolute -top-1.5 -left-1.5 w-3 h-3 bg-accent rounded-full cursor-nwse-resize" @mousedown.stop="startResize(idx, 'nw', $event)"></div>
                    <div class="absolute -top-1.5 -right-1.5 w-3 h-3 bg-accent rounded-full cursor-nesw-resize" @mousedown.stop="startResize(idx, 'ne', $event)"></div>
                    <div class="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-accent rounded-full cursor-nesw-resize" @mousedown.stop="startResize(idx, 'sw', $event)"></div>
                    <div class="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-accent rounded-full cursor-nwse-resize" @mousedown.stop="startResize(idx, 'se', $event)"></div>
                    <div class="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-accent rounded-full cursor-ew-resize" @mousedown.stop="startResize(idx, 'w', $event)"></div>
                    <div class="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-accent rounded-full cursor-ew-resize" @mousedown.stop="startResize(idx, 'e', $event)"></div>
                    <div class="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 bg-accent rounded-full cursor-ns-resize" @mousedown.stop="startResize(idx, 'n', $event)"></div>
                    <div class="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-accent rounded-full cursor-ns-resize" @mousedown.stop="startResize(idx, 's', $event)"></div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </Teleport>

        <div class="card">
          <h2 class="section-title mb-6">Template Settings</h2>

          <div class="space-y-5">
            <div class="form-group">
              <label class="form-label">Template Name</label>
              <input v-model="templateName" type="text" placeholder="e.g. Completion Certificate" />
            </div>

            <div class="form-group">
              <label class="form-label">Canvas Size</label>
              <div class="form-row">
                <input v-model.number="layout.width" type="number" placeholder="Width" min="400" max="2400" />
                <input v-model.number="layout.height" type="number" placeholder="Height" min="400" max="2400" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Background Image</label>
              <select v-model="layout.background">
                <option value="">None</option>
                <option v-for="bg in combinedBackgrounds" :key="bg.id" :value="bg.filepath">
                  {{ bg.filename }}
                </option>
              </select>
            </div>

            <hr />

            <h3 class="text-body font-semibold">Add Elements</h3>

            <button @click="addTextElement" class="btn-primary w-full">
              + Add Text Element
            </button>

            <div class="form-group">
              <label class="form-label">Add Image</label>
              <select @change="addImageElement($event)">
                <option value="">Select logo...</option>
                <option v-for="logo in combinedLogos" :key="logo.id" :value="logo.filepath">
                  {{ logo.filename }}
                </option>
              </select>
            </div>

            <hr />

            <div v-if="selectedElement !== null" class="space-y-5">
              <div class="flex justify-between items-center">
                <h3 class="text-body font-semibold">Element Properties</h3>
                <button
                  @click="deleteElement"
                  class="btn-ghost btn-danger"
                >
                  Delete
                </button>
              </div>

              <div v-if="layout.elements[selectedElement]?.type === 'text'" class="form-group">
                <label class="form-label">Content</label>
                <textarea
                  v-model="layout.elements[selectedElement].content"
                  rows="3"
                  class="font-mono text-body-sm"
                  placeholder="Use {{name}}, {{date}}, {{certificate_id}}"
                ></textarea>
                <span class="text-caption">Placeholders: {{name}}, {{date}}, {{certificate_id}}</span>
              </div>

              <div v-if="layout.elements[selectedElement]?.type === 'text'" class="form-group">
                <label class="form-label">Font Size</label>
                <input v-model.number="layout.elements[selectedElement].fontSize" type="number" min="12" max="120" />
              </div>

              <div v-if="layout.elements[selectedElement]?.type === 'text'" class="form-group">
                <label class="form-label">Color</label>
                <input v-model="layout.elements[selectedElement].color" type="color" />
              </div>

              <div v-if="layout.elements[selectedElement]?.type === 'text'" class="form-group">
                <label class="form-label">Font Weight</label>
                <select v-model="layout.elements[selectedElement].fontWeight">
                  <option value="100">Thin (100)</option>
                  <option value="200">Extra Light (200)</option>
                  <option value="300">Light (300)</option>
                  <option value="400">Normal (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semi Bold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extra Bold (800)</option>
                  <option value="900">Black (900)</option>
                </select>
              </div>

              <div v-if="layout.elements[selectedElement]?.type === 'text'" class="form-group">
                <label class="form-label">Font Style</label>
                <select v-model="layout.elements[selectedElement].fontStyle">
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                </select>
              </div>

              <div v-if="layout.elements[selectedElement]?.type === 'text'" class="form-group">
                <label class="form-label">Text Decoration</label>
                <select v-model="layout.elements[selectedElement].textDecoration">
                  <option value="none">None</option>
                  <option value="underline">Underline</option>
                  <option value="line-through">Line Through</option>
                </select>
              </div>

              <div v-if="layout.elements[selectedElement]?.type === 'text'" class="form-group">
                <label class="form-label">Text Align</label>
                <div class="flex gap-2">
                  <button
                    @click="layout.elements[selectedElement].textAlign = 'left'"
                    :class="['flex-1 py-2 px-3 rounded-md text-body-sm font-medium transition-all duration-150', (layout.elements[selectedElement].textAlign || 'left') === 'left' ? 'bg-accent text-black' : 'bg-bg border border-border text-muted']"
                  >
                    Left
                  </button>
                  <button
                    @click="layout.elements[selectedElement].textAlign = 'center'"
                    :class="['flex-1 py-2 px-3 rounded-md text-body-sm font-medium transition-all duration-150', layout.elements[selectedElement].textAlign === 'center' ? 'bg-accent text-black' : 'bg-bg border border-border text-muted']"
                  >
                    Center
                  </button>
                  <button
                    @click="layout.elements[selectedElement].textAlign = 'right'"
                    :class="['flex-1 py-2 px-3 rounded-md text-body-sm font-medium transition-all duration-150', layout.elements[selectedElement].textAlign === 'right' ? 'bg-accent text-black' : 'bg-bg border border-border text-muted']"
                  >
                    Right
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Position & Size</label>
                <div class="form-row">
                  <input v-model.number="layout.elements[selectedElement].x" type="number" placeholder="X" />
                  <input v-model.number="layout.elements[selectedElement].y" type="number" placeholder="Y" />
                  <input v-model.number="layout.elements[selectedElement].width" type="number" placeholder="Width" />
                  <input v-model.number="layout.elements[selectedElement].height" type="number" placeholder="Height" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const isNew = computed(() => route.params.id === 'new')
const templateId = computed(() => isNew.value ? null : parseInt(route.params.id as string))

const templateName = ref('')
const saving = ref(false)
const selectedElement = ref<number | null>(null)
const fullscreen = ref(false)

interface LayoutElement {
  type: 'text' | 'image'
  x: number
  y: number
  width: number
  height: number
  content?: string
  fontSize?: number
  color?: string
  fontWeight?: string
  fontStyle?: string
  textDecoration?: string
  textAlign?: string
  src?: string
}

interface Layout {
  width: number
  height: number
  background: string
  elements: LayoutElement[]
}

const layout = reactive<Layout>({
  width: 1400,
  height: 990,
  background: '',
  elements: [],
})

const { data: assets } = await useFetch('/api/assets')
const combinedLogos = computed(() => assets.value?.filter(a => a.type === 'logo' || a.type === 'free-image') || [])
const combinedBackgrounds = computed(() => assets.value?.filter(a => a.type === 'background' || a.type === 'free-image') || [])

if (!isNew.value && templateId.value) {
  const { data: template } = await useFetch(`/api/templates/${templateId.value}`)
  if (template.value) {
    templateName.value = template.value.name
    const savedLayout = JSON.parse(template.value.layout)
    Object.assign(layout, savedLayout)
  }
}

const scale = computed(() => {
  if (fullscreen.value) {
    const pad = 96
    return Math.min((window.innerWidth - pad) / layout.width, (window.innerHeight - pad) / layout.height, 1)
  }
  return 0.8
})

const canvasStyle = computed(() => ({
  width: layout.width + 'px',
  height: layout.height + 'px',
  transform: `scale(${scale.value})`,
  transformOrigin: 'top left',
}))

const fullscreenCanvasStyle = computed(() => ({
  width: layout.width + 'px',
  height: layout.height + 'px',
  transform: `scale(${scale.value})`,
  transformOrigin: 'center center',
}))

function elementStyle(el: LayoutElement) {
  return {
    left: el.x + 'px',
    top: el.y + 'px',
    width: el.width + 'px',
    height: el.height + 'px',
  }
}

function textStyle(el: LayoutElement) {
  return {
    fontSize: (el.fontSize || 24) + 'px',
    color: el.color || '#000000',
    fontWeight: el.fontWeight || '400',
    fontStyle: el.fontStyle || 'normal',
    textDecoration: el.textDecoration || 'none',
    textAlign: el.textAlign || 'left',
  }
}

function addTextElement() {
  layout.elements.push({
    type: 'text',
    x: 100,
    y: 100,
    width: 300,
    height: 50,
    content: '{{name}}',
    fontSize: 32,
    color: '#000000',
    fontWeight: '700',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
  })
  selectedElement.value = layout.elements.length - 1
}

function addImageElement(event: Event) {
  const select = event.target as HTMLSelectElement
  const src = select.value
  if (!src) return

  layout.elements.push({
    type: 'image',
    x: 100,
    y: 100,
    width: 150,
    height: 150,
    src,
  })
  selectedElement.value = layout.elements.length - 1
  select.value = ''
}

function deleteElement() {
  if (selectedElement.value === null) return
  layout.elements.splice(selectedElement.value, 1)
  selectedElement.value = null
}

type ResizeDir = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

let dragState: { mode: 'move' | 'resize', idx: number; startX: number; startY: number; elX: number; elY: number; elW: number; elH: number; dir?: ResizeDir } | null = null

function startDrag(idx: number, event: MouseEvent) {
  event.preventDefault()
  selectedElement.value = idx

  const el = layout.elements[idx]
  dragState = {
    mode: 'move',
    idx,
    startX: event.clientX,
    startY: event.clientY,
    elX: el.x,
    elY: el.y,
    elW: el.width,
    elH: el.height,
  }

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function startResize(idx: number, dir: ResizeDir, event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  selectedElement.value = idx

  const el = layout.elements[idx]
  dragState = {
    mode: 'resize',
    idx,
    startX: event.clientX,
    startY: event.clientY,
    elX: el.x,
    elY: el.y,
    elW: el.width,
    elH: el.height,
    dir,
  }

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(event: MouseEvent) {
  if (!dragState) return

  const dx = (event.clientX - dragState.startX) / scale.value
  const dy = (event.clientY - dragState.startY) / scale.value

  if (dragState.mode === 'move') {
    layout.elements[dragState.idx].x = Math.round(dragState.elX + dx)
    layout.elements[dragState.idx].y = Math.round(dragState.elY + dy)
  } else if (dragState.mode === 'resize' && dragState.dir) {
    const el = layout.elements[dragState.idx]
    const dir = dragState.dir

    if (dir.includes('e')) el.width = Math.max(20, Math.round(dragState.elW + dx))
    if (dir.includes('w')) { el.width = Math.max(20, Math.round(dragState.elW - dx)); el.x = Math.round(dragState.elX + dx) }
    if (dir.includes('s')) el.height = Math.max(20, Math.round(dragState.elH + dy))
    if (dir.includes('n')) { el.height = Math.max(20, Math.round(dragState.elH - dy)); el.y = Math.round(dragState.elY + dy) }
  }
}

function stopDrag() {
  dragState = null
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

async function saveTemplate() {
  if (!templateName.value.trim()) {
    alert('Please enter a template name')
    return
  }

  saving.value = true
  try {
    const payload = {
      name: templateName.value,
      layout,
    }

    if (isNew.value) {
      await $fetch('/api/templates', { method: 'POST', body: payload })
    } else {
      await $fetch(`/api/templates/${templateId.value}`, { method: 'PUT', body: payload })
    }

    router.push('/templates')
  } catch (e) {
    alert('Failed to save template: ' + (e as Error).message)
  } finally {
    saving.value = false
  }
}
</script>