<template>
  <div id="ed-root" @click.self="contextMenu.visible = false">
    <!-- TOP BAR -->
    <header class="ed-header">
      <a href="/" class="ed-brand">
        <span class="brand-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="9.5" r="5.5" stroke="#F5521E" stroke-width="2"/>
            <path d="M9 14l-2 7 5-3 5 3-2-7" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </span>
      </a>
      <div class="ed-divider-v"></div>
      <NuxtLink to="/templates" class="ed-back-btn" @mouseenter="softIn" @mouseleave="softOut" title="Back to templates">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </NuxtLink>
      <div class="ed-title-area">
        <input
          v-model="templateName"
          class="ed-title-input"
          placeholder="Untitled Template"
          @focus="editingTitle = true"
          @blur="editingTitle = false"
        />
        <div class="ed-save-status">
          <span class="save-dot" :class="saveDotClass"></span>
          {{ saveStatusText }}
        </div>
      </div>
      <div class="ed-header-right">
        <div class="ed-undo-group">
          <button class="ed-icon-btn" :class="{ 'ed-icon-btn--disabled': !canUndo }" :disabled="!canUndo" @click="undo" @mouseenter="softIn" @mouseleave="softOut" title="Undo Ctrl+Z">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M9 7L4 12l5 5M4 12h11a5 5 0 0 1 0 10h-2" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="ed-icon-btn" :class="{ 'ed-icon-btn--disabled': !canRedo }" :disabled="!canRedo" @click="redo" @mouseenter="softIn" @mouseleave="softOut" title="Redo Ctrl+Shift+Z">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M15 7l5 5-5 5M20 12H9a5 5 0 0 0 0 10h2" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <button class="ed-btn-outline" @mouseenter="softIn" @mouseleave="whiteOut" @click="previewing = !previewing" title="Toggle preview mode">
          {{ previewing ? 'Edit' : 'Preview' }}
        </button>
        <button
          :disabled="!canSave"
          class="ed-btn-outline ed-btn-save"
          @mouseenter="softIn"
          @mouseleave="whiteOut"
          @click="saveTemplate"
          style="margin-right:-4px"
          title="Save template Ctrl+S"
        >
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
        <NuxtLink
          class="ed-btn-accent"
          :to="isNew ? '/generate' : `/generate?template=${templateId}`"
          @mouseenter="ctaIn"
          @mouseleave="ctaOut"
          title="Generate PDFs from this template"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M13 3L5 13h6l-1 8 8-10h-6l1-8z" stroke="#fff" stroke-width="1.9" stroke-linejoin="round"/>
          </svg>
          Generate
        </NuxtLink>
        <div class="ed-plan-pill" :class="{ 'ed-plan-pill--pro': user?.plan === 'pro' }">
          <span v-if="user?.plan === 'pro'" class="ed-plan-pro">Pro plan</span>
          <span v-else>Free plan</span>
          <a v-if="user?.plan !== 'pro'" href="/#pricing" class="plan-upgrade">Upgrade</a>
        </div>
        <SharedUserMenu />
      </div>
    </header>

    <!-- BODY -->
    <div class="ed-body">
      <!-- LEFT PANEL -->
      <aside v-if="!previewing" class="ed-left-panel">
        <div class="ed-section-label">Add to canvas</div>
        <div class="ed-add-grid">
          <button
            class="ed-add-card"
            @mouseenter="cardIn" @mouseleave="cardOut"
            @click="addTextElement()"
            title="Add text block"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 6h14M9 6v13M5 6v-1M19 6v-1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            <span>Text</span>
          </button>
          <button
            class="ed-add-card"
            :class="{ active: showImagePanel }"
            @mouseenter="cardIn" @mouseleave="cardOut"
            @click="showImagePanel = !showImagePanel; showIconPanel = false"
            title="Add image from library"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/>
              <path d="M3 16l5-4 4 3 4-4 5 4" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            </svg>
            <span>Image</span>
          </button>
          <button
            class="ed-add-card"
            @mouseenter="cardIn" @mouseleave="cardOut"
            @click="addElement('sig')"
            title="Add signature"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 18c4 0 5-12 8-12s2 8 4 8 2-3 5-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            <span>Signature</span>
          </button>
          <button
            class="ed-add-card"
            @mouseenter="cardIn" @mouseleave="cardOut"
            @click="addElement('shape')"
            title="Add divider bar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="2.5" stroke="currentColor" stroke-width="1.8"/>
            </svg>
            <span>Shape</span>
          </button>
        </div>

        <!-- Image sub-panel -->
        <div v-if="showImagePanel" class="ed-sub-panel">
          <div class="ed-sub-panel-title">Pick an image to place</div>
          <div v-if="allImages.length === 0" class="ed-sub-empty">No images yet. Upload in Asset Library.</div>
          <div v-else class="ed-asset-grid">
            <button
              v-for="img in allImages"
              :key="img.id"
              class="ed-asset-thumb"
              @click="addImageEl(img.filepath); showImagePanel = false"
            >
              <img :src="img.filepath" />
            </button>
          </div>
        </div>

        <div class="ed-section-label" style="margin-top:24px">Background</div>
        <div class="ed-bg-picker">
          <button
            v-for="bg in backgroundThumbs"
            :key="bg.id"
            class="ed-bg-thumb"
            :class="{ active: layout.background === bg.filepath }"
            @click="layout.background = bg.filepath"
            :style="{ backgroundImage: `url(${bg.filepath})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
          >
            <span v-if="layout.background === bg.filepath" class="bg-check">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l4.5 4.5L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </button>
          <button v-if="backgroundThumbs.length === 0" class="ed-bg-thumb active" @click="layout.background = ''">
            <span class="bg-check">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l4.5 4.5L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </button>
          <button class="ed-bg-thumb add" @click="layout.background = ''; selectedBorderId = null">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="ed-section-label" style="margin-top:16px">Preset Borders</div>
        <div class="ed-bg-picker ed-bg-picker--scroll">
          <button
            v-for="border in presetBorders"
            :key="border.id"
            class="ed-bg-thumb ed-bg-thumb--border ed-bg-thumb--fixed"
            :class="{ active: selectedBorderId === border.id }"
            @click="applyPresetBorder(border)"
            :style="{ background: border.bg, backgroundSize: 'cover' }"
          >
            <div v-html="border.preview" class="ed-border-preview"></div>
            <span v-if="selectedBorderId === border.id" class="bg-check">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l4.5 4.5L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </button>
        </div>
        <div class="ed-bg-color-row">
          <input
            type="color"
            :value="borderColor"
            @input="borderColor = ($event.target as HTMLInputElement).value; selectedBorderId ? applyPresetBorder(presetBorders.find(b => b.id === selectedBorderId)!) : null"
            class="ed-bg-color-pick"
          />
          <span class="ed-bg-color-label">Border color</span>
        </div>
        <div class="ed-bg-color-row">
          <input
            type="color"
            :value="layout.backgroundColor"
            @input="layout.backgroundColor = ($event.target as HTMLInputElement).value"
            class="ed-bg-color-pick"
          />
          <span class="ed-bg-color-label">Canvas color</span>
        </div>
        <div class="ed-bg-hint">
          <NuxtLink to="/templates/assets">Upload more</NuxtLink> backgrounds via Asset Library.
        </div>

        <div class="ed-section-label" style="margin-top:24px">Layers</div>
        <div class="ed-layers">
          <div
            v-for="el in layers"
            :key="el.id"
            class="ed-layer-row"
            :class="{ active: el.active, hidden: el.hidden }"
            @click="selectElement(el.id)"
          >
            <span class="layer-dot" :style="{ background: el.dotColor }"></span>
            <span class="layer-name">{{ el.label }}</span>
            <span class="layer-eye" @click.stop="toggleHidden(el.id)">
              <svg v-if="el.hidden" width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.4 5.2A9.6 9.6 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3 3.6M6.2 6.2A16 16 0 0 0 2 12s3.5 7 10 7a9.5 9.5 0 0 0 3.3-.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
              </svg>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="1.7"/>
                <circle cx="12" cy="12" r="2.4" stroke="currentColor" stroke-width="1.7"/>
              </svg>
            </span>
          </div>
        </div>
      </aside>

      <!-- CANVAS -->
      <main class="ed-canvas" @click.self="deselect">
        <div class="canvas-wrapper">
          <div class="canvas-label">{{ canvasSizeLabel }}</div>
          <div
            ref="stageEl"
            class="canvas-stage"
            :style="{ transform: `scale(${zoom})`, width: layout.width + 'px', height: layout.height + 'px' }"
          >
            <div class="canvas-paper" :style="{ background: layout.backgroundColor }">
              <img v-if="layout.background" :src="layout.background" class="canvas-bg-img" />
            </div>
            <div v-if="showGrid" class="canvas-grid"></div>

            <!-- center guides -->
            <div v-if="showCenterGuides && !previewing" class="canvas-guide canvas-guide-h" :style="{ top: layout.height / 2 + 'px' }"></div>
            <div v-if="showCenterGuides && !previewing" class="canvas-guide canvas-guide-v" :style="{ left: layout.width / 2 + 'px' }"></div>

            <!-- elements -->
            <div
              v-for="el in visibleElements"
              :key="el.id"
              class="canvas-el"
              :class="{ selected: selectedId === el.id }"
              :style="el.style"
              @pointerdown="startDrag(el.id, $event)"
            >
              <div v-if="el.kind === 'text' || el.kind === 'field'" class="el-text" :style="el.textStyle">
                {{ resolveContent(el.id) }}
              </div>
              <div v-else-if="el.kind === 'bar'" class="el-bar" :style="{ background: el.color, borderRadius: '2px', width: '100%', height: '100%' }"></div>
              <div v-else-if="el.kind === 'seal'" class="el-seal" :style="{ color: el.color }">
                <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="9" r="6" stroke="currentColor" stroke-width="1.5"/>
                  <circle cx="32" cy="9" r="2" fill="currentColor"/>
                  <path d="M26 18l-4 15 10-5 10 5-4-15" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                  <circle cx="32" cy="42" r="16" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M32 32v14M25 44h14M28 38l4-4 4 4M29 48l3-3 3 3" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div v-else-if="el.kind === 'image'" class="el-image">
                <img :src="el.src" style="width:100%;height:100%;object-fit:contain;" />
              </div>
              <div v-else-if="el.kind === 'shape'" class="el-shape" :style="{ background: el.color, borderRadius: '2px' }"></div>
            </div>

            <!-- selection overlay -->
            <div v-if="!previewing && selectedEl" class="sel-overlay" :style="selBoxStyle" @pointerdown.stop>
              <span class="sel-handle sel-nw" @pointerdown.stop="startResize(selectedEl.id, 'nw', $event)"></span>
              <span class="sel-handle sel-n"  @pointerdown.stop="startResize(selectedEl.id, 'n',  $event)"></span>
              <span class="sel-handle sel-ne" @pointerdown.stop="startResize(selectedEl.id, 'ne', $event)"></span>
              <span class="sel-handle sel-w"  @pointerdown.stop="startResize(selectedEl.id, 'w',  $event)"></span>
              <span class="sel-handle sel-e"  @pointerdown.stop="startResize(selectedEl.id, 'e',  $event)"></span>
              <span class="sel-handle sel-sw" @pointerdown.stop="startResize(selectedEl.id, 'sw', $event)"></span>
              <span class="sel-handle sel-s"  @pointerdown.stop="startResize(selectedEl.id, 's',  $event)"></span>
              <span class="sel-handle sel-se" @pointerdown.stop="startResize(selectedEl.id, 'se', $event)"></span>
              <div class="sel-toolbar">
                <button @click="duplicateElement" class="sel-tool-btn" title="Duplicate element">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.8"/>
                    <path d="M4 16V5a1 1 0 0 1 1-1h11" stroke="currentColor" stroke-width="1.8"/>
                  </svg>
                </button>
                <button @click="deleteElement" class="sel-tool-btn" title="Delete element">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- floating bottom bar -->
        <div class="ed-float-bar">
          <button class="float-btn" @mouseenter="softIn" @mouseleave="softOut" @click="zoomOut" title="Zoom out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <span class="float-label">{{ Math.round(zoom * 100) }}%</span>
          <button class="float-btn" @mouseenter="softIn" @mouseleave="softOut" @click="zoomIn" title="Zoom in">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <div class="float-divider"></div>
          <button class="float-btn" :class="{ active: showGrid }" @mouseenter="softIn" @mouseleave="softOut" @click="showGrid = !showGrid" title="Toggle grid">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 3v18M21 3v18M3 9h18M3 15h18M9 3v18M15 3v18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          </button>
          <div class="float-divider"></div>
          <button class="float-btn" @mouseenter="softIn" @mouseleave="softOut" @click="prevRec" title="Previous record">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <span class="float-label wide">Record {{ recordIndex + 1 }} of {{ records.length }}</span>
          <button class="float-btn" @mouseenter="softIn" @mouseleave="softOut" @click="nextRec" title="Next record">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </main>

      <!-- RIGHT PANEL -->
      <aside v-if="!previewing" class="ed-right-panel">
        <div class="ed-right-tabs">
          <button :class="['ed-tab', { active: rightTab === 'design' }]" @click="rightTab = 'design'">Design</button>
          <button :class="['ed-tab', { active: rightTab === 'data' }]" @click="rightTab = 'data'">Data</button>
        </div>

        <!-- DESIGN TAB -->
        <div v-if="rightTab === 'design'" class="ed-tab-content">
          <template v-if="selectedEl">
            <div class="ed-prop-header">
              <span class="prop-icon">
                <svg v-if="selectedEl.kind === 'seal'" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="10" r="5" stroke="#F5521E" stroke-width="1.9"/>
                </svg>
                <svg v-else-if="selectedEl.kind === 'image'" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="#F5521E" stroke-width="1.6"/>
                  <path d="M3 16l5-4 4 3 4-4 5 4" stroke="#F5521E" stroke-width="1.6" stroke-linejoin="round"/>
                </svg>
                <div v-else-if="selectedEl.kind === 'bar'" class="prop-bar-icon"></div>
                <span v-else class="prop-text-icon">T</span>
              </span>
              <div>
                <div class="prop-name">{{ selectedEl.label || selectedEl.id }}</div>
                <div class="prop-kind">{{ kindLabel(selectedEl) }}</div>
              </div>
            </div>

            <!-- Position & Size (all elements) -->
            <div class="ed-prop-section">
              <div class="prop-label">Position & Size</div>
              <div class="ed-dim-grid">
                <div class="ed-dim-field">
                  <label class="ed-dim-label">X</label>
                  <input type="number" :value="selectedEl.x" @input="patchSel({ x: +($event.target as HTMLInputElement).value })" class="ed-dim-input" />
                </div>
                <div class="ed-dim-field">
                  <label class="ed-dim-label">Y</label>
                  <input type="number" :value="selectedEl.y" @input="patchSel({ y: +($event.target as HTMLInputElement).value })" class="ed-dim-input" />
                </div>
                <div class="ed-dim-field">
                  <label class="ed-dim-label">W</label>
                  <input type="number" :value="selectedEl.w" @input="onDimInput('w', +($event.target as HTMLInputElement).value)" class="ed-dim-input" />
                </div>
                <div class="ed-dim-field">
                  <div style="display:flex;align-items:center;gap:4px">
                    <label class="ed-dim-label">H</label>
                    <button v-if="selectedEl.kind === 'image'" class="ed-lock-btn" :class="{ 'ed-lock-btn--locked': isAspectLocked(selectedEl.id) }" @click="toggleAspectLock(selectedEl.id)" title="Lock aspect ratio">
                      <svg v-if="isAspectLocked(selectedEl.id)" width="10" height="10" viewBox="0 0 24 24" fill="none"><rect x="6" y="10" width="12" height="10" rx="2" stroke="currentColor" stroke-width="2"/><rect x="10" y="6" width="4" height="6" rx="1" stroke="currentColor" stroke-width="2"/></svg>
                      <svg v-else width="10" height="10" viewBox="0 0 24 24" fill="none"><rect x="6" y="10" width="12" height="10" rx="2" stroke="currentColor" stroke-width="2"/><rect x="10" y="6" width="4" height="6" rx="1" stroke="currentColor" stroke-width="2"/><path d="M15 2h6v6M9 22H3v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    </button>
                  </div>
                  <input type="number" :value="selectedEl.h" @input="onDimInput('h', +($event.target as HTMLInputElement).value)" class="ed-dim-input" />
                </div>
              </div>
            </div>

            <!-- Content -->
            <div v-if="isTextKind(selectedEl.kind)" class="ed-prop-section">
              <div class="prop-label">Content</div>
              <textarea
                :value="selectedEl.text"
                @input="patchSel({ text: ($event.target as HTMLTextAreaElement).value })"
                rows="2"
                class="ed-textarea"
              ></textarea>
              <div class="prop-hint">Use <code v-pre>{{col_name}}</code> for data from CSV.</div>
            </div>

            <!-- Data binding -->
            <div class="ed-prop-section">
              <div class="prop-label">Data binding</div>
              <div class="ed-field-bound">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M4 7h16M4 12h16M4 17h10" stroke="#F5521E" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <select
                  :value="selectedEl.field || ''"
                  @change="patchFieldBinding(($event.target as HTMLSelectElement).value)"
                  class="ed-field-select"
                >
                  <option value="">None (plain text)</option>
                  <option v-for="col in csvColumns" :key="col" :value="`{${col}}`">{{ col }}</option>
                </select>
              </div>
            </div>

            <!-- Typography -->
            <div v-if="isTextKind(selectedEl.kind)" class="ed-prop-section">
              <div class="prop-label">Typography</div>
              <select
                :value="selectedEl.font"
                @change="patchSel({ font: ($event.target as HTMLSelectElement).value })"
                class="ed-select"
              >
                <option v-for="f in availableFonts" :key="f" :value="f">{{ f }}</option>
              </select>
              <button class="ed-locked-btn" @click="toastMsg('🔒 Upgrade to Pro to unlock')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.8"/>
                </svg>
                Upload custom font <span class="pro-tag">PRO</span>
              </button>

              <div class="ed-prop-row">
                <div class="ed-prop-col">
                  <div class="prop-label-sm">Size</div>
                  <div class="ed-range-row">
                    <input type="range" min="10" max="72" :value="selectedEl.size" @input="patchSel({ size: +($event.target as HTMLInputElement).value })" />
                    <span class="range-val">{{ selectedEl.size }}</span>
                  </div>
                </div>
              </div>

              <div class="ed-prop-row">
                <div class="ed-prop-col">
                  <div class="prop-label-sm">Weight</div>
                  <select
                    :value="selectedEl.weight"
                    @change="patchSel({ weight: ($event.target as HTMLSelectElement).value })"
                    class="ed-select sm"
                  >
                    <option value="400">Regular</option>
                    <option value="500">Medium</option>
                    <option value="600">Semibold</option>
                    <option value="700">Bold</option>
                  </select>
                </div>
                <div>
                  <div class="prop-label-sm">Align</div>
                  <div class="ed-align-group">
                    <button :class="['align-btn', { active: selectedEl.align === 'left' }]" @click="patchSel({ align: 'left' })">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h11M4 18h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    </button>
                    <button :class="['align-btn', { active: selectedEl.align === 'center' }]" @click="patchSel({ align: 'center' })">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M7 12h10M5 18h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    </button>
                    <button :class="['align-btn', { active: selectedEl.align === 'right' }]" @click="patchSel({ align: 'right' })">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M9 12h11M6 18h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Color -->
            <div class="ed-prop-section">
              <div class="prop-label">Color</div>
              <div class="ed-swatches">
                <button
                  v-for="c in palette"
                  :key="c"
                  class="swatch"
                  :class="{ active: selectedEl.color === c }"
                  :style="{ background: c }"
                  @click="patchSel({ color: c })"
                ></button>
                <input
                  type="color"
                  :value="selectedEl.color"
                  @input="patchSel({ color: ($event.target as HTMLInputElement).value })"
                  class="swatch-picker"
                />
              </div>
            </div>

            <!-- Opacity -->
            <div class="ed-prop-section">
              <div class="prop-label">Opacity</div>
              <div class="ed-range-row">
                <input type="range" min="20" max="100" :value="selectedEl.opacity" @input="patchSel({ opacity: +($event.target as HTMLInputElement).value })" />
                <span class="range-val">{{ selectedEl.opacity }}%</span>
              </div>
            </div>
          </template>

          <div v-else class="ed-empty-state">
            <div class="ed-prop-section" style="margin-bottom:24px">
              <div class="prop-label">Canvas Size</div>
              <div class="ed-size-presets">
                <button
                  v-for="s in sizePresets"
                  :key="s.key"
                  class="ed-size-btn"
                  :class="{ active: canvasSize === s.key }"
                  @click="setCanvasSize(s.key, s.w, s.h)"
                >{{ s.label }}</button>
              </div>
              <div class="ed-size-custom" :class="{ visible: canvasSize === 'custom' }">
                <input v-model.number="customW" type="number" class="ed-size-input" @change="applyCustomSize" /> ×
                <input v-model.number="customH" type="number" class="ed-size-input" @change="applyCustomSize" /> px
              </div>
            </div>
            <div class="empty-icon" style="margin-top:20px">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 3l14 9-6 1.5L11 20 5 3z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="empty-title">Nothing selected</div>
            <div class="empty-text">Click any element on the canvas to edit its style, or add one from the left.</div>
          </div>
        </div>

        <!-- DATA TAB -->
        <div v-if="rightTab === 'data'" class="ed-tab-content">
          <div class="ed-data-header">
            <div>
              <div class="data-title">{{ csvFile || 'Sample data' }}</div>
              <div class="data-meta">{{ records.length }} records · {{ csvColumns.length }} columns</div>
            </div>
            <label class="ed-btn-sm-outline ed-upload-btn">
              <input
                type="file"
                accept=".csv"
                class="ed-file-hidden"
                @change="handleCsvUpload"
              />
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M12 16V4m0 0l-4 4m4-4l4 4M5 20h14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Replace
            </label>
          </div>

          <div class="prop-label" style="margin-top:16px">Column mapping</div>
          <div class="ed-mappings">
            <div v-for="m in csvColumns" :key="m" class="ed-map-row">
              <span class="map-col">{{ m }}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="#6E665E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="map-field">auto-mapped</span>
            </div>
          </div>

          <div class="ed-data-rec-header">
            <span class="prop-label">Records</span>
            <span class="data-tap-hint">tap to preview</span>
          </div>
          <div class="ed-records">
            <div
              v-for="(r, i) in recordRows"
              :key="i"
              class="ed-record-row"
              :class="{ active: r.active }"
              @click="recordIndex = i"
            >
              <span class="rec-num">{{ r.num }}</span>
              <div class="rec-info">
                <div class="rec-name">{{ r.name }}</div>
                <div class="rec-course">{{ r.course }}</div>
              </div>
              <span v-if="r.active" class="rec-dot"></span>
            </div>
          </div>

          <button
            :disabled="!canSave"
            class="ed-btn-accent full"
            @mouseenter="ctaIn"
            @mouseleave="ctaOut"
            @click="saveTemplate"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 19h14M12 4v14M8 11l4-4 4 4" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ saving ? 'Saving...' : 'Save Template' }}
          </button>
          <div v-if="user?.plan !== 'pro'" class="data-watermark-note">Free plan exports include a small watermark.</div>
        </div>
      </aside>
    </div>

    <!-- Toast -->
    <BaseToast :visible="toastCtrl.visible.value">
      {{ toastCtrl.message.value }}
    </BaseToast>

    <!-- Tour Overlay -->
    <ClientOnly>
      <TourOverlay />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import TourOverlay from '~/components/TourOverlay.vue';

const route = useRoute();
const router = useRouter();
const { user } = useAuth();
const isNew = computed(() => route.params.id === 'new');
const templateId = computed(() => (isNew.value ? null : route.params.id as string));

useHead({
  bodyAttrs: { style: 'margin:0;overflow:hidden;' },
});

const { softIn, softOut, whiteOut, ctaIn, ctaOut, cardIn, cardOut } = useHoverIntents()
const toastCtrl = useToast()

// Tour setup
const tour = useTour();
const editorTourSteps = [
  {
    target: '.ed-add-grid',
    title: 'Add elements to your certificate',
    description: 'Start by adding text, images, or shapes. Click "Text" to add your first element.',
    placement: 'right' as const,
    action: 'add-element'
  },
  {
    target: '.ed-canvas',
    title: 'Design your certificate',
    description: 'Click and drag elements on the canvas to position them. Select any element to customize its properties on the right.',
    placement: 'top' as const
  },
  {
    target: '.ed-title-input',
    title: 'Name your template',
    description: 'Give your template a meaningful name so you can find it easily later.',
    placement: 'bottom' as const,
    action: 'name-template'
  },
  {
    target: '.ed-btn-save',
    title: 'Save your template',
    description: 'Click "Save" to save your template. Once saved, you can generate certificates from it.',
    placement: 'bottom' as const
  }
];

// ── State ──
const templateName = ref('');
const saving = ref(false);
const selectedId = ref<string | null>(null);
const rightTab = ref<'design' | 'data'>('design');
const recordIndex = ref(0);
const zoom = ref(1);
const showImagePanel = ref(false);
const showGrid = ref(false);
const previewing = ref(false);
const csvFile = ref('');
const csvColumns = ref<string[]>(['full_name', 'course', 'date']);
const editingTitle = ref(false);
const hiddenIds = ref<Record<string, boolean>>({});
const loaded = ref(false);
const justCreated = ref(false);

// Auto-save
const { debounce } = useRateLimit();
const { sanitizeFileName, validateTemplateName } = useFormValidation();
const saveStatus = ref<'saved' | 'saving' | 'unsaved'>('saved');
const lastSavedAt = ref<Date | null>(null);

// ── Assets & fonts ──
const assets = ref<any[]>([]);
const fonts = ref<any[]>([]);

const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBaseUrl || 'http://localhost:4000';

async function loadAssets() {
  try {
    const { get } = useApi();
    const rawAssets = await get('/api/assets');
    const rawFonts = await get('/api/fonts');
    
    // Prepend base URL to filepath
    assets.value = rawAssets.map((a: any) => ({
      ...a,
      filepath: a.filepath ? `${apiBaseUrl}/uploads/${a.filepath}` : null
    }));
    
    fonts.value = rawFonts.map((f: any) => ({
      ...f,
      filepath: f.filepath ? `${apiBaseUrl}/uploads/${f.filepath}` : null
    }));
  } catch (err) {
    console.error('Failed to load assets:', err);
  }
}

onMounted(() => {
  loadAssets();
});

const backgrounds = computed(() => assets.value?.filter((a: any) => a.type === 'background') || []);
const allImages = computed(() => assets.value?.filter((a: any) => a.type === 'logo' || a.type === 'free-image') || []);

const customFonts = computed(() => {
  if (!fonts.value) return []
  return [...new Set(fonts.value.map((f: any) => f.fontFamily))].sort() as string[]
});
const availableFonts = computed(() => ['General Sans', 'Playfair Display', 'Allura', 'Inter', ...customFonts.value]);

const backgroundThumbs = computed(() => {
  // first one is always the blank/color-only option
  const all = assets.value?.filter((a: any) => a.type === 'background' || a.type === 'free-image') || [];
  return all;
});

// ── Colors ──
const palette = ['#14110E', '#6E665E', '#F5521E', '#2F6BFF', '#1F8A5B'];

// ── Element model ──
interface EdElement {
  id: string;
  kind: 'text' | 'field' | 'seal' | 'bar' | 'image' | 'shape';
  label: string;
  x: number; y: number; w: number; h: number;
  text?: string;
  field?: string;
  font?: string;
  size?: number;
  weight?: string;
  color?: string;
  align?: 'left' | 'center' | 'right';
  letter?: number;
  italic?: boolean;
  opacity?: number;
  src?: string;
}

interface Layout {
  width: number;
  height: number;
  background: string;
  backgroundColor: string;
  elements: any[];
}

const layout = reactive<Layout>({
  width: 842,
  height: 595,
  background: '',
  backgroundColor: '#ffffff',
  elements: [],
});

const sizePresets = [
  { key: 'a4-landscape', label: 'A4 Landscape', w: 842, h: 595 },
  { key: 'a4-portrait', label: 'A4 Portrait', w: 595, h: 842 },
  { key: 'letter-landscape', label: 'Letter Landscape', w: 792, h: 612 },
  { key: 'letter-portrait', label: 'Letter Portrait', w: 612, h: 792 },
  { key: 'custom', label: 'Custom', w: 0, h: 0 },
];
const canvasSize = ref('a4-landscape');
const customW = ref(842);
const customH = ref(595);

const selectedBorderId = ref<string | null>(null);
const borderColor = ref('#14110E');

type BorderPreset = {
  id: string;
  bg: string;
  preview: string;
  svg: (w: number, h: number, c: string) => string;
};

const presetBorders: BorderPreset[] = [
  {
    id: 'none', bg: '#fff',
    preview: '<svg viewBox="0 0 40 40" fill="none"><rect x="0" y="0" width="40" height="40" fill="#f5f5f5"/><line x1="6" y1="20" x2="34" y2="20" stroke="#ccc" stroke-width="1.2" stroke-dasharray="2 2"/></svg>',
    svg: (_w: number, _h: number, _c: string) => '',
  },
  {
    id: 'simple', bg: '#FFFDF9',
    preview: '<svg viewBox="0 0 40 40" fill="none"><rect x="0" y="0" width="40" height="40" fill="#FFFDF9"/><rect x="4" y="4" width="32" height="32" rx="2" stroke="#14110E" stroke-width="1.5"/></svg>',
    svg: (w: number, h: number, c: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect x="12" y="12" width="${w-24}" height="${h-24}" rx="4" fill="none" stroke="${c}" stroke-width="2"/></svg>`,
  },
  {
    id: 'double', bg: '#FFFDF9',
    preview: '<svg viewBox="0 0 40 40" fill="none"><rect x="0" y="0" width="40" height="40" fill="#FFFDF9"/><rect x="3" y="3" width="34" height="34" rx="1" stroke="#14110E" stroke-width="1"/><rect x="6" y="6" width="28" height="28" rx="1" stroke="#14110E" stroke-width="0.8"/></svg>',
    svg: (w: number, h: number, c: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect x="10" y="10" width="${w-20}" height="${h-20}" rx="4" fill="none" stroke="${c}" stroke-width="2"/><rect x="18" y="18" width="${w-36}" height="${h-36}" rx="2" fill="none" stroke="${c}" stroke-width="1"/></svg>`,
  },
  {
    id: 'ornate', bg: '#FFFDF9',
    preview: '<svg viewBox="0 0 40 40" fill="none"><rect x="0" y="0" width="40" height="40" fill="#FFFDF9"/><rect x="3" y="3" width="34" height="34" rx="2" stroke="#14110E" stroke-width="1"/><circle cx="6" cy="6" r="1.5" fill="#14110E"/><circle cx="34" cy="6" r="1.5" fill="#14110E"/><circle cx="6" cy="34" r="1.5" fill="#14110E"/><circle cx="34" cy="34" r="1.5" fill="#14110E"/></svg>',
    svg: (w: number, h: number, c: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect x="12" y="12" width="${w-24}" height="${h-24}" rx="6" fill="none" stroke="${c}" stroke-width="1.8"/><circle cx="24" cy="24" r="5" fill="${c}"/><circle cx="${w-24}" cy="24" r="5" fill="${c}"/><circle cx="24" cy="${h-24}" r="5" fill="${c}"/><circle cx="${w-24}" cy="${h-24}" r="5" fill="${c}"/></svg>`,
  },
  {
    id: 'minimal', bg: '#FFFDF9',
    preview: '<svg viewBox="0 0 40 40" fill="none"><rect x="0" y="0" width="40" height="40" fill="#FFFDF9"/><line x1="4" y1="4" x2="12" y2="4" stroke="#14110E" stroke-width="1.5"/><line x1="4" y1="4" x2="4" y2="12" stroke="#14110E" stroke-width="1.5"/><line x1="28" y1="4" x2="36" y2="4" stroke="#14110E" stroke-width="1.5"/><line x1="36" y1="4" x2="36" y2="12" stroke="#14110E" stroke-width="1.5"/><line x1="4" y1="28" x2="4" y2="36" stroke="#14110E" stroke-width="1.5"/><line x1="4" y1="36" x2="12" y2="36" stroke="#14110E" stroke-width="1.5"/><line x1="28" y1="36" x2="36" y2="36" stroke="#14110E" stroke-width="1.5"/><line x1="36" y1="28" x2="36" y2="36" stroke="#14110E" stroke-width="1.5"/></svg>',
    svg: (w: number, h: number, c: string) => {
      const l = 16, s = 40;
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><line x1="${l}" y1="${l}" x2="${s}" y2="${l}" stroke="${c}" stroke-width="2"/><line x1="${l}" y1="${l}" x2="${l}" y2="${s}" stroke="${c}" stroke-width="2"/><line x1="${w-l}" y1="${l}" x2="${w-s}" y2="${l}" stroke="${c}" stroke-width="2"/><line x1="${w-l}" y1="${l}" x2="${w-l}" y2="${s}" stroke="${c}" stroke-width="2"/><line x1="${l}" y1="${h-l}" x2="${l}" y2="${h-s}" stroke="${c}" stroke-width="2"/><line x1="${l}" y1="${h-l}" x2="${s}" y2="${h-l}" stroke="${c}" stroke-width="2"/><line x1="${w-l}" y1="${h-l}" x2="${w-s}" y2="${h-l}" stroke="${c}" stroke-width="2"/><line x1="${w-l}" y1="${h-l}" x2="${w-l}" y2="${h-s}" stroke="${c}" stroke-width="2"/></svg>`;
    },
  },
  {
    id: 'framed', bg: '#FFFDF9',
    preview: '<svg viewBox="0 0 40 40" fill="none"><rect x="0" y="0" width="40" height="40" fill="#FFFDF9"/><rect x="2" y="2" width="36" height="36" rx="1" stroke="#14110E" stroke-width="2.5"/><rect x="6" y="6" width="28" height="28" rx="0.5" stroke="#14110E" stroke-width="0.5"/></svg>',
    svg: (w: number, h: number, c: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect x="8" y="8" width="${w-16}" height="${h-16}" rx="3" fill="none" stroke="${c}" stroke-width="3"/><rect x="16" y="16" width="${w-32}" height="${h-32}" fill="none" stroke="${c}" stroke-width="0.8" stroke-dasharray="6 4"/></svg>`,
  },
  {
    id: 'thick', bg: '#FFFDF9',
    preview: '<svg viewBox="0 0 40 40" fill="none"><rect x="0" y="0" width="40" height="40" fill="#FFFDF9"/><rect x="5" y="5" width="30" height="30" rx="2" stroke="#14110E" stroke-width="3"/></svg>',
    svg: (w: number, h: number, c: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect x="10" y="10" width="${w-20}" height="${h-20}" rx="5" fill="none" stroke="${c}" stroke-width="4"/></svg>`,
  },
  {
    id: 'scalloped', bg: '#FFFDF9',
    preview: '<svg viewBox="0 0 40 40" fill="none"><rect x="0" y="0" width="40" height="40" fill="#FFFDF9"/><rect x="3" y="3" width="34" height="34" rx="2" stroke="#14110E" stroke-width="1"/><circle cx="8" cy="8" r="1.2" fill="#14110E"/><circle cx="20" cy="8" r="1.2" fill="#14110E"/><circle cx="32" cy="8" r="1.2" fill="#14110E"/><circle cx="32" cy="20" r="1.2" fill="#14110E"/><circle cx="32" cy="32" r="1.2" fill="#14110E"/><circle cx="20" cy="32" r="1.2" fill="#14110E"/><circle cx="8" cy="32" r="1.2" fill="#14110E"/><circle cx="8" cy="20" r="1.2" fill="#14110E"/></svg>',
    svg: (w: number, h: number, c: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect x="12" y="12" width="${w-24}" height="${h-24}" rx="8" fill="none" stroke="${c}" stroke-width="1.5"/><circle cx="32" cy="32" r="4" fill="${c}"/><circle cx="${w-32}" cy="32" r="4" fill="${c}"/><circle cx="32" cy="${h-32}" r="4" fill="${c}"/><circle cx="${w-32}" cy="${h-32}" r="4" fill="${c}"/><circle cx="${Math.round(w/2)}" cy="32" r="4" fill="${c}"/><circle cx="32" cy="${Math.round(h/2)}" r="4" fill="${c}"/><circle cx="${w-32}" cy="${Math.round(h/2)}" r="4" fill="${c}"/><circle cx="${Math.round(w/2)}" cy="${h-32}" r="4" fill="${c}"/></svg>`,
  },
  {
    id: 'geometric', bg: '#FFFDF9',
    preview: '<svg viewBox="0 0 40 40" fill="none"><rect x="0" y="0" width="40" height="40" fill="#FFFDF9"/><rect x="4" y="4" width="32" height="32" rx="1" stroke="#14110E" stroke-width="1"/><polygon points="20,10 22,18 30,20 22,22 20,30 18,22 10,20 18,18" fill="#14110E"/></svg>',
    svg: (w: number, h: number, c: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect x="12" y="12" width="${w-24}" height="${h-24}" fill="none" stroke="${c}" stroke-width="1.5"/><line x1="20" y1="20" x2="50" y2="20" stroke="${c}" stroke-width="1.5"/><line x1="20" y1="20" x2="20" y2="50" stroke="${c}" stroke-width="1.5"/><line x1="${w-20}" y1="20" x2="${w-50}" y2="20" stroke="${c}" stroke-width="1.5"/><line x1="${w-20}" y1="20" x2="${w-20}" y2="50" stroke="${c}" stroke-width="1.5"/><line x1="20" y1="${h-20}" x2="50" y2="${h-20}" stroke="${c}" stroke-width="1.5"/><line x1="20" y1="${h-20}" x2="20" y2="${h-50}" stroke="${c}" stroke-width="1.5"/><line x1="${w-20}" y1="${h-20}" x2="${w-50}" y2="${h-20}" stroke="${c}" stroke-width="1.5"/><line x1="${w-20}" y1="${h-20}" x2="${w-20}" y2="${h-50}" stroke="${c}" stroke-width="1.5"/></svg>`,
  },
  {
    id: 'vintage', bg: '#FFFDF9',
    preview: '<svg viewBox="0 0 40 40" fill="none"><rect x="0" y="0" width="40" height="40" fill="#FFFDF9"/><rect x="4" y="4" width="32" height="32" rx="2" stroke="#14110E" stroke-width="0.8"/><rect x="7" y="7" width="26" height="26" rx="1" stroke="#14110E" stroke-width="0.5"/></svg>',
    svg: (w: number, h: number, c: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect x="8" y="8" width="${w-16}" height="${h-16}" rx="6" fill="none" stroke="${c}" stroke-width="1.2"/><rect x="16" y="16" width="${w-32}" height="${h-32}" rx="4" fill="none" stroke="${c}" stroke-width="0.6"/></svg>`,
  },
];

function applyPresetBorder(border: typeof presetBorders[0]) {
  if (border.id === 'none') {
    layout.background = '';
    selectedBorderId.value = null;
    return;
  }
  const svg = border.svg(layout.width, layout.height, borderColor.value);
  layout.background = 'data:image/svg+xml,' + encodeURIComponent(svg);
  selectedBorderId.value = border.id;
}

function setCanvasSize(key: string, w: number, h: number) {
  canvasSize.value = key;
  if (key !== 'custom') {
    layout.width = w;
    layout.height = h;
  } else {
    customW.value = layout.width;
    customH.value = layout.height;
  }
}

function applyCustomSize() {
  if (customW.value >= 200 && customH.value >= 200) {
    layout.width = customW.value;
    layout.height = customH.value;
  }
}

function syncCanvasSize() {
  const preset = sizePresets.find(s =>
    s.key !== 'custom' && s.w === layout.width && s.h === layout.height
  );
  if (preset) {
    canvasSize.value = preset.key;
  } else {
    canvasSize.value = 'custom';
    customW.value = layout.width;
    customH.value = layout.height;
  }
}

const canvasSizeLabel = computed(() => {
  const preset = sizePresets.find(s => s.key === canvasSize.value);
  if (preset && preset.key !== 'custom') return `${preset.label} · ${layout.width} × ${layout.height} px`;
  return `${layout.width} × ${layout.height} px`;
});

// Save status computed
const saveDotClass = computed(() => {
  if (saveStatus.value === 'saving') return 'save-dot--saving';
  if (saveStatus.value === 'unsaved') return 'save-dot--unsaved';
  return 'save-dot--saved';
});

const saveStatusText = computed(() => {
  if (editingTitle.value) return 'Editing...';
  if (saveStatus.value === 'saving') return 'Saving...';
  if (saveStatus.value === 'unsaved') return 'Unsaved changes';
  if (lastSavedAt.value) {
    const now = new Date();
    const diff = now.getTime() - lastSavedAt.value.getTime();
    if (diff < 5000) return 'Saved just now';
    if (diff < 60000) return 'Saved';
    return 'All changes saved';
  }
  return 'All changes saved';
});

const canSave = computed(() => {
  return saveStatus.value === 'unsaved' && !saving.value;
});

const defaultElements: EdElement[] = [
  { id: 'seal', kind: 'seal', label: 'Seal', x: 378, y: 66, w: 64, h: 64, color: '#F5521E', opacity: 100 },
  { id: 'title', kind: 'text', label: 'Title', text: 'CERTIFICATE OF ACHIEVEMENT', x: 150, y: 150, w: 520, h: 30, font: 'General Sans', size: 17, weight: '600', color: '#6E665E', align: 'center', letter: 5, opacity: 100 },
  { id: 'pre', kind: 'text', label: 'Subtitle', text: 'This is proudly presented to', x: 210, y: 196, w: 400, h: 24, font: 'Playfair Display', size: 15, weight: '500', color: '#6E665E', align: 'center', letter: 0, italic: true, opacity: 100 },
  { id: 'name', kind: 'field', field: '{full_name}', text: '{full_name}', label: 'Name (field)', x: 110, y: 224, w: 600, h: 60, font: 'Playfair Display', size: 46, weight: '600', color: '#14110E', align: 'center', letter: 0, opacity: 100 },
  { id: 'rule', kind: 'bar', label: 'Divider', x: 365, y: 304, w: 90, h: 4, color: '#F5521E', opacity: 100 },
  { id: 'body', kind: 'text', text: '{course}', label: 'Course line', x: 160, y: 324, w: 500, h: 44, font: 'General Sans', size: 14, weight: '400', color: '#6E665E', align: 'center', letter: 0, opacity: 100 },
  { id: 'sig', kind: 'text', text: 'A. Rivera', label: 'Signature', x: 200, y: 432, w: 170, h: 50, font: 'Allura', size: 30, weight: '400', color: '#14110E', align: 'center', letter: 0, opacity: 100 },
  { id: 'date', kind: 'field', field: '{date}', text: '{date}', label: 'Date (field)', x: 460, y: 440, w: 170, h: 40, font: 'General Sans', size: 14, weight: '500', color: '#14110E', align: 'center', letter: 0, opacity: 100 },
];

const elements = ref<EdElement[]>(JSON.parse(JSON.stringify(defaultElements)));

const records = ref([
  { full_name: 'Olivia Hartwell', course: 'for completing the Advanced Product Design program', date: 'June 12, 2026' },
  { full_name: 'Marcus Lee', course: 'for completing the Advanced Product Design program', date: 'June 12, 2026' },
  { full_name: 'Priya Nair', course: 'for completing the Advanced Product Design program', date: 'June 12, 2026' },
  { full_name: 'Daniel Okoro', course: 'for completing the Advanced Product Design program', date: 'June 12, 2026' },
  { full_name: 'Sofia Marchetti', course: 'for completing the Advanced Product Design program', date: 'June 12, 2026' },
  { full_name: 'Yuki Tanaka', course: 'for completing the Advanced Product Design program', date: 'June 12, 2026' },
]);

// ── Backend element ↔ EdElement conversion ──
function oldElToEd(el: any, id?: string): EdElement {
  const kind = el.kind || (el.type === 'image' ? 'image' : el.field ? 'field' : 'text');
  const ed: EdElement = {
    id: id || el.id || 'el' + nextId++,
    kind,
    label: el.label || (el.content || el.text || kind).slice(0, 20),
    x: el.x || 100,
    y: el.y || 100,
    w: el.w || el.width || 200,
    h: el.h || el.height || 40,
    text: el.text || el.content,
    field: el.field,
    font: el.font || el.fontFamily?.replace(/'/g, '') || 'General Sans',
    size: el.size || el.fontSize || 16,
    weight: el.weight || el.fontWeight || '400',
    color: el.color || '#14110E',
    align: el.align || el.textAlign || 'center',
    letter: el.letter || 0,
    italic: el.italic || el.fontStyle === 'italic' || false,
    opacity: el.opacity != null ? el.opacity : 100,
    src: el.src,
  };
  return ed;
}

function edElToOld(el: EdElement): any {
  const fieldName = el.field ? el.field.replace(/[{}]/g, '') : '';
  const content = el.text || (fieldName ? `{${fieldName}}` : '');
  return {
    id: el.id,
    kind: el.kind,
    type: el.kind === 'image' ? 'image' : 'text',
    label: el.label,
    x: el.x, y: el.y,
    width: el.w, height: el.h,
    text: el.text, content,
    field: el.field,
    font: el.font, fontFamily: el.font ? `'${el.font}', serif` : '',
    size: el.size, fontSize: el.size,
    weight: el.weight, fontWeight: el.weight,
    color: el.color,
    align: el.align, textAlign: el.align,
    letter: el.letter,
    italic: el.italic, fontStyle: el.italic ? 'italic' : 'normal',
    opacity: el.opacity,
    src: el.src,
    iconId: el.iconId,
  };
}

watch(fonts, (newFonts) => {
  if (!newFonts || newFonts.length === 0) return;
  newFonts.forEach((font: any) => {
    const ff = new FontFace(font.fontFamily, `url(${font.filepath})`, {
      weight: font.fontWeight || '400',
      style: font.fontStyle || 'normal',
    });
    ff.load().then(f => document.fonts.add(f)).catch(console.error);
  });
}, { immediate: true });

// ── Computed ──
const selectedEl = computed(() => elements.value.find(e => e.id === selectedId.value) || null);

const visibleElements = computed(() => {
  return elements.value
    .filter(el => !hiddenIds.value[el.id])
    .map(el => {
      const base: any = {
        left: el.x + 'px',
        top: el.y + 'px',
        width: el.w + 'px',
        height: el.h + 'px',
        opacity: (el.opacity || 100) / 100,
        cursor: 'move',
        userSelect: 'none',
        touchAction: 'none',
        overflow: 'hidden',
      };
      const textStyle: any = {};
      if (isTextKind(el.kind)) {
        textStyle.fontFamily = `'${el.font}', serif`;
        textStyle.fontSize = (el.size || 16) + 'px';
        textStyle.fontWeight = el.weight || '400';
        textStyle.color = el.color;
        textStyle.textAlign = el.align || 'center';
        textStyle.letterSpacing = (el.letter || 0) + 'px';
        textStyle.lineHeight = '1.25';
        textStyle.fontStyle = el.italic ? 'italic' : 'normal';
        textStyle.display = 'flex';
        textStyle.alignItems = 'center';
        textStyle.justifyContent = el.align === 'left' ? 'flex-start' : el.align === 'right' ? 'flex-end' : 'center';
        textStyle.width = '100%';
        textStyle.height = '100%';
      }
      return {
        id: el.id,
        kind: el.kind,
        color: el.color,
        src: el.src,
        iconId: el.iconId,
        style: base,
        textStyle,
      };
    });
});

const layers = computed(() =>
  elements.value.map(el => ({
    id: el.id,
    label: el.label || el.id,
    active: el.id === selectedId.value,
    hidden: !!hiddenIds.value[el.id],
    dotColor: el.kind === 'bar' ? '#F5521E' : el.color || '#14110E',
  }))
);

const selBoxStyle = computed(() => {
  const el = selectedEl.value;
  if (!el) return {};
  return {
    left: (el.x - 6 + dragDelta.x) + 'px',
    top: (el.y - 6 + dragDelta.y) + 'px',
    width: (el.w + 12) + 'px',
    height: (el.h + 12) + 'px',
  };
});

const recordRows = computed(() =>
  records.value.map((r, i) => ({
    num: String(i + 1).padStart(2, '0'),
    name: r.full_name,
    course: 'Advanced Product Design',
    active: i === recordIndex.value,
  }))
);

const mappings = [
  { col: 'full_name', field: 'Recipient name' },
  { col: 'course', field: 'Body line' },
  { col: 'date', field: 'Date' },
];

// ── Helpers ──
function isTextKind(kind: string) {
  return kind === 'text' || kind === 'field';
}
function isFieldKind(kind: string) {
  return kind === 'field';
}
function kindLabel(el: EdElement) {
  if (el.kind === 'seal') return 'Seal';
  if (el.kind === 'bar') return 'Divider';
  if (isFieldKind(el.kind)) return 'Data field';
  if (el.kind === 'image') return 'Image';
  return 'Text';
}

function resolveContent(elId: string) {
  const el = elements.value.find(e => e.id === elId);
  if (!el) return '';
  const rec = records.value[recordIndex.value] || {};
  const text = el.text || el.content || '';

  // resolve {col} placeholders with actual data
  return text.replace(/\{(\w+)\}/g, (_, key) => rec[key] ?? `{${key}}`);
}

let nextId = 100;

// clear drag when elements change (DOM refs become stale)
watch(elements, () => {
  if (dragState?.el) {
    dragState.el.style.transform = '';
    dragState.el.style.transition = '';
    dragState.el.style.willChange = '';
  }
  dragState = null;
});

function addElement(kind: string) {
  pushUndo();
  const id = 'el' + nextId++;
  const base = { x: 300, y: 250, w: 200, h: 40, color: '#14110E', opacity: 100 };
  let el: EdElement;
  if (kind === 'text') el = { id, kind: 'text', text: 'New text', label: 'Text', ...base, font: 'General Sans', size: 18, weight: '400', align: 'center' };
  else if (kind === 'sig') el = { id, kind: 'text', text: 'Signature', label: 'Signature', ...base, w: 170, h: 50, font: 'Allura', size: 30, weight: '400', color: '#14110E', align: 'center', letter: 0, opacity: 100 };
  else if (kind === 'shape') el = { id, kind: 'bar', label: 'Shape', ...base, h: 4, color: '#14110E', opacity: 100 };
  else if (kind === 'seal') el = { id, kind: 'seal', label: 'Seal', ...base, x: 370, y: 60, w: 80, h: 80, color: '#F5521E', opacity: 100 };
  else el = { id, kind: 'text' as any, label: 'Element', ...base, font: 'General Sans', size: 16, weight: '400', align: 'center' };
  elements.value = [...elements.value, el];
}

function selectElement(id: string) {
  selectedId.value = id;
  rightTab.value = 'design';
}

function deselect() {
  selectedId.value = null;
}

function toggleHidden(id: string) {
  hiddenIds.value = { ...hiddenIds.value, [id]: !hiddenIds.value[id] };
}

function patchSel(patch: Partial<EdElement>) {
  const currentId = selectedId.value;
  if (!currentId) return;
  const idx = elements.value.findIndex(e => e.id === currentId);
  if (idx === -1) return;
  pushUndo();
  const updated = { ...elements.value[idx], ...patch };
  const newArr = [...elements.value];
  newArr[idx] = updated;
  elements.value = newArr;
  selectedId.value = currentId;
}

function patchFieldBinding(value: string) {
  if (!selectedId.value) return;
  const el = elements.value.find(e => e.id === selectedId.value);
  if (!el) return;
  const patch: Partial<EdElement> = {
    field: value || undefined,
    kind: value ? 'field' : 'text',
  };
  // always set text to placeholder when binding
  if (value) patch.text = value;
  patchSel(patch);
}

function duplicateElement() {
  const el = selectedEl.value;
  if (!el) return;
  pushUndo();
  const id = 'el' + nextId++;
  const dup: EdElement = { ...JSON.parse(JSON.stringify(el)), id, x: el.x + 20, y: el.y + 20 };
  elements.value = [...elements.value, dup];
  selectedId.value = id;
}

function deleteElement() {
  const id = selectedId.value;
  if (!id) return;
  pushUndo();
  elements.value = elements.value.filter(e => e.id !== id);
  selectedId.value = null;
}

// ── Drag ──
let dragState: { id: string; sx: number; sy: number; ox: number; oy: number; el: HTMLElement | null } | null = null;
let resizeState: { id: string; dir: string; sx: number; sy: number; ox: number; oy: number; ow: number; oh: number } | null = null;
const dragDelta = reactive({ x: 0, y: 0 });
const showCenterGuides = ref(false);
const shiftHeld = ref(false);
const aspectLocks = reactive<Record<string, boolean>>({});
function isAspectLocked(id: string): boolean { return aspectLocks[id] ?? false; }
function toggleAspectLock(id: string) { aspectLocks[id] = !isAspectLocked(id); }
function onDimInput(dim: 'w' | 'h', val: number) {
  const el = selectedEl.value;
  if (!el) return;
  if (el.kind === 'image' && isAspectLocked(el.id)) {
    const ratio = el.w / el.h;
    if (dim === 'w') patchSel({ w: val, h: Math.round(val / ratio) });
    else patchSel({ h: val, w: Math.round(val * ratio) });
  } else {
    patchSel({ [dim]: val });
  }
}
const undoStack = ref<EdElement[][]>([]);
const redoStack = ref<EdElement[][]>([]);
const MAX_HISTORY = 50;

function pushUndo() {
  undoStack.value = [...undoStack.value.slice(-(MAX_HISTORY - 1)), JSON.parse(JSON.stringify(elements.value))];
  redoStack.value = [];
}

function undo() {
  if (!undoStack.value.length) return;
  redoStack.value = [...redoStack.value, JSON.parse(JSON.stringify(elements.value))];
  const prev = undoStack.value.pop()!;
  elements.value = prev;
}

function redo() {
  if (!redoStack.value.length) return;
  undoStack.value = [...undoStack.value, JSON.parse(JSON.stringify(elements.value))];
  const next = redoStack.value.pop()!;
  elements.value = next;
}

const canUndo = computed(() => undoStack.value.length > 0);
const canRedo = computed(() => redoStack.value.length > 0);

function startDrag(id: string, e: PointerEvent) {
  e.stopPropagation();
  e.preventDefault();
  const el = elements.value.find(x => x.id === id);
  if (!el) return;
  selectedId.value = id;
  rightTab.value = 'design';
  const domEl = (e.currentTarget as HTMLElement).closest('.canvas-el') as HTMLElement;
  if (domEl) {
    domEl.style.transition = 'none';
    domEl.style.willChange = 'transform';
    domEl.setPointerCapture(e.pointerId);
  }
  dragState = { id, sx: e.clientX, sy: e.clientY, ox: el.x, oy: el.y, el: domEl };
}

function startResize(id: string, dir: string, e: PointerEvent) {
  e.stopPropagation();
  e.preventDefault();
  const el = elements.value.find(x => x.id === id);
  if (!el) return;
  const domEl = (e.currentTarget as HTMLElement).closest('.canvas-el') as HTMLElement;
  if (domEl) {
    domEl.style.transition = 'none';
    domEl.setPointerCapture(e.pointerId);
  }
  resizeState = { id, dir, sx: e.clientX, sy: e.clientY, ox: el.x, oy: el.y, ow: el.w, oh: el.h };
  document.body.style.cursor = getComputedStyle(e.currentTarget as HTMLElement).cursor;
}

function onPointerMove(e: PointerEvent) {
  const z = zoom.value;
  if (dragState?.el) {
    const dx = (e.clientX - dragState.sx) / z;
    const dy = (e.clientY - dragState.sy) / z;
    const cx = dragState.ox + dx;
    const cy = dragState.oy + dy;
    const el = elements.value.find(x => x.id === dragState!.id);
    const snapThreshold = 5;
    let snapX = cx, snapY = cy;
    let showGuides = false;
    if (el) {
      const ecx = snapX + el.w / 2;
      const ecy = snapY + el.h / 2;
      const ccx = layout.width / 2;
      const ccy = layout.height / 2;
      if (Math.abs(ecx - ccx) < snapThreshold) { snapX = ccx - el.w / 2; showGuides = true; }
      if (Math.abs(ecy - ccy) < snapThreshold) { snapY = ccy - el.h / 2; showGuides = true; }
    }
    const sdx = snapX - dragState.ox;
    const sdy = snapY - dragState.oy;
    dragState.el.style.transform = `translate(${sdx}px, ${sdy}px)`;
    dragDelta.x = Math.round(sdx);
    dragDelta.y = Math.round(sdy);
    showCenterGuides.value = showGuides;
    return;
  }
  if (resizeState) {
    const dx = (e.clientX - resizeState.sx) / z;
    const dy = (e.clientY - resizeState.sy) / z;
    const { dir, ox, oy, ow, oh } = resizeState;
    const ratio = ow / oh;
    let nx = ox, ny = oy, nw = ow, nh = oh;
    const el = elements.value.find(x => x.id === resizeState!.id);
    const useLock = (shiftHeld.value || el?.kind === 'image') && dir.length === 2;
    if (useLock) {
      // corner resize with proportional lock
      const adx = Math.abs(dx); const ady = Math.abs(dy);
      if (adx > ady || dir === 'nw' || dir === 'se') {
        nw = Math.max(20, ow + dx * (dir.includes('e') ? 1 : -1));
        nh = nw / ratio;
      } else {
        nh = Math.max(20, oh + dy * (dir.includes('s') ? 1 : -1));
        nw = nh * ratio;
      }
      if (dir.includes('w')) nx = ox + ow - nw;
      if (dir.includes('n')) ny = oy + oh - nh;
    } else {
      if (dir.includes('e')) nw = Math.max(20, ow + dx);
      if (dir.includes('w')) { nw = Math.max(20, ow - dx); nx = ox + ow - nw; }
      if (dir.includes('s')) nh = Math.max(20, oh + dy);
      if (dir.includes('n')) { nh = Math.max(20, oh - dy); ny = oy + oh - nh; }
    }
    const idx = elements.value.findIndex(el => el.id === resizeState!.id);
    if (idx !== -1) {
      const updated = { ...elements.value[idx], x: Math.round(nx), y: Math.round(ny), w: Math.round(nw), h: Math.round(nh) };
      elements.value = [...elements.value.slice(0, idx), updated, ...elements.value.slice(idx + 1)];
    }
  }
}

function onPointerUp(e: PointerEvent) {
  document.body.style.cursor = '';
  dragDelta.x = 0; dragDelta.y = 0;
  showCenterGuides.value = false;
  if (dragState) {
    const z = zoom.value;
    const dx = (e.clientX - dragState.sx) / z;
    const dy = (e.clientY - dragState.sy) / z;
    let cx = dragState.ox + dx;
    let cy = dragState.oy + dy;
    const el = elements.value.find(x => x.id === dragState!.id);
    if (el) {
      const ecx = cx + el.w / 2;
      const ecy = cy + el.h / 2;
      const ccx = layout.width / 2;
      const ccy = layout.height / 2;
      const snapThreshold = 5;
      if (Math.abs(ecx - ccx) < snapThreshold) cx = ccx - el.w / 2;
      if (Math.abs(ecy - ccy) < snapThreshold) cy = ccy - el.h / 2;
    }
    const nx = Math.round(cx);
    const ny = Math.round(cy);
    pushUndo();
    const idx = elements.value.findIndex(el => el.id === dragState!.id);
    if (idx !== -1) {
      const updated = { ...elements.value[idx], x: nx, y: ny };
      elements.value = [...elements.value.slice(0, idx), updated, ...elements.value.slice(idx + 1)];
    }
    if (dragState.el) {
      dragState.el.style.transform = '';
      dragState.el.style.transition = '';
      dragState.el.style.willChange = '';
    }
    dragState = null;
  }
  if (resizeState) {
    resizeState = null;
  }
}

// ── Zoom, records ──
function zoomIn() { zoom.value = Math.min(1.5, +(zoom.value + 0.1).toFixed(2)); }
function zoomOut() { zoom.value = Math.max(0.5, +(zoom.value - 0.1).toFixed(2)); }
function prevRec() { recordIndex.value = (recordIndex.value - 1 + records.value.length) % records.value.length; }
function nextRec() { recordIndex.value = (recordIndex.value + 1) % records.value.length; }

function toastMsg(m: string) { toastCtrl.show(m); }

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Shift') { shiftHeld.value = true; return; }
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault();
    if (e.shiftKey) redo();
    else undo();
  }
}
function onKeyUp(e: KeyboardEvent) { if (e.key === 'Shift') shiftHeld.value = false; }

function addTextElement() {
  // Advance tour if on add-element step
  if (tour.isActive.value && tour.currentStepData.value?.action === 'add-element') {
    tour.completeActionStep();
  }
  addElement('text');
}

function addImageEl(src: string) {
  const id = 'el' + nextId++;
  const el: EdElement = { id, kind: 'image', label: 'Image', x: 260, y: 160, w: 300, h: 200, src, color: '#14110E', opacity: 100 };
  elements.value = [...elements.value, el];
  selectedId.value = null;
  showImagePanel.value = false;
}

// ── Template loading ──
onMounted(async () => {
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  // Load custom fonts
  if (fonts.value && fonts.value.length > 0) {
    fonts.value.forEach((font: any) => {
      const ff = new FontFace(font.fontFamily, `url(${font.filepath})`, {
        weight: font.fontWeight || '400',
        style: font.fontStyle || 'normal',
      });
      ff.load().then(f => document.fonts.add(f)).catch(console.error);
    });
  }

  if (!isNew.value && templateId.value) {
    try {
      const { get } = useApi();
      const data: any = await get(`/api/templates/${templateId.value}`);
      if (data) {
        templateName.value = data.name || '';
        const saved: Layout = data.layout ? (typeof data.layout === 'string' ? JSON.parse(data.layout) : data.layout) : null;
        if (saved) {
          layout.width = saved.width || 842;
          layout.height = saved.height || 595;
          syncCanvasSize();
          layout.backgroundColor = saved.backgroundColor || '#ffffff';
          // Prepend base URL to background if it's a relative path
          const bg = saved.background || '';
          layout.background = bg && !bg.startsWith('http') ? `${apiBaseUrl}/uploads/${bg}` : bg;
          if (saved.elements && Array.isArray(saved.elements)) {
            elements.value = saved.elements.map((e: any, i: number) => {
              const el = oldElToEd(e, e.id || 'loaded_' + i);
              // Prepend base URL to image src if it's a relative path
              if (el.src && !el.src.startsWith('http')) {
                el.src = `${apiBaseUrl}/uploads/${el.src}`;
              }
              return el;
            });
            nextId = elements.value.reduce((max, el) => {
              const num = parseInt(String(el.id).replace(/^\D+/g, ''), 10);
              return isNaN(num) ? max : Math.max(max, num);
            }, nextId) + 1;
          }
        }
      }
    } catch (e) {
      console.error('Failed to load template:', e);
    }
  }
  loaded.value = true;
  
  // Start editor tour for new users on new template
  if (isNew.value && !tour.hasSeenTour()) {
    setTimeout(() => {
      tour.startTour(editorTourSteps, 'editor');
    }, 800);
  }
});

onUnmounted(() => {
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
});

// ── Save ──
// Strip base URL from asset paths before saving to DB
function stripBaseUrl(path: string): string {
  if (!path) return path;
  const prefix = `${apiBaseUrl}/uploads/`;
  if (path.startsWith(prefix)) {
    return path.substring(prefix.length);
  }
  return path;
}

async function saveTemplate(silent = false) {
  // Validate template name
  const validation = validateTemplateName(templateName.value);
  if (!validation.valid) {
    toastMsg(validation.error || 'Invalid template name');
    saveStatus.value = 'unsaved';
    return;
  }

  // Sanitize template name
  const sanitizedName = sanitizeFileName(templateName.value.trim());
  if (sanitizedName !== templateName.value) {
    templateName.value = sanitizedName;
  }

  if (!silent) saving.value = true;
  saveStatus.value = 'saving';
  
  try {
    const lw = layout.width;
    const lh = layout.height;

    const savedElements = elements.value.map(el => {
      const old = edElToOld(el);
      // Strip base URL from image src
      if (old.src) {
        old.src = stripBaseUrl(old.src);
      }
      return old;
    });

    const payload = {
      name: templateName.value,
      layout: {
        width: lw,
        height: lh,
        background: stripBaseUrl(layout.background),
        backgroundColor: layout.backgroundColor,
        elements: savedElements,
      },
    };

    if (isNew.value) {
      const { post } = useApi();
      const result: any = await post('/api/templates', payload);
      if (result?.id) {
        justCreated.value = true;
        // Update route without navigation to prevent remount
        await router.replace(`/templates/${result.id}`);
        saveStatus.value = 'saved';
        lastSavedAt.value = new Date();
        if (!silent) toastMsg('Template saved');
        
        // Complete tour when user saves (tour is active and on last step)
        if (!silent && tour.isActive.value && tour.isLastStep.value) {
          setTimeout(() => {
            tour.completeTour();
          }, 500);
        }
        
        // Clear justCreated flag after 3 seconds to allow auto-save again
        setTimeout(() => {
          justCreated.value = false;
        }, 3000);
      }
    } else {
      const { put } = useApi();
      await put(`/api/templates/${templateId.value}`, payload);
      saveStatus.value = 'saved';
      lastSavedAt.value = new Date();
      if (!silent) toastMsg('Template saved');
      
      // Complete tour when user saves (tour is active and on last step)
      if (!silent && tour.isActive.value && tour.isLastStep.value) {
        setTimeout(() => {
          tour.completeTour();
        }, 500);
      }
    }
  } catch (e) {
    toastMsg('Failed to save: ' + (e as Error).message);
    saveStatus.value = 'unsaved';
  } finally {
    if (!silent) saving.value = false;
  }
}

// Auto-save with debounce (2 second delay, silent — no toast)
const autoSave = debounce(async () => {
  if (!isNew.value && templateName.value.trim() && !justCreated.value) {
    await saveTemplate(true);
  }
}, 2000);

// Mark as unsaved when changes occur
function markUnsaved() {
  if (saveStatus.value === 'saved') {
    saveStatus.value = 'unsaved';
  }
}

// Watch for changes to trigger auto-save
watch(() => templateName.value, () => {
  markUnsaved();
  autoSave();
  
  // Advance tour when user types template name
  if (tour.isActive.value && tour.currentStepData.value?.action === 'name-template' && templateName.value.trim()) {
    tour.completeActionStep();
  }
});

watch(() => layout.background, () => {
  markUnsaved();
  autoSave();
});

watch(() => layout.backgroundColor, () => {
  markUnsaved();
  autoSave();
});

watch(() => layout.width, () => {
  markUnsaved();
  autoSave();
});

watch(() => layout.height, () => {
  markUnsaved();
  autoSave();
});

watch(() => elements.value.length, () => {
  markUnsaved();
  autoSave();
});

watch(() => elements.value, () => {
  markUnsaved();
  autoSave();
}, { deep: true });

function handleCsvUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  csvFile.value = file.name;

  const reader = new FileReader();
  reader.onload = (ev) => {
    const text = ev.target?.result as string;
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) return;

    // auto-detect delimiter
    const sep = text.includes('\t') ? '\t' : text.includes(';') ? ';' : ',';
    const headers = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g, ''));

    csvColumns.value = headers;

    const rows = lines.slice(1).map(line => {
      const vals = line.split(sep).map(v => v.trim().replace(/^"|"$/g, ''));
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = vals[i] || ''; });
      return obj;
    });

    records.value = rows;
    recordIndex.value = 0;
    toastMsg(`Loaded ${rows.length} records from ${file.name}`);
  };
  reader.readAsText(file);
}

// ── Context menu (legacy compat) ──
const contextMenu = ref({ visible: false, x: 0, y: 0 });
</script>

<style scoped>
/* ── Design tokens ── */
#ed-root {
  --accent: #F5521E;
  --ink: #14110E;
  --muted: #6E665E;
  --panel: #FBF9F7;
  --line: rgba(20,17,14,0.09);
  --bg: #E9E2DB;
  height: 100vh; display: flex; flex-direction: column;
  background: var(--bg); font-family: 'General Sans', system-ui, sans-serif;
  color: var(--ink); -webkit-font-smoothing: antialiased;
  overflow: hidden;
}
#ed-root ::selection { background: #F5521E; color: #fff; }

/* ── TOP BAR ── */
.ed-header {
  flex: 0 0 auto; height: 58px; background: #fff;
  border-bottom: 1px solid var(--line); display: flex;
  align-items: center; padding: 0 14px; gap: 14px; z-index: 30;
}
.ed-brand { display: flex; align-items: center; gap: 9px; text-decoration: none; color: var(--ink); }
.brand-icon { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 8px; background: var(--ink); }
.ed-divider-v { width: 1px; height: 24px; background: var(--line); }
.ed-back-btn {
  display: grid; place-items: center; width: 32px; height: 32px;
  border-radius: 8px; color: var(--muted); text-decoration: none;
  transition: background .15s, color .15s;
}
.ed-back-btn:hover { color: var(--ink); }
.ed-title-area { display: flex; flex-direction: column; }
.ed-title-input {
  border: none; background: transparent; font-family: inherit;
  font-size: 14px; font-weight: 600; color: var(--ink);
  outline: none; padding: 0; width: 120px;
  border-bottom: 1px dashed transparent; transition: border-color .15s;
}
.ed-title-input:focus { border-bottom-color: var(--accent); }
.ed-title-input::placeholder { color: var(--muted); }
.ed-save-status { display: flex; align-items: center; gap: 5px; font-size: 11.5px; color: var(--muted); }
.save-dot { width: 6px; height: 6px; border-radius: 50%; background: #1Fae6b; flex-shrink: 0; }
.ed-undo-group { display: flex; align-items: center; gap: 2px; margin-left: 14px; }
.ed-icon-btn--disabled { opacity: 0.3; cursor: not-allowed; }
.ed-icon-btn {
  border: none; background: transparent; cursor: pointer;
  width: 34px; height: 34px; border-radius: 9px; display: grid;
  place-items: center; transition: background .15s; color: var(--ink);
}
.ed-header-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
.ed-plan-pill {
  display: flex; align-items: center; gap: 7px;
  background: var(--panel); border: 1px solid var(--line);
  padding: 6px 8px 6px 13px; border-radius: 999px;
  font-size: 12.5px; font-weight: 500; color: var(--muted);
}
.ed-plan-pill--pro {
  background: #FFF4F0; border-color: rgba(245,82,30,0.2); color: var(--accent);
}
.ed-plan-pro { color: var(--accent); font-weight: 600; }
.plan-upgrade {
  text-decoration: none; background: var(--ink); color: #fff;
  font-size: 12px; font-weight: 600; padding: 5px 11px; border-radius: 999px;
}
.ed-btn-outline {
  border: 1px solid var(--line); background: #fff; cursor: pointer;
  font-family: inherit; font-size: 13.5px; font-weight: 600; color: var(--ink);
  padding: 9px 15px; border-radius: 9px; transition: background .15s;
}
.ed-btn-accent {
  border: none; background: var(--accent); cursor: pointer;
  font-family: inherit; font-size: 13.5px; font-weight: 600; color: #fff;
  padding: 10px 17px; border-radius: 9px; display: flex;
  align-items: center; gap: 8px;
  box-shadow: 0 6px 16px rgba(245,82,30,0.32); transition: transform .2s;
}
.ed-btn-accent:disabled { opacity: 0.5; cursor: not-allowed; }
.ed-btn-accent.full { width: 100%; justify-content: center; margin-top: 18px; padding: 14px; font-size: 14px; border-radius: 11px; }
.ed-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(135deg, #F5521E, #ff8a5b);
  display: grid; place-items: center; color: #fff; font-size: 13px; font-weight: 600;
}

/* ── BODY ── */
.ed-body { flex: 1; display: flex; min-height: 0; overflow: hidden; }

/* ── LEFT PANEL ── */
.ed-left-panel {
  flex: 0 0 256px; background: var(--panel); border-right: 1px solid var(--line);
  overflow-y: auto; padding: 18px 16px;
}
.ed-left-panel::-webkit-scrollbar { width: 9px; }
.ed-left-panel::-webkit-scrollbar-thumb { background: rgba(20,17,14,0.16); border-radius: 9px; }
.ed-left-panel::-webkit-scrollbar-track { background: transparent; }
.ed-section-label {
  font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
  text-transform: uppercase; color: var(--muted);
}
.ed-add-grid { margin-top: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.ed-add-card {
  border: 1px solid var(--line); background: #fff; border-radius: 11px;
  padding: 13px 10px; cursor: pointer; font-family: inherit;
  display: flex; flex-direction: column; align-items: flex-start;
  gap: 9px; transition: border-color .2s, transform .15s, background .15s; color: var(--ink);
}
.ed-add-card:hover { border-color: rgba(20,17,14,0.22); transform: translateY(-1px); }
.ed-add-card.active { border-color: var(--accent); background: rgba(245,82,30,0.04); }
.ed-bg-picker { margin-top: 12px; display: flex; gap: 9px; flex-wrap: wrap; }
.ed-bg-picker--scroll { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 4px; }
.ed-bg-thumb {
  flex: 1; aspect-ratio: 1.3; border-radius: 10px;
  border: 2px solid var(--line); background: #fff; cursor: pointer; position: relative;
}
.ed-bg-thumb.active { border-color: var(--accent); background: linear-gradient(160deg, #fff, #f0e9e2); }
.ed-bg-thumb.add { border-style: dashed; display: grid; place-items: center; color: var(--muted); }
.ed-bg-thumb--border { background: #FFFDF9 !important; }
.ed-bg-thumb--fixed { flex: 0 0 54px; }
.ed-border-preview { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.ed-border-preview :deep(svg) { width: 100%; height: 100%; }
.bg-check {
  position: absolute; right: 5px; top: 5px; width: 16px; height: 16px;
  border-radius: 50%; background: var(--accent); display: grid; place-items: center;
}
.ed-bg-hint { margin-top: 9px; font-size: 11.5px; color: var(--muted); line-height: 1.4; }
.ed-bg-hint a { color: var(--accent); text-decoration: none; font-weight: 600; }
.ed-bg-color-row {
  margin-top: 10px; display: flex; align-items: center; gap: 10px;
  background: #fff; border: 1px solid var(--line); border-radius: 9px;
  padding: 8px 12px;
}
.ed-bg-color-pick {
  width: 28px; height: 28px; border-radius: 6px; cursor: pointer;
  border: 1px solid var(--line); padding: 2px;
}
.ed-bg-color-label { font-size: 12.5px; font-weight: 500; color: var(--ink); }

/* sub-panels */
.ed-sub-panel {
  margin-top: 12px; background: #fff; border: 1px solid var(--line);
  border-radius: 12px; padding: 14px;
}
.ed-sub-panel-title { font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 10px; }
.ed-sub-empty { font-size: 11.5px; color: var(--muted); text-align: center; padding: 16px 0; }
.ed-asset-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
.ed-asset-thumb {
  aspect-ratio: 1; border-radius: 8px; overflow: hidden;
  border: 1px solid var(--line); cursor: pointer; background: var(--panel);
  padding: 0; transition: border-color .15s;
}
.ed-asset-thumb:hover { border-color: var(--accent); }
.ed-asset-thumb img { width: 100%; height: 100%; object-fit: contain; }

.ed-layers { margin-top: 10px; display: flex; flex-direction: column; gap: 3px; }
.ed-layer-row {
  display: flex; align-items: center; gap: 9px; padding: 7px 9px;
  border-radius: 9px; cursor: pointer; border: 1px solid transparent;
  transition: background .15s;
}
.ed-layer-row.active { background: #fff; border-color: var(--accent); box-shadow: 0 2px 8px rgba(20,17,14,0.06); }
.ed-layer-row.hidden .layer-name { color: #A29A92; }
.ed-layer-row.hidden .layer-dot { opacity: 0.3; }
.layer-dot { flex: 0 0 auto; width: 8px; height: 8px; border-radius: 2px; }
.layer-name { flex: 1; font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.layer-eye {
  width: 24px; height: 24px; display: grid; place-items: center;
  border-radius: 6px; cursor: pointer; opacity: 0.6; color: var(--muted);
}

/* ── CANVAS ── */
.ed-canvas {
  flex: 1; min-width: 0; position: relative; display: flex;
  align-items: center; justify-content: center; overflow: auto;
  background: radial-gradient(rgba(20,17,14,0.05) 1px, transparent 1px);
  background-size: 22px 22px; background-color: var(--bg);
}
.canvas-wrapper { position: relative; }
.canvas-label {
  position: absolute; top: -26px; left: 0;
  font-size: 11.5px; font-weight: 500; color: var(--muted);
}
.canvas-stage {
  position: relative; transform-origin: center center; overflow: hidden;
}
.canvas-paper {
  position: absolute; inset: 0; background: #fff; border-radius: 6px;
  box-shadow: 0 30px 70px rgba(20,17,14,0.22), 0 6px 16px rgba(20,17,14,0.10);
}
.canvas-bg-img { width: 100%; height: 100%; object-fit: contain; }
.canvas-grid {
  position: absolute; inset: 0; pointer-events: none; z-index: 1;
  background-image:
    linear-gradient(rgba(20,17,14,0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(20,17,14,0.12) 1px, transparent 1px);
  background-size: 40px 40px;
}
.canvas-guide {
  position: absolute; pointer-events: none; z-index: 6;
  background: #F5521E; opacity: 0.6;
}
.canvas-guide-h { left: 0; right: 0; height: 1px; }
.canvas-guide-v { top: 0; bottom: 0; width: 1px; }

/* canvas elements */
.canvas-el { position: absolute; }
.el-seal { width: 100%; height: 100%; display: grid; place-items: center; }
.el-bar { width: 100%; height: 100%; }
.el-image, .el-shape { width: 100%; height: 100%; }

/* selection overlay */
.sel-overlay {
  position: absolute; border: 1.5px solid #F5521E; border-radius: 3px;
  pointer-events: none; z-index: 5;
}
.sel-handle {
  position: absolute; width: 10px; height: 10px;
  background: #fff; border: 1.5px solid #F5521E;
  pointer-events: auto; cursor: pointer; transition: transform .1s;
}
.sel-handle:hover { transform: scale(1.3); background: #F5521E; }
.sel-nw { top: -6px; left: -6px; border-radius: 3px 0 0 0; cursor: nw-resize; }
.sel-n  { top: -6px; left: 50%; margin-left: -5px; border-radius: 2px; cursor: n-resize; height: 6px; }
.sel-ne { top: -6px; right: -6px; border-radius: 0 3px 0 0; cursor: ne-resize; }
.sel-w  { top: 50%; left: -6px; margin-top: -5px; border-radius: 2px; cursor: w-resize; width: 6px; }
.sel-e  { top: 50%; right: -6px; margin-top: -5px; border-radius: 2px; cursor: e-resize; width: 6px; }
.sel-sw { bottom: -6px; left: -6px; border-radius: 0 0 0 3px; cursor: sw-resize; }
.sel-s  { bottom: -6px; left: 50%; margin-left: -5px; border-radius: 2px; cursor: s-resize; height: 6px; }
.sel-se { bottom: -6px; right: -6px; border-radius: 0 0 3px 0; cursor: se-resize; }
.sel-toolbar {
  position: absolute; top: -40px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 2px; background: var(--ink); padding: 5px;
  border-radius: 9px; box-shadow: 0 6px 18px rgba(20,17,14,0.3);
  pointer-events: auto; white-space: nowrap;
}
.sel-tool-btn {
  width: 28px; height: 28px; display: grid; place-items: center;
  border-radius: 6px; cursor: pointer; border: none; background: transparent;
  color: #fff;
}
.sel-tool-btn:hover { background: rgba(255,255,255,0.15); }

/* floating bar */
.ed-float-bar {
  position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%);
  display: flex; align-items: center; gap: 6px; background: #fff;
  border: 1px solid var(--line); border-radius: 999px; padding: 6px;
  box-shadow: 0 10px 30px rgba(20,17,14,0.12); z-index: 10;
}
.float-btn {
  border: none; background: transparent; cursor: pointer;
  width: 32px; height: 32px; border-radius: 50%; display: grid;
  place-items: center; color: var(--ink);
}
.float-btn.active { background: var(--ink); color: #fff; }
.float-label { font-size: 13px; font-weight: 600; min-width: 46px; text-align: center; }
.float-label.wide { min-width: 96px; font-size: 12.5px; font-weight: 500; color: var(--muted); }
.float-divider { width: 1px; height: 22px; background: var(--line); margin: 0 3px; }

/* ── RIGHT PANEL ── */
.ed-right-panel {
  flex: 0 0 308px; background: var(--panel); border-left: 1px solid var(--line);
  overflow-y: auto; display: flex; flex-direction: column;
}
.ed-right-panel::-webkit-scrollbar { width: 9px; }
.ed-right-panel::-webkit-scrollbar-thumb { background: rgba(20,17,14,0.16); border-radius: 9px; }
.ed-right-panel::-webkit-scrollbar-track { background: transparent; }
.ed-right-tabs {
  display: flex; padding: 14px 16px 0; gap: 4px;
  position: sticky; top: 0; background: var(--panel); z-index: 2;
}
.ed-tab {
  flex: 1; border: none; cursor: pointer; font-family: inherit;
  font-size: 13.5px; font-weight: 600; padding: 9px;
  border-radius: 9px 9px 0 0; background: transparent; color: var(--muted);
}
.ed-tab.active { color: var(--ink); border-bottom: 2px solid var(--accent); }
.ed-tab-content { padding: 16px; }

/* properties */
.ed-prop-header {
  display: flex; align-items: center; gap: 9px;
  padding-bottom: 14px; border-bottom: 1px solid var(--line);
}
.prop-icon {
  display: grid; place-items: center; width: 30px; height: 30px;
  border-radius: 8px; background: #fff; border: 1px solid var(--line);
}
.prop-text-icon { font-weight: 700; font-size: 15px; }
.prop-bar-icon { width: 14px; height: 4px; background: var(--accent); border-radius: 2px; }
.prop-name { font-size: 14px; font-weight: 600; }
.prop-kind { font-size: 11.5px; color: var(--muted); }
.ed-prop-section { margin-top: 16px; }
.prop-label { font-size: 11.5px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 8px; }
.prop-label-sm { font-size: 11px; color: var(--muted); margin-bottom: 5px; }
.prop-hint { margin-top: 7px; font-size: 11.5px; color: var(--muted); }
.ed-field-bound {
  display: flex; align-items: center; gap: 8px;
  background: #fff; border: 1px solid var(--line); border-radius: 9px;
  padding: 8px 12px; font-size: 13px;
}
.ed-field-bound svg { flex-shrink: 0; }
.ed-field-select {
  border: none; background: var(--cream); font-family: inherit;
  font-size: 13px; font-weight: 600; color: var(--accent);
  padding: 4px 8px; border-radius: 6px; cursor: pointer; outline: none;
}
.ed-textarea {
  width: 100%; border: 1px solid var(--line); border-radius: 9px;
  padding: 10px 12px; font-family: inherit; font-size: 13.5px;
  resize: vertical; outline: none; color: var(--ink); background: #fff;
}
.ed-select {
  width: 100%; border: 1px solid var(--line); border-radius: 9px;
  padding: 10px 12px; font-family: inherit; font-size: 13.5px;
  background: #fff; outline: none; cursor: pointer; color: var(--ink);
}
.ed-select.sm { padding: 8px 10px; font-size: 13px; }
.ed-locked-btn {
  margin-top: 8px; width: 100%; border: 1px dashed var(--line);
  background: #fff; border-radius: 9px; padding: 9px 12px;
  font-family: inherit; font-size: 12.5px; color: var(--muted);
  cursor: pointer; display: flex; align-items: center;
  justify-content: center; gap: 7px;
}
.pro-tag { background: var(--ink); color: #fff; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 5px; }
.ed-prop-row { display: flex; gap: 8px; margin-top: 10px; }
.ed-prop-col { flex: 1; }
.ed-dim-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.ed-dim-field { display: flex; flex-direction: column; gap: 3px; }
.ed-dim-label { font-size: 10px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.03em; }
.ed-dim-input { width: 100%; border: 1px solid var(--line); border-radius: 7px; padding: 6px 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--ink); box-sizing: border-box; outline: none; }
.ed-lock-btn {
  width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center;
  border: none; background: transparent; cursor: pointer; color: var(--muted); border-radius: 3px; padding: 0;
  transition: color .15s;
}
.ed-lock-btn:hover { background: var(--line); }
.ed-lock-btn--locked { color: var(--accent); }
.ed-range-row {
  display: flex; align-items: center; gap: 8px;
  background: #fff; border: 1px solid var(--line); border-radius: 9px;
  padding: 7px 11px;
}
.ed-range-row input[type="range"] { flex: 1; }
.range-val { font-size: 12.5px; font-weight: 600; min-width: 26px; text-align: right; }
.ed-align-group { display: flex; background: #fff; border: 1px solid var(--line); border-radius: 9px; overflow: hidden; }
.align-btn {
  border: none; cursor: pointer; width: 34px; height: 34px;
  display: grid; place-items: center; background: #fff; color: var(--ink);
}
.align-btn.active { background: var(--ink); color: #fff; }
.ed-swatches { display: flex; gap: 9px; align-items: center; }
.swatch {
  width: 34px; height: 34px; border-radius: 9px; cursor: pointer;
  border: 2px solid #fff; box-shadow: 0 0 0 1px rgba(20,17,14,0.12);
  position: relative;
}
.swatch.active {
  box-shadow: 0 0 0 2px var(--ink), 0 0 0 4px #fff;
  border-color: transparent;
}
.swatch.active::after {
  content: ''; position: absolute; inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M5 12l4.5 4.5L19 7' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/16px no-repeat;
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.25));
}
.swatch-picker {
  width: 34px; height: 34px; border-radius: 9px; cursor: pointer; border: 1px solid var(--line);
  padding: 2px; background: #fff;
}

/* empty state */
.ed-empty-state { text-align: center; padding: 48px 12px; color: var(--muted); }
.ed-size-presets { display: flex; flex-direction: column; gap: 4px; margin-top: 18px; }
.ed-size-btn {
  border: 1px solid var(--line); background: #fff; cursor: pointer;
  font-family: inherit; font-size: 13px; font-weight: 500; color: var(--ink);
  padding: 10px 12px; border-radius: 9px; transition: all .15s; width: 100%; text-align: left;
}
.ed-size-btn:hover { background: rgba(20,17,14,0.03); border-color: rgba(20,17,14,0.18); }
.ed-size-btn.active { background: var(--ink); color: #fff; border-color: var(--ink); font-weight: 600; }
.ed-size-custom { display: none; margin-top: 10px; align-items: center; gap: 6px; font-size: 13px; color: var(--muted); }
.ed-size-custom.visible { display: flex; }
.ed-size-input {
  width: 80px; border: 1px solid var(--line); border-radius: 8px; padding: 8px 10px;
  font-family: inherit; font-size: 13px; text-align: center; outline: none; color: var(--ink);
}
.empty-icon {
  width: 52px; height: 52px; border-radius: 14px;
  background: #fff; border: 1px solid var(--line);
  display: grid; place-items: center; margin: 0 auto 14px; color: var(--muted);
}
.empty-title { font-size: 14px; font-weight: 600; color: var(--ink); }
.empty-text { font-size: 13px; margin-top: 5px; line-height: 1.5; }

/* data tab */
.ed-data-header { display: flex; align-items: center; justify-content: space-between; }
.data-title { font-size: 14px; font-weight: 600; }
.data-meta { font-size: 11.5px; color: var(--muted); }
.ed-btn-sm-outline {
  border: 1px solid var(--line); background: #fff; border-radius: 8px;
  padding: 7px 11px; font-family: inherit; font-size: 12.5px; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; gap: 6px; color: var(--ink);
}
.ed-upload-btn { position: relative; overflow: hidden; }
.ed-file-hidden {
  position: absolute; inset: 0; opacity: 0; cursor: pointer;
}
.ed-mappings { margin-top: 9px; display: flex; flex-direction: column; gap: 7px; }
.ed-map-row {
  display: flex; align-items: center; gap: 8px;
  background: #fff; border: 1px solid var(--line); border-radius: 9px;
  padding: 9px 11px; font-size: 12.5px;
}
.map-col {
  background: #F2ECE7; border-radius: 6px; padding: 3px 7px;
  font-weight: 600; font-family: 'Inter', monospace;
}
.map-field { font-weight: 500; color: var(--accent); }
.ed-data-rec-header { margin-top: 18px; display: flex; align-items: center; justify-content: space-between; }
.data-tap-hint { font-size: 11.5px; color: var(--muted); }
.ed-records { margin-top: 9px; display: flex; flex-direction: column; gap: 4px; }
.ed-record-row {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: 9px; cursor: pointer;
  border: 1px solid transparent;
}
.ed-record-row.active { background: #fff; border-color: var(--accent); }
.rec-num { width: 22px; font-size: 11px; color: var(--muted); }
.rec-info { flex: 1; min-width: 0; }
.rec-name { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rec-course { font-size: 11px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rec-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); }
.data-watermark-note { margin-top: 9px; text-align: center; font-size: 11.5px; color: var(--muted); }

/* range inputs (scoped) */
input[type="range"] {
  -webkit-appearance: none; appearance: none; height: 4px;
  border-radius: 4px; background: rgba(20,17,14,0.12); outline: none;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; width: 15px; height: 15px;
  border-radius: 50%; background: #14110E; cursor: pointer;
  border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.25);
}

/* toast */
.ed-toast {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  background: var(--ink); color: #fff; font-size: 13px; font-weight: 500;
  padding: 12px 18px; border-radius: 11px;
  box-shadow: 0 12px 34px rgba(20,17,14,0.35); z-index: 80;
  display: flex; align-items: center; gap: 9px;
}
.toast-enter-active { transition: opacity .3s, transform .3s; }
.toast-leave-active { transition: opacity .2s, transform .2s; }
.toast-enter-from { opacity: 0; transform: translateX(-50%) translateY(10px); }
.toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }
</style>
