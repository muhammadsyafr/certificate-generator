<template>
    <div
        class="fixed inset-0 flex flex-col"
        style="background: var(--color-bg)"
    >
        <header
            class="flex justify-between items-center border-b flex-shrink-0"
            style="
                padding: var(--space-5) var(--space-8);
                border-color: var(--color-border);
            "
        >
            <div>
                <NuxtLink
                    to="/templates"
                    class="inline-flex items-center"
                    style="
                        gap: var(--space-2);
                        margin-bottom: var(--space-2);
                        color: var(--color-text-secondary);
                        font-size: var(--text-sm);
                        font-weight: var(--weight-medium);
                        transition: color var(--duration-fast)
                            var(--ease-standard);
                    "
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span>Back to Templates</span>
                </NuxtLink>
                <h1 class="text-heading-sm" style="color: var(--color-text)">
                    {{ isNew ? "New Template" : "Edit Template" }}
                </h1>
            </div>
            <button
                @click="saveTemplate"
                :disabled="saving || !templateName"
                class="btn-primary"
            >
                {{ saving ? "Saving..." : "Save Template" }}
            </button>
        </header>

        <div class="relative flex flex-1 overflow-hidden">
            <div
                class="flex flex-col flex-1 min-w-0"
                :style="{ width: settingsVisible ? '80%' : '100%' }"
            >
                <div
                    class="flex justify-between items-center border-b flex-shrink-0"
                    style="
                        padding: var(--space-4) var(--space-6);
                        border-color: var(--color-border);
                    "
                >
                    <h4
                        class="text-body-sm"
                        style="
                            font-weight: var(--weight-semibold);
                            color: var(--color-text-secondary);
                        "
                    >
                        Canvas Preview
                    </h4>
                    <div
                        class="flex"
                        style="gap: var(--space-2); flex-wrap: wrap"
                    >
                        <button
                            @click="zoomOut"
                            class="btn-ghost btn-sm"
                            title="Zoom Out"
                            style="
                                width: 36px;
                                height: 36px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 18px;
                                font-weight: var(--weight-medium);
                            "
                        >
                            −
                        </button>
                        <span
                            class="text-body-sm"
                            style="
                                padding: var(--space-2) var(--space-3);
                                color: var(--color-text-secondary);
                                display: flex;
                                align-items: center;
                                font-weight: var(--weight-medium);
                                min-width: 60px;
                                justify-content: center;
                            "
                            >{{ Math.round(zoom * 100) }}%</span
                        >
                        <button
                            @click="zoomIn"
                            class="btn-ghost btn-sm"
                            title="Zoom In"
                            style="
                                width: 36px;
                                height: 36px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 18px;
                                font-weight: var(--weight-medium);
                            "
                        >
                            +
                        </button>
                        <div
                            style="
                                width: 1px;
                                height: 32px;
                                background: var(--color-border);
                                margin: 0 var(--space-1);
                            "
                        ></div>
                        <button
                            @click="fullscreen = !fullscreen"
                            class="btn-ghost btn-sm"
                            style="padding: var(--space-2) var(--space-4)"
                        >
                            {{ fullscreen ? "Exit Fullscreen" : "Fullscreen" }}
                        </button>
                    </div>
                </div>
                <div
                    ref="canvasContainerRef"
                    class="flex-1 overflow-auto"
                    style="
                        background: var(--color-surface-hover);
                        padding: var(--space-8);
                    "
                >
                    <div :style="canvasStyle" class="relative">
                        <div v-if="layout.background" class="absolute inset-0">
                            <img
                                :src="layout.background"
                                class="w-full h-full object-contain"
                            />
                        </div>

                        <div
                            v-for="(el, idx) in layout.elements"
                            :key="idx"
                            class="absolute cursor-move border border-dashed border-transparent hover:border-obsidian transition-colors group"
                            :style="elementStyle(el)"
                            @mousedown="startDrag(idx, $event)"
                            @click="selectedElement = idx"
                            @contextmenu.prevent="showContextMenu(idx, $event)"
                        >
                            <div
                                v-if="el.type === 'text'"
                                :style="textStyle(el)"
                            >
                                {{ el.content }}
                            </div>
                            <img
                                v-else-if="el.type === 'image'"
                                :src="el.src"
                                style="width: 100%; height: 100%; object-fit: contain;"
                            />
                            <template v-if="selectedElement === idx">
                                <div
                                    class="absolute rounded-full cursor-nwse-resize"
                                    style="top: -6px; left: -6px; width: 12px; height: 12px; background: var(--color-primary); border: 2px solid var(--color-surface); box-shadow: var(--shadow-sm);"
                                    @mousedown.stop="
                                        startResize(idx, 'nw', $event)
                                    "
                                ></div>
                                <div
                                    class="absolute rounded-full cursor-nesw-resize"
                                    style="top: -6px; right: -6px; width: 12px; height: 12px; background: var(--color-primary); border: 2px solid var(--color-surface); box-shadow: var(--shadow-sm);"
                                    @mousedown.stop="
                                        startResize(idx, 'ne', $event)
                                    "
                                ></div>
                                <div
                                    class="absolute rounded-full cursor-nesw-resize"
                                    style="bottom: -6px; left: -6px; width: 12px; height: 12px; background: var(--color-primary); border: 2px solid var(--color-surface); box-shadow: var(--shadow-sm);"
                                    @mousedown.stop="
                                        startResize(idx, 'sw', $event)
                                    "
                                ></div>
                                <div
                                    class="absolute rounded-full cursor-nwse-resize"
                                    style="bottom: -6px; right: -6px; width: 12px; height: 12px; background: var(--color-primary); border: 2px solid var(--color-surface); box-shadow: var(--shadow-sm);"
                                    @mousedown.stop="
                                        startResize(idx, 'se', $event)
                                    "
                                ></div>
                                <div
                                    class="absolute top-1/2 -translate-y-1/2 rounded-full cursor-ew-resize"
                                    style="left: -6px; width: 12px; height: 12px; background: var(--color-primary); border: 2px solid var(--color-surface); box-shadow: var(--shadow-sm);"
                                    @mousedown.stop="
                                        startResize(idx, 'w', $event)
                                    "
                                ></div>
                                <div
                                    class="absolute top-1/2 -translate-y-1/2 rounded-full cursor-ew-resize"
                                    style="right: -6px; width: 12px; height: 12px; background: var(--color-primary); border: 2px solid var(--color-surface); box-shadow: var(--shadow-sm);"
                                    @mousedown.stop="
                                        startResize(idx, 'e', $event)
                                    "
                                ></div>
                                <div
                                    class="absolute left-1/2 -translate-x-1/2 rounded-full cursor-ns-resize"
                                    style="top: -6px; width: 12px; height: 12px; background: var(--color-primary); border: 2px solid var(--color-surface); box-shadow: var(--shadow-sm);"
                                    @mousedown.stop="
                                        startResize(idx, 'n', $event)
                                    "
                                ></div>
                                <div
                                    class="absolute left-1/2 -translate-x-1/2 rounded-full cursor-ns-resize"
                                    style="bottom: -6px; width: 12px; height: 12px; background: var(--color-primary); border: 2px solid var(--color-surface); box-shadow: var(--shadow-sm);"
                                    @mousedown.stop="
                                        startResize(idx, 's', $event)
                                    "
                                ></div>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Context Menu -->
                <div
                    v-if="contextMenu.visible"
                    class="fixed z-50 card"
                    :style="{
                        left: contextMenu.x + 'px',
                        top: contextMenu.y + 'px',
                        padding: 'var(--space-2)',
                        minWidth: '160px',
                        boxShadow: 'var(--shadow-lg)'
                    }"
                >
                    <button
                        @click="duplicateElement"
                        class="w-full text-left btn-ghost"
                        style="padding: var(--space-3); display: flex; align-items: center; gap: var(--space-3); font-size: var(--text-sm); border-radius: var(--radius-md);"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                        </svg>
                        Duplicate
                    </button>
                    <button
                        @click="deleteElementFromContext"
                        class="w-full text-left btn-ghost"
                        style="padding: var(--space-3); display: flex; align-items: center; gap: var(--space-3); font-size: var(--text-sm); border-radius: var(--radius-md); color: var(--color-danger);"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete
                    </button>
                </div>

                <button
                    @click="settingsVisible = !settingsVisible"
                    class="fixed z-10 rounded-full shadow-lg flex items-center justify-center transition-all"
                    style="
                        bottom: var(--space-8);
                        right: var(--space-8);
                        width: 56px;
                        height: 56px;
                        background: var(--color-primary);
                        color: var(--color-surface);
                        box-shadow: var(--shadow-lg);
                    "
                    :title="settingsVisible ? 'Hide Settings' : 'Show Settings'"
                >
                    <svg
                        v-if="settingsVisible"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    <svg
                        v-else
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
            </div>

            <Transition name="slide">
                <div
                    v-if="settingsVisible"
                    class="flex flex-col border-l overflow-y-auto"
                    style="
                        width: 20%;
                        min-width: 380px;
                        border-color: var(--color-border);
                        background: var(--color-surface);
                    "
                >
                    <div style="padding: var(--space-8)">
                        <h2
                            class="text-heading-sm"
                            style="margin-bottom: var(--space-8)"
                        >
                            Template Settings
                        </h2>

                        <div
                            style="
                                display: flex;
                                flex-direction: column;
                                gap: var(--space-6);
                            "
                        >
                            <div class="form-group">
                                <label class="form-label">Template Name</label>
                                <input
                                    v-model="templateName"
                                    type="text"
                                    placeholder="e.g. Completion Certificate"
                                />
                            </div>

                            <div class="form-group">
                                <label class="form-label">Canvas Size</label>
                                <div class="form-row">
                                    <input
                                        v-model.number="layout.width"
                                        type="number"
                                        placeholder="Width"
                                        min="400"
                                        max="2400"
                                    />
                                    <input
                                        v-model.number="layout.height"
                                        type="number"
                                        placeholder="Height"
                                        min="400"
                                        max="2400"
                                    />
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label"
                                    >Background Image</label
                                >
                                <select v-model="layout.background">
                                    <option value="">None</option>
                                    <option
                                        v-for="bg in combinedBackgrounds"
                                        :key="bg.id"
                                        :value="bg.filepath"
                                    >
                                        {{ bg.filename }}
                                    </option>
                                </select>
                            </div>

                            <hr style="border-color: var(--color-border)" />

                            <h3
                                class="text-body"
                                style="
                                    font-weight: var(--weight-semibold);
                                    color: var(--color-text);
                                "
                            >
                                Add Elements
                            </h3>

                            <button
                                @click="addTextElement"
                                class="btn-primary"
                                style="
                                    width: 100%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    gap: var(--space-2);
                                "
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add Text Element
                            </button>

                            <div class="form-group">
                                <label class="form-label">Add Image</label>
                                <select @change="addImageElement($event)">
                                    <option value="">Select logo...</option>
                                    <option
                                        v-for="logo in combinedLogos"
                                        :key="logo.id"
                                        :value="logo.filepath"
                                    >
                                        {{ logo.filename }}
                                    </option>
                                </select>
                            </div>

                            <hr style="border-color: var(--color-border)" />

                            <div
                                v-if="selectedElement !== null"
                                style="
                                    display: flex;
                                    flex-direction: column;
                                    gap: var(--space-6);
                                "
                            >
                                <div class="flex justify-between items-center">
                                    <h3
                                        class="text-body"
                                        style="
                                            font-weight: var(--weight-semibold);
                                            color: var(--color-text);
                                        "
                                    >
                                        Element Properties
                                    </h3>
                                    <button
                                        @click="deleteElement"
                                        class="btn-ghost"
                                        style="
                                            color: var(--color-danger);
                                            padding: var(--space-2)
                                                var(--space-3);
                                            font-size: var(--text-sm);
                                        "
                                    >
                                        Delete
                                    </button>
                                </div>

                                <div
                                    v-if="
                                        layout.elements[selectedElement]
                                            ?.type === 'text'
                                    "
                                    class="form-group"
                                >
                                    <label class="form-label">Content</label>
                                    <textarea
                                        v-model="
                                            layout.elements[selectedElement]
                                                .content
                                        "
                                        rows="3"
                                        style="
                                            font-family: var(--font-mono);
                                            font-size: var(--text-sm);
                                        "
                                        placeholder="Use {{name}}, {{date}}, {{certificate_id}}"
                                    ></textarea>
                                    <span
                                        class="text-caption"
                                        style="
                                            color: var(--color-text-muted);
                                            display: block;
                                            margin-top: var(--space-2);
                                        "
                                        >Placeholders: {{ name }}, {{ date }},
                                        {{ certificate_id }}</span
                                    >
                                </div>

                                <div
                                    v-if="
                                        layout.elements[selectedElement]
                                            ?.type === 'text'
                                    "
                                    class="form-group"
                                >
                                    <label class="form-label">Font Size</label>
                                    <input
                                        v-model.number="
                                            layout.elements[selectedElement]
                                                .fontSize
                                        "
                                        type="number"
                                        min="12"
                                        max="120"
                                    />
                                </div>

                                <div
                                    v-if="
                                        layout.elements[selectedElement]
                                            ?.type === 'text'
                                    "
                                    class="form-group"
                                >
                                    <label class="form-label">Font Family</label>
                                    <select
                                        v-model="
                                            layout.elements[selectedElement]
                                                .fontFamily
                                        "
                                    >
                                        <option value="">Default (Source Serif 4)</option>
                                        <option value="'Playfair Display', serif">Playfair Display</option>
                                        <option value="'Source Serif 4', serif">Source Serif 4</option>
                                        <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                                        <optgroup v-if="customFonts.length > 0" label="Custom Fonts">
                                            <option
                                                v-for="family in customFonts"
                                                :key="family"
                                                :value="`'${family}', sans-serif`"
                                            >
                                                {{ family }}
                                            </option>
                                        </optgroup>
                                    </select>
                                </div>

                                <div
                                    v-if="
                                        layout.elements[selectedElement]
                                            ?.type === 'text'
                                    "
                                    class="form-group"
                                >
                                    <label class="form-label">Color</label>
                                    <input
                                        v-model="
                                            layout.elements[selectedElement]
                                                .color
                                        "
                                        type="color"
                                    />
                                </div>

                                <div
                                    v-if="
                                        layout.elements[selectedElement]
                                            ?.type === 'text'
                                    "
                                    class="form-group"
                                >
                                    <label class="form-label"
                                        >Font Weight</label
                                    >
                                    <select
                                        v-model="
                                            layout.elements[selectedElement]
                                                .fontWeight
                                        "
                                    >
                                        <option value="300">Light</option>
                                        <option value="400">Normal</option>
                                        <option value="500">Medium</option>
                                        <option value="600">Semi Bold</option>
                                        <option value="700">Bold</option>
                                        <option value="900">Black</option>
                                    </select>
                                </div>

                                <div
                                    v-if="
                                        layout.elements[selectedElement]
                                            ?.type === 'text'
                                    "
                                    class="form-group"
                                >
                                    <label class="form-label">Font Style</label>
                                    <select
                                        v-model="
                                            layout.elements[selectedElement]
                                                .fontStyle
                                        "
                                    >
                                        <option value="normal">Normal</option>
                                        <option value="italic">Italic</option>
                                    </select>
                                </div>

                                <div
                                    v-if="
                                        layout.elements[selectedElement]
                                            ?.type === 'text'
                                    "
                                    class="form-group"
                                >
                                    <label class="form-label"
                                        >Text Decoration</label
                                    >
                                    <select
                                        v-model="
                                            layout.elements[selectedElement]
                                                .textDecoration
                                        "
                                    >
                                        <option value="none">None</option>
                                        <option value="underline">
                                            Underline
                                        </option>
                                        <option value="line-through">
                                            Line Through
                                        </option>
                                    </select>
                                </div>

                                <div
                                    v-if="
                                        layout.elements[selectedElement]
                                            ?.type === 'text'
                                    "
                                    class="form-group"
                                >
                                    <label class="form-label">Text Align</label>
                                    <div class="tabs">
                                        <button
                                            @click="
                                                layout.elements[
                                                    selectedElement
                                                ].textAlign = 'left'
                                            "
                                            :class="[
                                                'tab',
                                                (layout.elements[
                                                    selectedElement
                                                ].textAlign || 'left') ===
                                                'left'
                                                    ? 'tab-active'
                                                    : '',
                                            ]"
                                        >
                                            Left
                                        </button>
                                        <button
                                            @click="
                                                layout.elements[
                                                    selectedElement
                                                ].textAlign = 'center'
                                            "
                                            :class="[
                                                'tab',
                                                layout.elements[selectedElement]
                                                    .textAlign === 'center'
                                                    ? 'tab-active'
                                                    : '',
                                            ]"
                                        >
                                            Center
                                        </button>
                                        <button
                                            @click="
                                                layout.elements[
                                                    selectedElement
                                                ].textAlign = 'right'
                                            "
                                            :class="[
                                                'tab',
                                                layout.elements[selectedElement]
                                                    .textAlign === 'right'
                                                    ? 'tab-active'
                                                    : '',
                                            ]"
                                        >
                                            Right
                                        </button>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label"
                                        >Position & Size</label
                                    >
                                    <div class="form-row">
                                        <input
                                            v-model.number="
                                                layout.elements[selectedElement]
                                                    .x
                                            "
                                            type="number"
                                            placeholder="X"
                                        />
                                        <input
                                            v-model.number="
                                                layout.elements[selectedElement]
                                                    .y
                                            "
                                            type="number"
                                            placeholder="Y"
                                        />
                                    </div>
                                    <div
                                        class="form-row"
                                        style="margin-top: var(--space-3)"
                                    >
                                        <input
                                            v-model.number="
                                                layout.elements[selectedElement]
                                                    .width
                                            "
                                            type="number"
                                            placeholder="Width"
                                        />
                                        <input
                                            v-model.number="
                                                layout.elements[selectedElement]
                                                    .height
                                            "
                                            type="number"
                                            placeholder="Height"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>

        <Teleport to="body">
            <div
                v-if="fullscreen"
                class="fixed inset-0 z-50 flex items-center justify-center"
                style="
                    background: rgba(0, 0, 0, 0.95);
                    backdrop-filter: blur(8px);
                "
                @click.self="fullscreen = false"
            >
                <div
                    class="absolute flex"
                    style="
                        top: var(--space-6);
                        right: var(--space-6);
                        gap: var(--space-3);
                    "
                >
                    <button
                        @click="zoomOut"
                        class="btn-ghost"
                        style="
                            color: white;
                            background: rgba(255, 255, 255, 0.1);
                            width: 40px;
                            height: 40px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 20px;
                            font-weight: var(--weight-medium);
                        "
                        title="Zoom Out"
                    >
                        −
                    </button>
                    <span
                        style="
                            color: white;
                            padding: var(--space-2) var(--space-4);
                            display: flex;
                            align-items: center;
                            font-size: var(--text-sm);
                            font-weight: var(--weight-medium);
                            background: rgba(255, 255, 255, 0.1);
                            border-radius: var(--radius-lg);
                        "
                        >{{ Math.round(zoom * 100) }}%</span
                    >
                    <button
                        @click="zoomIn"
                        class="btn-ghost"
                        style="
                            color: white;
                            background: rgba(255, 255, 255, 0.1);
                            width: 40px;
                            height: 40px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 20px;
                            font-weight: var(--weight-medium);
                        "
                        title="Zoom In"
                    >
                        +
                    </button>
                    <div
                        style="
                            width: 1px;
                            background: rgba(255, 255, 255, 0.2);
                            margin: 0 var(--space-1);
                        "
                    ></div>
                    <button
                        @click="fullscreen = false"
                        class="btn-ghost"
                        style="
                            color: white;
                            background: rgba(255, 255, 255, 0.1);
                            padding: var(--space-2) var(--space-5);
                            display: flex;
                            align-items: center;
                            gap: var(--space-2);
                            font-size: var(--text-sm);
                        "
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        Close
                    </button>
                </div>
                <div
                    class="overflow-auto w-full h-full flex items-center justify-center"
                    style="padding: var(--space-8)"
                >
                    <div
                        :style="fullscreenCanvasStyle"
                        class="relative flex-shrink-0"
                    >
                        <div v-if="layout.background" class="absolute inset-0">
                            <img
                                :src="layout.background"
                                class="w-full h-full object-contain"
                            />
                        </div>

                        <div
                            v-for="(el, idx) in layout.elements"
                            :key="'fs-' + idx"
                            class="absolute cursor-move border border-dashed group"
                            style="border-color: rgba(9, 9, 11, 0.3)"
                            :style="elementStyle(el)"
                            @mousedown="startDrag(idx, $event)"
                            @click="selectedElement = idx"
                        >
                            <div
                                v-if="el.type === 'text'"
                                :style="textStyle(el)"
                            >
                                {{ el.content }}
                            </div>
                            <img
                                v-else-if="el.type === 'image'"
                                :src="el.src"
                                style="width: 100%; height: 100%; object-fit: contain;"
                            />
                            <template v-if="selectedElement === idx">
                                <div
                                    class="absolute rounded-full cursor-nwse-resize"
                                    style="top: -6px; left: -6px; width: 12px; height: 12px; background: var(--color-primary); border: 2px solid var(--color-surface); box-shadow: var(--shadow-sm);"
                                    @mousedown.stop="
                                        startResize(idx, 'nw', $event)
                                    "
                                ></div>
                                <div
                                    class="absolute rounded-full cursor-nesw-resize"
                                    style="top: -6px; right: -6px; width: 12px; height: 12px; background: var(--color-primary); border: 2px solid var(--color-surface); box-shadow: var(--shadow-sm);"
                                    @mousedown.stop="
                                        startResize(idx, 'ne', $event)
                                    "
                                ></div>
                                <div
                                    class="absolute rounded-full cursor-nesw-resize"
                                    style="bottom: -6px; left: -6px; width: 12px; height: 12px; background: var(--color-primary); border: 2px solid var(--color-surface); box-shadow: var(--shadow-sm);"
                                    @mousedown.stop="
                                        startResize(idx, 'sw', $event)
                                    "
                                ></div>
                                <div
                                    class="absolute rounded-full cursor-nwse-resize"
                                    style="bottom: -6px; right: -6px; width: 12px; height: 12px; background: var(--color-primary); border: 2px solid var(--color-surface); box-shadow: var(--shadow-sm);"
                                    @mousedown.stop="
                                        startResize(idx, 'se', $event)
                                    "
                                ></div>
                                <div
                                    class="absolute top-1/2 -translate-y-1/2 rounded-full cursor-ew-resize"
                                    style="left: -6px; width: 12px; height: 12px; background: var(--color-primary); border: 2px solid var(--color-surface); box-shadow: var(--shadow-sm);"
                                    @mousedown.stop="
                                        startResize(idx, 'w', $event)
                                    "
                                ></div>
                                <div
                                    class="absolute top-1/2 -translate-y-1/2 rounded-full cursor-ew-resize"
                                    style="right: -6px; width: 12px; height: 12px; background: var(--color-primary); border: 2px solid var(--color-surface); box-shadow: var(--shadow-sm);"
                                    @mousedown.stop="
                                        startResize(idx, 'e', $event)
                                    "
                                ></div>
                                <div
                                    class="absolute left-1/2 -translate-x-1/2 rounded-full cursor-ns-resize"
                                    style="top: -6px; width: 12px; height: 12px; background: var(--color-primary); border: 2px solid var(--color-surface); box-shadow: var(--shadow-sm);"
                                    @mousedown.stop="
                                        startResize(idx, 'n', $event)
                                    "
                                ></div>
                                <div
                                    class="absolute left-1/2 -translate-x-1/2 rounded-full cursor-ns-resize"
                                    style="bottom: -6px; width: 12px; height: 12px; background: var(--color-primary); border: 2px solid var(--color-surface); box-shadow: var(--shadow-sm);"
                                    @mousedown.stop="
                                        startResize(idx, 's', $event)
                                    "
                                ></div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>

        <Teleport to="body">
            <Transition name="modal">
                <div
                    v-if="showUnsavedModal"
                    class="fixed inset-0 z-[9999] flex items-center justify-center"
                    style="background: hsla(0, 0%, 5%, 0.45); backdrop-filter: blur(4px);"
                    @click.self="cancelLeave"
                >
                    <div
                        class="surface-raised"
                        style="
                            max-width: 420px;
                            width: calc(100% - 2rem);
                            padding: var(--space-8);
                            box-shadow: var(--shadow-lg);
                        "
                    >
                        <div style="margin-bottom: var(--space-5);">
                            <h2
                                class="text-heading-sm"
                                style="margin-bottom: var(--space-3); color: var(--color-text);"
                            >
                                Unsaved Changes
                            </h2>
                            <p
                                style="
                                    color: var(--color-text-secondary);
                                    font-size: var(--text-sm);
                                    line-height: var(--leading-relaxed);
                                "
                            >
                                You have unsaved changes. If you leave now, your
                                changes will be lost.
                            </p>
                        </div>
                        <div
                            style="
                                display: flex;
                                justify-content: flex-end;
                                gap: var(--space-3);
                            "
                        >
                            <button
                                @click="cancelLeave"
                                class="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                @click="confirmLeave"
                                class="btn-danger"
                            >
                                Discard Changes
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const isNew = computed(() => route.params.id === "new");
const templateId = computed(() =>
    isNew.value ? null : parseInt(route.params.id as string),
);

const templateName = ref("");
const saving = ref(false);
const selectedElement = ref<number | null>(null);
const fullscreen = ref(false);
const settingsVisible = ref(true);
const zoom = ref(0.8);
const contextMenu = ref({
    visible: false,
    x: 0,
    y: 0,
    elementIndex: null as number | null
});
const showUnsavedModal = ref(false);
const pendingNavigation = ref<any>(null);

interface LayoutElement {
    type: "text" | "image";
    x: number;
    y: number;
    width: number;
    height: number;
    content?: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    textAlign?: string;
    src?: string;
}

interface Layout {
    width: number;
    height: number;
    background: string;
    elements: LayoutElement[];
}

const layout = reactive<Layout>({
    width: 1754,
    height: 1240,
    background: "",
    elements: [],
});

const { data: assets } = await useFetch("/api/assets");
const { data: fonts } = await useFetch("/api/fonts");

const combinedLogos = computed(
    () =>
        assets.value?.filter(
            (a) => a.type === "logo" || a.type === "free-image",
        ) || [],
);
const combinedBackgrounds = computed(
    () =>
        assets.value?.filter(
            (a) => a.type === "background" || a.type === "free-image",
        ) || [],
);

// Get unique custom font families
const customFonts = computed(() => {
    if (!fonts.value) return []
    const families = new Set<string>()
    fonts.value.forEach(font => families.add(font.fontFamily))
    return Array.from(families).sort()
})

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

if (!isNew.value && templateId.value) {
    const { data: template } = await useFetch(
        `/api/templates/${templateId.value}`,
    );
    if (template.value) {
        templateName.value = template.value.name;
        const savedLayout = JSON.parse(template.value.layout);
        Object.assign(layout, savedLayout);
    }
}

// Track changes for unsaved warning
const hasUnsavedChanges = ref(false)
const initialState = ref('')

// Store initial state after loading
onMounted(() => {
    initialState.value = JSON.stringify({
        name: templateName.value,
        layout: JSON.parse(JSON.stringify(layout))
    })
})

// Watch for changes
watch([templateName, layout], () => {
    const currentState = JSON.stringify({
        name: templateName.value,
        layout: JSON.parse(JSON.stringify(layout))
    })
    hasUnsavedChanges.value = currentState !== initialState.value
}, { deep: true })

// Warn before leaving
onBeforeRouteLeave((to, from, next) => {
    if (hasUnsavedChanges.value) {
        showUnsavedModal.value = true
        pendingNavigation.value = next
    } else {
        next()
    }
})

function confirmLeave() {
    showUnsavedModal.value = false
    if (pendingNavigation.value) {
        pendingNavigation.value()
        pendingNavigation.value = null
    }
}

function cancelLeave() {
    showUnsavedModal.value = false
    if (pendingNavigation.value) {
        pendingNavigation.value(false)
        pendingNavigation.value = null
    }
}

// Warn before closing/refreshing browser
onMounted(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (hasUnsavedChanges.value) {
            e.preventDefault()
            e.returnValue = ''
        }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    onUnmounted(() => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
    })
})

function zoomIn() {
    zoom.value = Math.min(zoom.value + 0.1, 2);
}

function zoomOut() {
    zoom.value = Math.max(zoom.value - 0.1, 0.3);
}

const canvasContainerRef = ref<HTMLElement | null>(null);

const scale = computed(() => {
    if (fullscreen.value) {
        const pad = 96;
        const fitScale = Math.min(
            (window.innerWidth - pad) / layout.width,
            (window.innerHeight - pad) / layout.height,
            1,
        );
        return (fitScale * zoom.value) / 0.8;
    }

    // Auto-fit to container in normal mode
    if (typeof window !== "undefined" && canvasContainerRef.value) {
        const container = canvasContainerRef.value;
        const padding = 16;
        const availableWidth = container.clientWidth - padding;
        const availableHeight = container.clientHeight - padding;
        const fitScale = Math.min(
            availableWidth / layout.width,
            availableHeight / layout.height,
            1,
        );
        return (fitScale * zoom.value) / 0.8;
    }

    return zoom.value;
});

const canvasStyle = computed(() => ({
    width: layout.width + "px",
    height: layout.height + "px",
    transform: `scale(${scale.value})`,
    transformOrigin: "top left",
}));

const fullscreenCanvasStyle = computed(() => ({
    width: layout.width + "px",
    height: layout.height + "px",
    transform: `scale(${scale.value})`,
    transformOrigin: "center center",
}));

function elementStyle(el: LayoutElement) {
    return {
        left: el.x + "px",
        top: el.y + "px",
        width: el.width + "px",
        height: el.height + "px",
        overflow: "hidden",
    };
}

function textStyle(el: LayoutElement) {
    return {
        fontFamily: el.fontFamily || "var(--font-body)",
        fontSize: (el.fontSize || 24) + "px",
        color: el.color || "#000000",
        fontWeight: el.fontWeight || "400",
        fontStyle: el.fontStyle || "normal",
        textDecoration: el.textDecoration || "none",
        textAlign: el.textAlign || "left",
    };
}

function addTextElement() {
    layout.elements.push({
        type: "text",
        x: 100,
        y: 100,
        width: 300,
        height: 50,
        content: "{{name}}",
        fontSize: 32,
        color: "#000000",
        fontWeight: "700",
        fontStyle: "normal",
        textDecoration: "none",
        textAlign: "left",
    });
    selectedElement.value = layout.elements.length - 1;
}

function addImageElement(event: Event) {
    const select = event.target as HTMLSelectElement;
    const src = select.value;
    if (!src) return;

    layout.elements.push({
        type: "image",
        x: 100,
        y: 100,
        width: 150,
        height: 150,
        src,
    });
    selectedElement.value = layout.elements.length - 1;
    select.value = "";
}

function deleteElement() {
    if (selectedElement.value === null) return;
    layout.elements.splice(selectedElement.value, 1);
    selectedElement.value = null;
}

function showContextMenu(idx: number, event: MouseEvent) {
    selectedElement.value = idx
    contextMenu.value = {
        visible: true,
        x: event.clientX,
        y: event.clientY,
        elementIndex: idx
    }
}

function duplicateElement() {
    if (contextMenu.value.elementIndex === null) return
    
    const original = layout.elements[contextMenu.value.elementIndex]
    const duplicate = JSON.parse(JSON.stringify(original))
    
    // Offset the duplicate slightly
    duplicate.x += 20
    duplicate.y += 20
    
    layout.elements.push(duplicate)
    selectedElement.value = layout.elements.length - 1
    contextMenu.value.visible = false
}

function deleteElementFromContext() {
    if (contextMenu.value.elementIndex === null) return
    
    layout.elements.splice(contextMenu.value.elementIndex, 1)
    selectedElement.value = null
    contextMenu.value.visible = false
}

// Close context menu when clicking outside
function hideContextMenu() {
    contextMenu.value.visible = false
}

onMounted(() => {
    document.addEventListener('click', hideContextMenu)
})

onUnmounted(() => {
    document.removeEventListener('click', hideContextMenu)
})

type ResizeDir = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

let dragState: {
    mode: "move" | "resize";
    idx: number;
    startX: number;
    startY: number;
    elX: number;
    elY: number;
    elW: number;
    elH: number;
    dir?: ResizeDir;
} | null = null;

function startDrag(idx: number, event: MouseEvent) {
    event.preventDefault();
    selectedElement.value = idx;

    const el = layout.elements[idx];
    dragState = {
        mode: "move",
        idx,
        startX: event.clientX,
        startY: event.clientY,
        elX: el.x,
        elY: el.y,
        elW: el.width,
        elH: el.height,
    };

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
}

function startResize(idx: number, dir: ResizeDir, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    selectedElement.value = idx;

    const el = layout.elements[idx];
    dragState = {
        mode: "resize",
        idx,
        startX: event.clientX,
        startY: event.clientY,
        elX: el.x,
        elY: el.y,
        elW: el.width,
        elH: el.height,
        dir,
    };

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
}

function onDrag(event: MouseEvent) {
    if (!dragState) return;

    const dx = (event.clientX - dragState.startX) / scale.value;
    const dy = (event.clientY - dragState.startY) / scale.value;

    if (dragState.mode === "move") {
        layout.elements[dragState.idx].x = Math.round(dragState.elX + dx);
        layout.elements[dragState.idx].y = Math.round(dragState.elY + dy);
    } else if (dragState.mode === "resize" && dragState.dir) {
        const el = layout.elements[dragState.idx];
        const dir = dragState.dir;
        const lockAspectRatio = event.shiftKey;
        const aspectRatio = dragState.elW / dragState.elH;

        if (lockAspectRatio) {
            // Preserve aspect ratio when Shift is held
            if (dir === "e") {
                el.width = Math.max(20, Math.round(dragState.elW + dx));
                el.height = Math.round(el.width / aspectRatio);
            } else if (dir === "w") {
                el.width = Math.max(20, Math.round(dragState.elW - dx));
                el.height = Math.round(el.width / aspectRatio);
                el.x = Math.round(dragState.elX + (dragState.elW - el.width));
            } else if (dir === "s") {
                el.height = Math.max(20, Math.round(dragState.elH + dy));
                el.width = Math.round(el.height * aspectRatio);
            } else if (dir === "n") {
                el.height = Math.max(20, Math.round(dragState.elH - dy));
                el.width = Math.round(el.height * aspectRatio);
                el.y = Math.round(dragState.elY + (dragState.elH - el.height));
            } else if (dir === "se") {
                el.width = Math.max(20, Math.round(dragState.elW + dx));
                el.height = Math.round(el.width / aspectRatio);
            } else if (dir === "sw") {
                el.width = Math.max(20, Math.round(dragState.elW - dx));
                el.height = Math.round(el.width / aspectRatio);
                el.x = Math.round(dragState.elX + (dragState.elW - el.width));
            } else if (dir === "ne") {
                el.width = Math.max(20, Math.round(dragState.elW + dx));
                el.height = Math.round(el.width / aspectRatio);
                el.y = Math.round(dragState.elY + (dragState.elH - el.height));
            } else if (dir === "nw") {
                el.width = Math.max(20, Math.round(dragState.elW - dx));
                el.height = Math.round(el.width / aspectRatio);
                el.x = Math.round(dragState.elX + (dragState.elW - el.width));
                el.y = Math.round(dragState.elY + (dragState.elH - el.height));
            }
        } else {
            // Free resize when Shift not held
            if (dir.includes("e"))
                el.width = Math.max(20, Math.round(dragState.elW + dx));
            if (dir.includes("w")) {
                el.width = Math.max(20, Math.round(dragState.elW - dx));
                el.x = Math.round(dragState.elX + dx);
            }
            if (dir.includes("s"))
                el.height = Math.max(20, Math.round(dragState.elH + dy));
            if (dir.includes("n")) {
                el.height = Math.max(20, Math.round(dragState.elH - dy));
                el.y = Math.round(dragState.elY + dy);
            }
        }
    }
}

function stopDrag() {
    dragState = null;
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
}

async function saveTemplate() {
    if (!templateName.value.trim()) {
        alert("Please enter a template name");
        return;
    }

    saving.value = true;
    try {
        const payload = {
            name: templateName.value,
            layout,
        };

        if (isNew.value) {
            await $fetch("/api/templates", { method: "POST", body: payload });
        } else {
            await $fetch(`/api/templates/${templateId.value}`, {
                method: "PUT",
                body: payload,
            });
        }

        // Clear unsaved changes flag after successful save
        hasUnsavedChanges.value = false
        initialState.value = JSON.stringify({
            name: templateName.value,
            layout: JSON.parse(JSON.stringify(layout))
        })

        router.push("/templates");
    } catch (e) {
        alert("Failed to save template: " + (e as Error).message);
    } finally {
        saving.value = false;
    }
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition:
        transform 0.3s ease,
        opacity 0.3s ease;
}

.slide-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.slide-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

.modal-enter-active {
    transition: opacity 0.2s ease-out;
}
.modal-leave-active {
    transition: opacity 0.15s ease-in;
}
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active > div {
    transition: transform 0.25s var(--ease-spring), opacity 0.2s ease-out;
}
.modal-leave-active > div {
    transition: transform 0.15s ease-in, opacity 0.15s ease-in;
}
.modal-enter-from > div {
    transform: scale(0.95) translateY(8px);
    opacity: 0;
}
.modal-leave-to > div {
    transform: scale(0.95) translateY(8px);
    opacity: 0;
}
</style>
