<template>
    <div class="tp-root">
        <!-- TOP BAR -->
        <header class="tp-topbar">
            <NuxtLink to="/" class="tp-logo">
                <span class="tp-logo-mark">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle
                            cx="12"
                            cy="9.5"
                            r="5.5"
                            stroke="#F5521E"
                            stroke-width="2"
                        />
                        <path
                            d="M9 14l-2 7 5-3 5 3-2-7"
                            stroke="#fff"
                            stroke-width="2"
                            stroke-linejoin="round"
                        />
                    </svg>
                </span>
                <span class="tp-logo-text"
                    >Certif<span class="tp-logo-accent">y</span></span
                >
            </NuxtLink>

            <div class="tp-topbar-divider" />

            <nav class="tp-topbar-nav">
                <NuxtLink to="/templates" class="tp-tab tp-tab--active"
                    >Templates</NuxtLink
                >
                <NuxtLink to="/templates/assets" class="tp-tab"
                    >Assets</NuxtLink
                >
                <NuxtLink to="/generate" class="tp-tab">Generate</NuxtLink>
            </nav>

            <div class="tp-topbar-actions">
                <div class="tp-plan-badge">
                    Free plan · {{ allTemplates.length }}/3 templates
                    <a href="/#pricing" class="tp-plan-upgrade">Upgrade</a>
                </div>
                <button
                    class="tp-btn-new"
                    @click="createNew"
                    @mouseenter="CTA_IN"
                    @mouseleave="CTA_OUT"
                    title="Create new template"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 5v14M5 12h14"
                            stroke="#fff"
                            stroke-width="2.2"
                            stroke-linecap="round"
                        />
                    </svg>
                    New template
                </button>
                <div class="tp-avatar">A</div>
            </div>
        </header>

        <!-- MAIN -->
        <main class="tp-main">
            <!-- title row -->
            <div class="tp-title-row">
                <div>
                    <h1 class="tp-title">My templates</h1>
                    <p class="tp-subtitle">
                        Design once, generate unlimited certificates from each
                        template.
                    </p>
                </div>
                <div class="tp-toolbar">
                    <BaseSearchInput
                        v-model="searchQ"
                        placeholder="Search templates…"
                        @update:model-value="openMenuId = null"
                    />
                    <BaseSelect
                        v-model="sortBy"
                        :options="sortOptions"
                        @update:model-value="openMenuId = null"
                    />
                    <BaseViewToggle v-model="view" />
                </div>
            </div>

            <!-- LOADING -->
            <div v-if="pending" class="tp-loading">Loading templates…</div>

            <!-- EMPTY STATE (none created) -->
            <div v-else-if="allTemplates.length === 0" class="tp-empty-global">
                <div class="tp-empty-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <rect
                            x="3"
                            y="4"
                            width="18"
                            height="15"
                            rx="2"
                            stroke="#6E665E"
                            stroke-width="1.7"
                        />
                        <path
                            d="M3 15l5-4 4 3 4-4 5 4"
                            stroke="#6E665E"
                            stroke-width="1.7"
                            stroke-linejoin="round"
                        />
                    </svg>
                </div>
                <div class="tp-empty-title">No templates yet</div>
                <div class="tp-empty-desc">
                    Create your first certificate template to get started.
                </div>
                <button class="tp-btn-cta" @click="createNew" title="Create your first template">
                    Create your first template
                </button>
            </div>

            <!-- GRID VIEW -->
            <template v-else>
                <div v-if="view === 'grid'" class="tp-grid">
                    <button
                        class="tp-new-card"
                        @click="createNew"
                        @mouseenter="newCardIn"
                        @mouseleave="newCardOut"
                    >
                        <span class="tp-new-card-icon">
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M12 5v14M5 12h14"
                                    stroke="#14110E"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                />
                            </svg>
                        </span>
                        <div>
                            <div class="tp-new-card-title">New template</div>
                            <div class="tp-new-card-sub">
                                Start from scratch
                            </div>
                        </div>
                    </button>

                    <div
                        v-for="t in gridItems"
                        :key="t.id"
                        class="tp-card"
                        :style="{ animationDelay: t._animDelay }"
                    >
                        <div class="tp-card-thumb" @click="openEditor(t.id)">
                            <div class="tp-card-mini">
                                <div
                                    class="tp-mini-accent"
                                    :style="{ background: t.accentColor }"
                                />
                                <div class="tp-mini-label">CERTIFICATE</div>
                                <div class="tp-mini-name">
                                    {{ t.previewName }}
                                </div>
                                <div
                                    class="tp-mini-bar"
                                    :style="{ background: t.accentColor }"
                                />
                                <div class="tp-mini-sub">
                                    for completing the {{ t.name }} program
                                </div>
                                <div class="tp-mini-sigs">
                                    <div class="tp-mini-sig">
                                        {{ t.sigLeft }}
                                    </div>
                                    <div class="tp-mini-sig">
                                        {{ t.sigRight }}
                                    </div>
                                </div>
                            </div>
                            <div class="tp-card-overlay" :data-overlay="t.id">
                                <span class="tp-overlay-pill">
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M4 20l3.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20z"
                                            stroke="#14110E"
                                            stroke-width="1.9"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                    Edit
                                </span>
                            </div>
                            <div class="tp-card-status">
                                <span
                                    class="tp-status-badge"
                                    :class="t._statusClass"
                                    >{{ t.statusLabel }}</span
                                >
                            </div>
                        </div>

                        <div class="tp-card-footer">
                            <div class="tp-card-info">
                                <div class="tp-card-header">
                                    <div class="tp-card-name">{{ t.name }}</div>
                                    <BaseContextMenu>
                                        <template #trigger="{ toggle }">
                                            <button
                                                class="tp-menu-trigger"
                                                @click.stop="toggle"
                                                @mouseenter="SOFT_IN"
                                                @mouseleave="SOFT_OUT"
                                            >
                                                <svg
                                                    width="15"
                                                    height="15"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <circle
                                                        cx="12"
                                                        cy="5"
                                                        r="1.4"
                                                        fill="#6E665E"
                                                    />
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="1.4"
                                                        fill="#6E665E"
                                                    />
                                                    <circle
                                                        cx="12"
                                                        cy="19"
                                                        r="1.4"
                                                        fill="#6E665E"
                                                    />
                                                </svg>
                                            </button>
                                        </template>
                                        <template #default="{ close }">
                                            <button
                                                class="tp-menu-item"
                                                @click.stop="
                                                    openEditor(t.id);
                                                    close();
                                                "
                                                @mouseenter="SOFT_IN"
                                                @mouseleave="SOFT_OUT"
                                            >
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M4 20l3.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20z"
                                                        stroke="#14110E"
                                                        stroke-width="1.8"
                                                        stroke-linejoin="round"
                                                    />
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                class="tp-menu-item"
                                                @click.stop="
                                                    openGenerate(t);
                                                    close();
                                                "
                                                @mouseenter="SOFT_IN"
                                                @mouseleave="SOFT_OUT"
                                            >
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M13 3L5 13h6l-1 8 8-10h-6l1-8z"
                                                        stroke="#14110E"
                                                        stroke-width="1.8"
                                                        stroke-linejoin="round"
                                                    />
                                                </svg>
                                                Generate
                                            </button>
                                            <button
                                                class="tp-menu-item"
                                                @click.stop="
                                                    duplicateTemplate(t);
                                                    close();
                                                "
                                                @mouseenter="SOFT_IN"
                                                @mouseleave="SOFT_OUT"
                                            >
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <rect
                                                        x="8"
                                                        y="8"
                                                        width="12"
                                                        height="12"
                                                        rx="2"
                                                        stroke="#14110E"
                                                        stroke-width="1.8"
                                                    />
                                                    <path
                                                        d="M4 16V5a1 1 0 0 1 1-1h11"
                                                        stroke="#14110E"
                                                        stroke-width="1.8"
                                                    />
                                                </svg>
                                                Duplicate
                                            </button>
                                            <div class="tp-menu-divider" />
                                            <button
                                                class="tp-menu-item tp-menu-item--danger"
                                                @click.stop="
                                                    deleteTemplate(t);
                                                    close();
                                                "
                                                @mouseenter="DEL_IN"
                                                @mouseleave="DEL_OUT"
                                            >
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13"
                                                        stroke="#DC3545"
                                                        stroke-width="1.8"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    />
                                                </svg>
                                                Delete
                                            </button>
                                        </template>
                                    </BaseContextMenu>
                                </div>
                                <div class="tp-card-edited">
                                    Edited {{ t.edited }}
                                </div>
                            </div>

                            <div class="tp-card-stats">
                                <div class="tp-stat">
                                    <svg
                                        width="13"
                                        height="13"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M13 3L5 13h6l-1 8 8-10h-6l1-8z"
                                            stroke="#6E665E"
                                            stroke-width="1.9"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                    <span class="tp-stat-val">{{
                                        t.generated
                                    }}</span>
                                    generated
                                </div>
                                <div class="tp-stat">
                                    <svg
                                        width="13"
                                        height="13"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M4 7h16M4 12h16M4 17h10"
                                            stroke="#6E665E"
                                            stroke-width="1.9"
                                            stroke-linecap="round"
                                        />
                                    </svg>
                                    <span class="tp-stat-val">{{
                                        t.dataRows
                                    }}</span>
                                    rows
                                </div>
                                <button
                                    class="tp-btn-generate"
                                    @click.stop="openGenerate(t)"
                                    @mouseenter="CTA_IN"
                                    @mouseleave="CTA_OUT"
                                >
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M13 3L5 13h6l-1 8 8-10h-6l1-8z"
                                            stroke="#fff"
                                            stroke-width="2"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                    Generate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- LIST VIEW -->
                <div v-else class="tp-list">
                    <div v-for="t in gridItems" :key="t.id" class="tp-row">
                        <div class="tp-row-thumb" @click="openEditor(t.id)">
                            <div class="tp-row-mini">
                                <div class="tp-row-mini-label">CERTIFICATE</div>
                                <div class="tp-row-mini-name">
                                    {{ t.previewName }}
                                </div>
                                <div
                                    class="tp-row-mini-bar"
                                    :style="{ background: t.accentColor }"
                                />
                            </div>
                        </div>
                        <div class="tp-row-info">
                            <div class="tp-row-name-line">
                                <span class="tp-row-name">{{ t.name }}</span>
                                <span
                                    class="tp-status-badge"
                                    :class="t._statusClass"
                                    >{{ t.statusLabel }}</span
                                >
                            </div>
                            <div class="tp-row-edited">
                                Edited {{ t.edited }}
                            </div>
                        </div>
                        <div class="tp-row-stats">
                            <div>
                                <span class="tp-stat-val">{{
                                    t.generated
                                }}</span>
                                generated
                            </div>
                            <div>
                                <span class="tp-stat-val">{{
                                    t.dataRows
                                }}</span>
                                rows
                            </div>
                        </div>
                        <div class="tp-row-actions">
                            <button
                                class="tp-row-btn"
                                @click="openEditor(t.id)"
                                @mouseenter="SOFT_IN"
                                @mouseleave="WHITE_OUT"
                            >
                                <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M4 20l3.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20z"
                                        stroke="#14110E"
                                        stroke-width="1.9"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                Edit
                            </button>
                            <button
                                class="tp-row-btn-accent"
                                @click="openGenerate(t)"
                                @mouseenter="CTA_IN"
                                @mouseleave="CTA_OUT"
                            >
                                <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M13 3L5 13h6l-1 8 8-10h-6l1-8z"
                                        stroke="#fff"
                                        stroke-width="2"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                Generate
                            </button>
                            <BaseContextMenu>
                                <template #trigger="{ toggle }">
                                    <button
                                        class="tp-row-menu-trigger"
                                        @click.stop="toggle"
                                        @mouseenter="SOFT_IN"
                                        @mouseleave="WHITE_OUT"
                                    >
                                        <svg
                                            width="15"
                                            height="15"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <circle
                                                cx="12"
                                                cy="5"
                                                r="1.4"
                                                fill="#6E665E"
                                            />
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="1.4"
                                                fill="#6E665E"
                                            />
                                            <circle
                                                cx="12"
                                                cy="19"
                                                r="1.4"
                                                fill="#6E665E"
                                            />
                                        </svg>
                                    </button>
                                </template>
                                <template #default="{ close }">
                                    <button
                                        class="tp-menu-item"
                                        @click.stop="
                                            openEditor(t.id);
                                            close();
                                        "
                                        @mouseenter="SOFT_IN"
                                        @mouseleave="SOFT_OUT"
                                    >
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M4 20l3.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20z"
                                                stroke="#14110E"
                                                stroke-width="1.8"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        class="tp-menu-item"
                                        @click.stop="
                                            openGenerate(t);
                                            close();
                                        "
                                        @mouseenter="SOFT_IN"
                                        @mouseleave="SOFT_OUT"
                                    >
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M13 3L5 13h6l-1 8 8-10h-6l1-8z"
                                                stroke="#14110E"
                                                stroke-width="1.8"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                        Generate
                                    </button>
                                    <button
                                        class="tp-menu-item"
                                        @click.stop="
                                            duplicateTemplate(t);
                                            close();
                                        "
                                        @mouseenter="SOFT_IN"
                                        @mouseleave="SOFT_OUT"
                                    >
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <rect
                                                x="8"
                                                y="8"
                                                width="12"
                                                height="12"
                                                rx="2"
                                                stroke="#14110E"
                                                stroke-width="1.8"
                                            />
                                            <path
                                                d="M4 16V5a1 1 0 0 1 1-1h11"
                                                stroke="#14110E"
                                                stroke-width="1.8"
                                            />
                                        </svg>
                                        Duplicate
                                    </button>
                                    <div class="tp-menu-divider" />
                                    <button
                                        class="tp-menu-item tp-menu-item--danger"
                                        @click.stop="
                                            deleteTemplate(t);
                                            close();
                                        "
                                        @mouseenter="DEL_IN"
                                        @mouseleave="DEL_OUT"
                                    >
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13"
                                                stroke="#DC3545"
                                                stroke-width="1.8"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                        Delete
                                    </button>
                                </template>
                            </BaseContextMenu>
                        </div>
                    </div>
                </div>

                <!-- EMPTY STATE (search, no match) -->
                <div
                    v-if="gridItems.length === 0 && searchQ"
                    class="tp-empty-search"
                >
                    <div class="tp-empty-icon">
                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                cx="11"
                                cy="11"
                                r="7"
                                stroke="#6E665E"
                                stroke-width="1.8"
                            />
                            <path
                                d="M20 20l-3-3"
                                stroke="#6E665E"
                                stroke-width="1.8"
                                stroke-linecap="round"
                            />
                        </svg>
                    </div>
                    <div class="tp-empty-title">
                        No templates match "{{ searchQ }}"
                    </div>
                    <div class="tp-empty-desc">
                        Try a different name or clear the search.
                    </div>
                    <button class="tp-btn-clear" @click="searchQ = ''">
                        Clear search
                    </button>
                </div>
            </template>
        </main>

        <!-- GENERATE MODAL -->
        <Teleport to="body">
            <Transition name="gmodal">
                <div
                    v-if="showGenModal"
                    class="tp-modal-overlay"
                    @click.self="showGenModal = false"
                >
                    <div class="tp-modal" @click.stop>
                        <div class="tp-modal-head">
                            <div class="tp-modal-title">Generate batch</div>
                            <button
                                class="tp-modal-close"
                                @click="showGenModal = false"
                            >
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M6 6l12 12M18 6L6 18"
                                        stroke="#14110E"
                                        stroke-width="1.9"
                                        stroke-linecap="round"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div class="tp-modal-sub">
                            Generating for "{{ genTarget?.name }}"
                        </div>

                        <div class="tp-modal-body">
                            <div class="tp-modal-field">
                                <div class="tp-modal-field-label">
                                    Data source
                                </div>
                                <div class="tp-modal-field-box">
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M4 7h16M4 12h16M4 17h10"
                                            stroke="#F5521E"
                                            stroke-width="1.9"
                                            stroke-linecap="round"
                                        />
                                    </svg>
                                    <div>
                                        <div class="tp-modal-field-name">
                                            attendees.csv
                                        </div>
                                        <div class="tp-modal-field-meta">
                                            {{ genTarget?.dataRows || 0 }} rows
                                            · 3 columns
                                        </div>
                                    </div>
                                    <button class="tp-modal-field-replace">
                                        Replace
                                    </button>
                                </div>
                            </div>

                            <div class="tp-modal-field">
                                <div class="tp-modal-field-label">
                                    Export format
                                </div>
                                <div class="tp-modal-formats">
                                    <button
                                        class="tp-fmt-btn"
                                        :class="{
                                            'tp-fmt-btn--active':
                                                genFormat === 'pdf',
                                        }"
                                        @click="genFormat = 'pdf'"
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M7 3h7l4 4v14H7z"
                                                stroke="currentColor"
                                                stroke-width="1.8"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M10 13h1.5a1 1 0 0 1 0 2H10v-2zm0 0v-2h1.5a1 1 0 0 1 0 2"
                                                stroke="currentColor"
                                                stroke-width="1.4"
                                            />
                                        </svg>
                                        PDF
                                    </button>
                                    <button
                                        class="tp-fmt-btn"
                                        :class="{
                                            'tp-fmt-btn--active':
                                                genFormat === 'png',
                                        }"
                                        @click="genFormat = 'png'"
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <rect
                                                x="3"
                                                y="4"
                                                width="18"
                                                height="16"
                                                rx="2"
                                                stroke="currentColor"
                                                stroke-width="1.8"
                                            />
                                            <path
                                                d="M3 16l5-4 4 3 4-4 5 4"
                                                stroke="currentColor"
                                                stroke-width="1.8"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                        PNG
                                    </button>
                                </div>
                            </div>

                            <div class="tp-modal-watermark">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                        stroke="#F5521E"
                                        stroke-width="1.8"
                                    />
                                    <path
                                        d="M12 8v5M12 16v.5"
                                        stroke="#F5521E"
                                        stroke-width="1.9"
                                        stroke-linecap="round"
                                    />
                                </svg>
                                <div>
                                    Free plan exports include a small watermark.
                                    <a href="/#pricing">Upgrade to Pro</a> to
                                    remove it.
                                </div>
                            </div>
                        </div>

                        <div class="tp-modal-footer">
                            <button
                                class="tp-modal-btn-cancel"
                                @click="showGenModal = false"
                            >
                                Cancel
                            </button>
                            <button
                                class="tp-modal-btn-run"
                                @click="runGenerate"
                                @mouseenter="CTA_IN"
                                @mouseleave="CTA_OUT"
                            >
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M13 3L5 13h6l-1 8 8-10h-6l1-8z"
                                        stroke="#fff"
                                        stroke-width="1.9"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                Generate {{ genTarget?.dataRows || 0 }} PDFs
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- TOAST -->
        <BaseToast :visible="toastVisible" :icon-color="toastIconColor">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                    d="M5 12l4.5 4.5L19 7"
                    :stroke="toastIconColor"
                    stroke-width="2.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
            {{ toastMessage }}
        </BaseToast>

        <!-- DELETE CONFIRMATION -->
        <Teleport to="body">
            <Transition name="gmodal">
                <div
                    v-if="showDeleteModal"
                    class="tp-modal-overlay"
                    @click.self="cancelDelete"
                >
                    <div class="tp-modal tp-modal--delete" @click.stop>
                        <div class="tp-modal-title">Delete Template</div>
                        <p
                            class="tp-modal-sub"
                            style="
                                margin-bottom: 20px;
                                color: var(--tp-muted);
                                font-size: 14px;
                            "
                        >
                            Are you sure you want to delete
                            <strong>"{{ deletingTemplate?.name }}"</strong>?
                            This cannot be undone.
                        </p>
                        <div class="tp-modal-footer">
                            <button
                                class="tp-modal-btn-cancel"
                                @click="cancelDelete"
                            >
                                Cancel
                            </button>
                            <button
                                class="tp-modal-btn-delete"
                                :disabled="deleting"
                                @click="confirmDelete"
                            >
                                {{ deleting ? "Deleting..." : "Delete" }}
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";

const { data: templates, pending, refresh } = await useFetch("/api/templates");

const view = ref<"grid" | "list">("grid");
const sortBy = ref("recent");
const sortOptions = [
    { value: "recent", label: "Recently edited" },
    { value: "name", label: "Name A–Z" },
    { value: "generated", label: "Most generated" },
];
const searchQ = ref("");
const showGenModal = ref(false);
const genTarget = ref<any>(null);
const genFormat = ref<"pdf" | "png">("pdf");
const openMenuId = ref<string | null>(null);
const toastMessage = ref("");
const toastVisible = ref(false);
const toastIconColor = ref("#F5521E");
let toastTimer: ReturnType<typeof setTimeout> | null = null;

const showDeleteModal = ref(false);
const deleting = ref(false);
const deletingTemplate = ref<any>(null);

const {
    softIn: SOFT_IN,
    softOut: SOFT_OUT,
    whiteOut: WHITE_OUT,
    ctaIn: CTA_IN,
    ctaOut: CTA_OUT,
    delHoverIn: DEL_IN,
    delHoverOut: DEL_OUT,
} = useHoverIntents();

const allTemplates = computed(() => (templates.value as any[]) || []);

const gridItems = computed(() => {
    let list = allTemplates.value.map((t, i) => {
        let elementCount = 0;
        try {
            const layout =
                typeof t.layout === "string" ? JSON.parse(t.layout) : t.layout;
            elementCount = layout?.elements?.length || 0;
        } catch {}
        const status: "active" | "draft" =
            elementCount > 0 ? "active" : "draft";
        const edited = formatRelative(t.updatedAt);
        const accentColor = "#F5521E";
        const previewName = "Preview";
        return {
            id: t.id,
            name: t.name,
            status,
            statusLabel: status === "active" ? "Active" : "Draft",
            _statusClass:
                status === "active" ? "tp-sts-active" : "tp-sts-draft",
            edited,
            generated: "0",
            dataRows: String(elementCount || 1),
            accentColor,
            previewName,
            sigLeft: "A. Rivera",
            sigRight: "M. Chen",
            _animDelay: `${i * 0.05}s`,
        };
    });

    const q = searchQ.value.toLowerCase().trim();
    if (q) list = list.filter((t) => t.name.toLowerCase().includes(q));

    if (sortBy.value === "name")
        list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy.value === "generated") list.sort((a, b) => b.id - a.id);

    return list;
});

function formatRelative(date: any): string {
    if (!date) return "";
    const d = new Date(date);
    const now = Date.now();
    const diff = now - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
}

function createNew() {
    navigateTo("/templates/new");
}

function openEditor(id: string | number) {
    navigateTo(`/templates/${id}`);
}

function openGenerate(t: any) {
    genTarget.value = t;
    showGenModal.value = true;
}

function runGenerate() {
    showGenModal.value = false;
    showToast(
        `Generating ${genTarget.value?.dataRows || 0} ${genFormat.value.toUpperCase()} files…`,
    );
}

async function duplicateTemplate(t: any) {
    try {
        const original = allTemplates.value.find((x: any) => x.id === t.id);
        if (!original) return;
        const layout =
            typeof original.layout === "string"
                ? JSON.parse(original.layout)
                : original.layout;
        await $fetch("/api/templates", {
            method: "POST",
            body: { name: `${original.name} (copy)`, layout },
        });
        showToast(`"${t.name}" duplicated`);
        refresh();
    } catch {
        showToast("Failed to duplicate", true);
    }
}

function deleteTemplate(t: any) {
    deletingTemplate.value = t;
    showDeleteModal.value = true;
}

function cancelDelete() {
    showDeleteModal.value = false;
    deletingTemplate.value = null;
}

async function confirmDelete() {
    if (!deletingTemplate.value) return;
    deleting.value = true;
    try {
        await $fetch(`/api/templates/${deletingTemplate.value.id}`, {
            method: "DELETE",
        });
        showDeleteModal.value = false;
        deletingTemplate.value = null;
        showToast("Template deleted");
        refresh();
    } catch {
        showToast("Failed to delete", true);
    } finally {
        deleting.value = false;
    }
}

function showToast(msg: string, isError = false) {
    toastMessage.value = msg;
    toastVisible.value = true;
    toastIconColor.value = isError ? "#EF4444" : "#F5521E";
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toastVisible.value = false;
    }, 2400);
}

function newCardIn(e: MouseEvent) {
    (e.currentTarget as HTMLElement).style.borderColor = "#F5521E";
    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.9)";
}
function newCardOut(e: MouseEvent) {
    (e.currentTarget as HTMLElement).style.borderColor = "rgba(20,17,14,0.18)";
    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.5)";
}

onUnmounted(() => {
    if (toastTimer) clearTimeout(toastTimer);
});
</script>

<style scoped>
.tp-root {
    --tp-accent: #f5521e;
    --tp-ink: #14110e;
    --tp-muted: #6e665e;
    --tp-cream: #f2ece7;
    --tp-line: rgba(20, 17, 14, 0.09);
    --tp-surface: #fff;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--tp-cream);
    font-family: "General Sans", system-ui, sans-serif;
    color: var(--tp-ink);
    -webkit-font-smoothing: antialiased;
}

::selection {
    background: #f5521e;
    color: #fff;
}

/* ── Top bar ── */
.tp-topbar {
    position: sticky;
    top: 0;
    flex: 0 0 auto;
    height: 58px;
    background: rgba(255, 255, 255, 0.86);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--tp-line);
    display: flex;
    align-items: center;
    padding: 0 28px;
    gap: 16px;
    z-index: 30;
}
.tp-logo {
    display: flex;
    align-items: center;
    gap: 9px;
    text-decoration: none;
    color: var(--tp-ink);
}
.tp-logo-mark {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: var(--tp-ink);
}
.tp-logo-text {
    font-weight: 600;
    font-size: 15px;
}
.tp-logo-accent {
    color: var(--tp-accent);
}
.tp-topbar-divider {
    width: 1px;
    height: 24px;
    background: var(--tp-line);
}
.tp-topbar-nav {
    display: flex;
    align-items: center;
    gap: 2px;
}
.tp-tab {
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    color: var(--tp-muted);
    padding: 8px 13px;
    border-radius: 8px;
    transition:
        background 0.15s,
        color 0.15s;
}
.tp-tab:hover {
    background: rgba(20, 17, 14, 0.05);
    color: var(--tp-ink);
}
.tp-tab--active {
    font-weight: 600;
    color: var(--tp-ink);
    background: rgba(20, 17, 14, 0.06);
}
.tp-topbar-actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 10px;
}
.tp-plan-badge {
    display: flex;
    align-items: center;
    gap: 7px;
    background: #fff4f0;
    border: 1px solid rgba(245, 82, 30, 0.2);
    padding: 7px 8px 7px 13px;
    border-radius: 999px;
    font-size: 12.5px;
    font-weight: 500;
    color: var(--tp-accent);
}
.tp-plan-upgrade {
    text-decoration: none;
    background: var(--tp-ink);
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 11px;
    border-radius: 999px;
}
.tp-btn-new {
    border: none;
    background: var(--tp-ink);
    color: #fff;
    font-family: inherit;
    font-size: 13.5px;
    font-weight: 600;
    padding: 10px 17px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 6px 18px rgba(20, 17, 14, 0.18);
    transition: transform 0.2s;
}
.tp-avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f5521e, #ff8a5b);
    display: grid;
    place-items: center;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
}

/* ── Main ── */
.tp-main {
    flex: 1;
    padding: 32px 32px 64px;
    max-width: 1240px;
    margin: 0 auto;
    width: 100%;
    overflow-y: auto;
}
.tp-main::-webkit-scrollbar {
    width: 8px;
}
.tp-main::-webkit-scrollbar-thumb {
    background: rgba(20, 17, 14, 0.14);
    border-radius: 8px;
}
.tp-main::-webkit-scrollbar-track {
    background: transparent;
}

.tp-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 26px;
}
.tp-title {
    margin: 0;
    font-size: 26px;
    font-weight: 600;
    letter-spacing: -0.025em;
}
.tp-subtitle {
    margin: 6px 0 0;
    font-size: 14px;
    color: var(--tp-muted);
}
.tp-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
}
.tp-search {
    display: flex;
    align-items: center;
    gap: 9px;
    background: #fff;
    border: 1px solid var(--tp-line);
    border-radius: 10px;
    padding: 9px 13px;
}
.tp-search-input {
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: 13.5px;
    color: var(--tp-ink);
    width: 170px;
}
.tp-sort {
    border: 1px solid var(--tp-line);
    background: #fff;
    border-radius: 10px;
    padding: 9px 12px;
    font-family: inherit;
    font-size: 13.5px;
    color: var(--tp-ink);
    outline: none;
    cursor: pointer;
    box-sizing: border-box;
}

.tp-loading {
    text-align: center;
    padding: 80px 24px;
    font-size: 15px;
    color: var(--tp-muted);
}

/* ── Empty (global) ── */
.tp-empty-global {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 24px;
    text-align: center;
}
.tp-empty-icon {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    background: #fff;
    border: 1px solid var(--tp-line);
    box-shadow: 0 8px 24px rgba(20, 17, 14, 0.06);
    display: grid;
    place-items: center;
    margin-bottom: 18px;
}
.tp-empty-title {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 6px;
}
.tp-empty-desc {
    font-size: 14px;
    color: var(--tp-muted);
    margin-bottom: 18px;
}
.tp-btn-cta {
    border: none;
    background: var(--tp-accent);
    color: #fff;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    padding: 12px 24px;
    border-radius: 11px;
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(245, 82, 30, 0.3);
    transition: transform 0.2s;
}
.tp-btn-cta:hover {
    transform: translateY(-1px);
}

/* ── Empty (search) ── */
.tp-empty-search {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 24px;
    text-align: center;
}
.tp-btn-clear {
    border: 1px solid var(--tp-line);
    background: #fff;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    padding: 10px 18px;
    border-radius: 9px;
    cursor: pointer;
    margin-top: 16px;
}

/* ── Grid ── */
.tp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

/* ── New card ── */
.tp-new-card {
    border: 1.5px dashed rgba(20, 17, 14, 0.18);
    background: rgba(255, 255, 255, 0.5);
    border-radius: 18px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 32px 20px;
    transition:
        border-color 0.2s,
        background 0.2s;
    font-family: inherit;
}
.tp-new-card-icon {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: #fff;
    border: 1px solid var(--tp-line);
    box-shadow: 0 4px 14px rgba(20, 17, 14, 0.07);
}
.tp-new-card-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--tp-ink);
}
.tp-new-card-sub {
    font-size: 12.5px;
    color: var(--tp-muted);
    margin-top: 3px;
}

/* ── Template card ── */
.tp-card {
    background: #fff;
    border: 1px solid rgba(20, 17, 14, 0.09);
    border-radius: 18px;
    overflow: visible;
    box-shadow: 0 6px 22px rgba(20, 17, 14, 0.06);
    animation: tp-popIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
    position: relative;
    display: flex;
    flex-direction: column;
}
@keyframes tp-popIn {
    0% {
        transform: scale(0.92) translateY(12px);
        opacity: 0;
    }
    70% {
        transform: scale(1.01) translateY(-2px);
    }
    100% {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
}

.tp-card-thumb {
    position: relative;
    cursor: pointer;
    overflow: hidden;
    border-radius: 12px 12px 0 0;
    background: #f7f4f1;
    aspect-ratio: 1.55;
}
.tp-card-mini {
    position: absolute;
    inset: 14px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 4px 16px rgba(20, 17, 14, 0.12);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 12px;
}
.tp-mini-accent {
    width: 24px;
    height: 2.5px;
    border-radius: 2px;
    margin-bottom: 3px;
}
.tp-mini-label {
    font-size: 6px;
    letter-spacing: 0.2em;
    color: #9e9389;
    text-transform: uppercase;
    font-weight: 600;
}
.tp-mini-name {
    font-family: "Playfair Display", serif;
    font-size: 12px;
    font-weight: 600;
    color: #14110e;
    text-align: center;
    line-height: 1.2;
}
.tp-mini-bar {
    width: 36px;
    height: 1.5px;
    border-radius: 1px;
}
.tp-mini-sub {
    font-size: 5.5px;
    color: #9e9389;
    text-align: center;
    line-height: 1.4;
    max-width: 100px;
}
.tp-mini-sigs {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-top: 6px;
    border-top: 1px solid rgba(20, 17, 14, 0.07);
}
.tp-mini-sig {
    font-family: "Allura", cursive;
    font-size: 10px;
    color: #14110e;
}

.tp-card-overlay {
    position: absolute;
    inset: 0;
    background: rgba(20, 17, 14, 0.42);
    backdrop-filter: blur(2px);
    border-radius: 12px 12px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    cursor: pointer;
}
.tp-card:hover .tp-card-overlay,
.tp-card-thumb:hover .tp-card-overlay {
    opacity: 1;
}

.tp-overlay-pill {
    background: #fff;
    color: var(--tp-ink);
    font-size: 13px;
    font-weight: 600;
    padding: 10px 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    gap: 7px;
}
.tp-card-status {
    position: absolute;
    top: 10px;
    left: 10px;
}

.tp-status-badge {
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 999px;
    letter-spacing: 0.02em;
}
.tp-sts-active {
    background: rgba(31, 138, 91, 0.12);
    color: #1f8a5b;
}
.tp-sts-draft {
    background: rgba(20, 17, 14, 0.08);
    color: #6e665e;
}

.tp-card-footer {
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
}
.tp-card-info {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
}
.tp-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    min-width: 0;
    flex: 1;
}
.tp-card-name {
    font-size: 14.5px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
}
.tp-card-edited {
    font-size: 12px;
    color: var(--tp-muted);
    margin-top: 3px;
}

.tp-menu-trigger {
    border: none;
    background: transparent;
    cursor: pointer;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
}
.tp-menu-item {
    width: 100%;
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: inherit;
    font-size: 13.5px;
    font-weight: 500;
    padding: 9px 12px;
    border-radius: 8px;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 9px;
    color: var(--tp-ink);
}
.tp-menu-item--danger {
    color: #dc3545;
}
.tp-menu-divider {
    height: 1px;
    background: var(--tp-line);
    margin: 4px 0;
}

.tp-card-stats {
    margin-top: 12px;
    display: flex;
    align-items: center;
    gap: 14px;
    padding-top: 12px;
    border-top: 1px solid var(--tp-line);
}
.tp-stat {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: var(--tp-muted);
}
.tp-stat-val {
    font-weight: 600;
    color: var(--tp-ink);
}
.tp-btn-generate {
    margin-left: auto;
    border: none;
    background: var(--tp-accent);
    color: #fff;
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    padding: 7px 13px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: transform 0.15s;
}

/* ── List view ── */
.tp-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.tp-row {
    background: #fff;
    border: 1px solid rgba(20, 17, 14, 0.09);
    border-radius: 14px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 18px;
    box-shadow: 0 2px 10px rgba(20, 17, 14, 0.04);
}
.tp-row-thumb {
    flex: 0 0 auto;
    width: 96px;
    height: 62px;
    background: #f7f4f1;
    border-radius: 9px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}
.tp-row-mini {
    width: 76px;
    height: 50px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 8px rgba(20, 17, 14, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 5px;
}
.tp-row-mini-label {
    font-size: 4px;
    letter-spacing: 0.2em;
    color: #9e9389;
    text-transform: uppercase;
    font-weight: 600;
}
.tp-row-mini-name {
    font-family: "Playfair Display", serif;
    font-size: 7px;
    font-weight: 600;
    color: #14110e;
}
.tp-row-mini-bar {
    width: 28px;
    height: 1.5px;
    border-radius: 1px;
}
.tp-row-info {
    flex: 1;
    min-width: 0;
}
.tp-row-name-line {
    display: flex;
    align-items: center;
    gap: 10px;
}
.tp-row-name {
    font-size: 15px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.tp-row-edited {
    font-size: 12.5px;
    color: var(--tp-muted);
    margin-top: 3px;
}
.tp-row-stats {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 20px;
    font-size: 13px;
    color: var(--tp-muted);
}
.tp-row-actions {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 8px;
}
.tp-row-btn {
    border: 1px solid var(--tp-line);
    background: #fff;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 14px;
    border-radius: 9px;
    cursor: pointer;
    color: var(--tp-ink);
    display: flex;
    align-items: center;
    gap: 6px;
}
.tp-row-btn-accent {
    border: none;
    background: var(--tp-accent);
    color: #fff;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    padding: 9px 15px;
    border-radius: 9px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.15s;
}
.tp-row-menu-trigger {
    border: 1px solid var(--tp-line);
    background: #fff;
    cursor: pointer;
    width: 36px;
    height: 36px;
    border-radius: 9px;
    display: grid;
    place-items: center;
}

/* ── Generate modal ── */
.tp-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(20, 17, 14, 0.44);
    backdrop-filter: blur(4px);
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
}
.tp-modal {
    background: #fff;
    border-radius: 24px;
    padding: 32px;
    width: 500px;
    box-shadow: 0 40px 80px rgba(20, 17, 14, 0.26);
    animation: tp-popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.tp-modal--delete {
    width: 420px;
}
.tp-modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
}
.tp-modal-title {
    font-size: 18px;
    font-weight: 600;
}
.tp-modal-close {
    border: none;
    background: var(--tp-cream);
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: grid;
    place-items: center;
}
.tp-modal-sub {
    font-size: 14px;
    color: var(--tp-muted);
    margin-bottom: 22px;
}
.tp-modal-body {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.tp-modal-field-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--tp-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
}
.tp-modal-field-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f7f4f1;
    border: 1px solid var(--tp-line);
    border-radius: 11px;
    padding: 12px 14px;
}
.tp-modal-field-name {
    font-size: 13.5px;
    font-weight: 600;
}
.tp-modal-field-meta {
    font-size: 11.5px;
    color: var(--tp-muted);
}
.tp-modal-field-replace {
    margin-left: auto;
    border: 1px solid var(--tp-line);
    background: #fff;
    font-family: inherit;
    font-size: 12.5px;
    font-weight: 600;
    padding: 7px 12px;
    border-radius: 8px;
    cursor: pointer;
}
.tp-modal-formats {
    display: flex;
    gap: 9px;
}
.tp-fmt-btn {
    flex: 1;
    border: 1px solid rgba(20, 17, 14, 0.09);
    background: #fff;
    cursor: pointer;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    padding: 11px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--tp-ink);
    transition: all 0.15s;
}
.tp-fmt-btn--active {
    border: 2px solid var(--tp-accent);
    background: #fff4f0;
    color: var(--tp-accent);
}
.tp-modal-watermark {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    background: #fff4f0;
    border: 1px solid rgba(245, 82, 30, 0.2);
    border-radius: 11px;
    padding: 12px 14px;
    font-size: 12.5px;
    color: #7a3018;
    line-height: 1.45;
}
.tp-modal-watermark a {
    color: var(--tp-accent);
    font-weight: 600;
    text-decoration: none;
}
.tp-modal-footer {
    margin-top: 22px;
    display: flex;
    gap: 9px;
}
.tp-modal-btn-cancel {
    flex: 1;
    border: 1px solid var(--tp-line);
    background: #fff;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    padding: 13px;
    border-radius: 11px;
    cursor: pointer;
}
.tp-modal-btn-run {
    flex: 2;
    border: none;
    background: var(--tp-accent);
    color: #fff;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    padding: 13px;
    border-radius: 11px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 8px 20px rgba(245, 82, 30, 0.3);
    transition: transform 0.2s;
}
.tp-modal-btn-delete {
    flex: 1;
    border: none;
    background: #ef4444;
    color: #fff;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    padding: 13px;
    border-radius: 11px;
    cursor: pointer;
}
.tp-modal-btn-delete:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* modal transition */
.gmodal-enter-active {
    transition: opacity 0.2s ease-out;
}
.gmodal-enter-active .tp-modal {
    transition:
        transform 0.25s ease-out,
        opacity 0.2s ease-out;
}
.gmodal-leave-active {
    transition: opacity 0.15s ease-in;
}
.gmodal-leave-active .tp-modal {
    transition:
        transform 0.15s ease-in,
        opacity 0.15s ease-in;
}
.gmodal-enter-from {
    opacity: 0;
}
.gmodal-enter-from .tp-modal {
    transform: scale(0.95) translateY(8px);
    opacity: 0;
}
.gmodal-leave-to {
    opacity: 0;
}
.gmodal-leave-to .tp-modal {
    transform: scale(0.95) translateY(8px);
    opacity: 0;
}
</style>
