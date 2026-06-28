<template>
    <div class="page">
        <!-- Hero -->
        <section class="hero-section">
            <div class="hero-content">
                <div class="brand-mark anim-float">
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                </div>
                <p class="brand-subtitle anim-fade-up">Certificate Generator</p>

                <h1
                    class="hero-headline anim-fade-up"
                    style="animation-delay: 100ms"
                >
                    Design once.<br />
                    <span class="headline-accent">Generate for </span>
                    <span class="headline-rotator">
                        <Transition name="rotator" mode="out-in">
                            <span
                                :key="rotatorIndex"
                                class="headline-rotator__word"
                                >{{ currentWord }}</span
                            >
                        </Transition>
                    </span>
                </h1>

                <p
                    class="hero-subtext anim-fade-up"
                    style="animation-delay: 200ms"
                >
                    Drag-and-drop templates. CSV data. Production-ready PDFs in
                    seconds.
                </p>

                <div
                    class="hero-cta anim-fade-up"
                    style="animation-delay: 300ms"
                >
                    <NuxtLink
                        to="/templates"
                        class="btn-primary btn-lg btn-shimmer"
                    >
                        Start Creating
                    </NuxtLink>
                    <NuxtLink to="/templates" class="btn-ghost">
                        Explore templates →
                    </NuxtLink>
                </div>
            </div>

            <div class="hero-scroll-hint">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M12 5v14" />
                    <path d="M19 12l-7 7-7-7" />
                </svg>
            </div>
        </section>

        <!-- Stats Bar -->
        <section
            ref="statsRef"
            class="stats-section"
            :class="{ 'is-revealed': revealed.stats }"
        >
            <div class="stats-row">
                <div class="stat-item">
                    <span class="stat-number">Drag &amp; Drop</span>
                    <span class="stat-label">position every element</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                    <span class="stat-number">CSV &amp; JSON</span>
                    <span class="stat-label">bulk data import</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                    <span class="stat-number">PDF &amp; PNG</span>
                    <span class="stat-label">production-ready output</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                    <span class="stat-number">Fully Local</span>
                    <span class="stat-label">no keys · no limits</span>
                </div>
            </div>
        </section>

        <!-- Capabilities Grid -->
        <section class="capabilities-section">
            <h2
                class="section-heading"
                :class="{ 'is-revealed': revealed.heading }"
                data-reveal="heading"
            >
                Everything you need to<br /><span
                    class="section-heading__accent"
                    >create certificates at scale</span
                >
            </h2>

            <div class="capabilities-grid">
                <NuxtLink
                    v-for="(cap, i) in capabilities"
                    :key="cap.to"
                    :to="cap.to"
                    class="capability-card"
                    :class="{ 'is-revealed': revealed.capabilities[i] }"
                    :style="{ transitionDelay: `${i * 80}ms` }"
                    :data-reveal="'cap'"
                    :data-cap-index="i"
                >
                    <div :class="['capability-icon', cap.iconClass]">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            v-html="cap.icon"
                        ></svg>
                    </div>
                    <h3 class="capability-title">{{ cap.title }}</h3>
                    <p class="capability-desc">{{ cap.desc }}</p>
                    <ul class="capability-list">
                        <li v-for="item in cap.items" :key="item">
                            {{ item }}
                        </li>
                    </ul>
                </NuxtLink>
            </div>
        </section>

        <!-- How It Works -->
        <section class="workflow-section">
            <h2
                class="section-heading"
                :class="{ 'is-revealed': revealed.howHeading }"
                data-reveal="how-heading"
            >
                How it works
            </h2>
            <div ref="workflowRef" class="workflow-steps">
                <div
                    v-for="(step, i) in workflowSteps"
                    :key="i"
                    class="workflow-step"
                    :class="{ 'is-revealed': revealed.steps[i] }"
                    :data-reveal="'step'"
                    :data-step-index="i"
                >
                    <div class="step-marker">
                        <span class="step-number">{{ i + 1 }}</span>
                        <span
                            v-if="i < workflowSteps.length - 1"
                            class="step-line"
                        ></span>
                    </div>
                    <div class="step-body">
                        <h3 class="step-title">{{ step.title }}</h3>
                        <p class="step-desc">{{ step.desc }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <section
            ref="ctaRef"
            class="cta-section"
            :class="{ 'is-revealed': revealed.cta }"
        >
            <div class="cta-content">
                <h2 class="cta-headline">
                    Ready to create<br />
                    <span class="cta-headline-accent"
                        >certificates at scale?</span
                    >
                </h2>
                <p class="cta-subtext">
                    No sign-up. No API keys. Everything runs in your browser.
                </p>
                <NuxtLink
                    to="/templates"
                    class="btn-primary btn-lg btn-shimmer"
                >
                    Start Creating
                </NuxtLink>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";

const prefersReducedMotion = ref(false);

let mq: MediaQueryList | null = null;

onMounted(() => {
    mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.value = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
        prefersReducedMotion.value = e.matches;
    };
    mq.addEventListener("change", handler);
    onUnmounted(() => {
        mq?.removeEventListener("change", handler);
    });
});

// Rotating words
const rotatorWords = ["awards", "certification", "completion", "assessment"];
const rotatorIndex = ref(-1);
const currentWord = computed(() =>
    rotatorIndex.value >= 0 ? rotatorWords[rotatorIndex.value] : "",
);
let rotatorTimer: ReturnType<typeof setInterval> | null = null;

onMounted(async () => {
    await nextTick();
    rotatorIndex.value = 0;
    rotatorTimer = setInterval(() => {
        rotatorIndex.value = (rotatorIndex.value + 1) % rotatorWords.length;
    }, 2000);
});
onUnmounted(() => {
    if (rotatorTimer) clearInterval(rotatorTimer);
});

// Capabilities data
const capabilities = [
    {
        to: "/templates",
        iconClass: "",
        icon: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>',
        title: "Template Editor",
        desc: "Canvas-based drag-and-drop editor. Text, images, logos, backgrounds. Pixel-perfect placement.",
        items: [
            "Drag-and-drop elements",
            "Custom fonts support",
            "Background images & colors",
        ],
    },
    {
        to: "/generate",
        iconClass: "capability-icon--accent",
        icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
        title: "Bulk Generate",
        desc: "Upload CSV or paste JSON. Map columns to template fields. Download a ZIP with every certificate.",
        items: [
            "CSV & JSON data sources",
            "Field-to-column mapping",
            "ZIP download of all files",
        ],
    },
    {
        to: "/templates/assets",
        iconClass: "capability-icon--secondary",
        icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
        title: "Asset Library",
        desc: "Logos, backgrounds, free images. Drag in any file, categorized automatically for every template.",
        items: [
            "Logo & image uploads",
            "Background library",
            "Free image assets included",
        ],
    },
    {
        to: "/templates/fonts",
        iconClass: "capability-icon--tertiary",
        icon: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>',
        title: "Custom Fonts",
        desc: "Upload TTF, OTF, WOFF fonts. Use any typeface for titles, names, and body text.",
        items: [
            "TTF, OTF, WOFF support",
            "Per-element font selection",
            "Unlimited font uploads",
        ],
    },
];

const workflowSteps = [
    {
        title: "Design your template",
        desc: "Use the canvas editor to place text fields, images, and logos. Position every element with pixel precision. Set fonts, colors, and backgrounds.",
    },
    {
        title: "Upload recipient data",
        desc: "Paste JSON or upload a CSV file. Map columns to template placeholders. Preview before generating to catch any errors.",
    },
    {
        title: "Download & distribute",
        desc: "Choose PDF or PNG output, set resolution, and download all certificates as a single ZIP. Print-ready or email-ready in seconds.",
    },
];

// Scroll-triggered reveals
const statsRef = ref<HTMLElement | null>(null);
const workflowRef = ref<HTMLElement | null>(null);
const ctaRef = ref<HTMLElement | null>(null);

const revealed = ref<Record<string, boolean | boolean[]>>({
    stats: false,
    heading: false,
    capabilities: [false, false, false, false],
    howHeading: false,
    steps: [false, false, false],
    cta: false,
});

let observer: IntersectionObserver | null = null;

onMounted(() => {
    if (prefersReducedMotion.value) {
        revealed.value.stats = true;
        revealed.value.heading = true;
        revealed.value.capabilities = [true, true, true, true];
        revealed.value.howHeading = true;
        revealed.value.steps = [true, true, true];
        revealed.value.cta = true;
        return;
    }

    observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                const el = entry.target as HTMLElement;

                if (el === statsRef.value) {
                    revealed.value.stats = true;
                } else if (el === ctaRef.value) {
                    revealed.value.cta = true;
                } else if (el.dataset.reveal === "heading") {
                    revealed.value.heading = true;
                } else if (el.dataset.reveal === "how-heading") {
                    revealed.value.howHeading = true;
                } else if (el.dataset.reveal === "cap") {
                    const idx = parseInt(el.dataset.capIndex || "0", 10);
                    (revealed.value.capabilities as boolean[])[idx] = true;
                } else if (el.dataset.reveal === "step") {
                    const idx = parseInt(el.dataset.stepIndex || "0", 10);
                    (revealed.value.steps as boolean[])[idx] = true;
                }
            }
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    if (statsRef.value) observer.observe(statsRef.value);
    if (ctaRef.value) observer.observe(ctaRef.value);

    // Observe all data-reveal elements
    requestAnimationFrame(() => {
        document.querySelectorAll("[data-reveal]").forEach((el) => {
            if (el !== statsRef.value && el !== ctaRef.value) {
                observer?.observe(el);
            }
        });
    });
});

onUnmounted(() => {
    if (observer) observer.disconnect();
});
</script>

<style scoped>
/* --- Hero --- */
.hero-section {
    min-height: 100svh;
    display: grid;
    place-items: center;
    text-align: center;
    padding: var(--space-8) var(--container-padding-x);
    background: linear-gradient(
        180deg,
        var(--color-bg) 0%,
        var(--color-surface-hover) 100%
    );
    position: relative;
}

.hero-content {
    max-width: 60ch;
}

.brand-mark {
    width: 64px;
    height: 64px;
    margin: 0 auto var(--space-3);
    background: var(--color-primary);
    color: var(--color-surface);
    border-radius: var(--radius-xl);
    display: grid;
    place-items: center;
    box-shadow: var(--shadow-md);
}

.brand-subtitle {
    font-family: var(--font-body);
    font-size: var(--text-base);
    font-weight: var(--weight-semibold);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-8);
    letter-spacing: 0.05em;
}

.hero-headline {
    font-family: var(--font-display);
    font-size: var(--text-hero);
    font-weight: var(--weight-bold);
    line-height: var(--leading-tight);
    color: var(--color-text);
    margin-bottom: var(--space-6);
}

.headline-accent {
    color: var(--color-text-secondary);
    font-weight: var(--weight-regular);
}

/* Rotating words */
.headline-rotator {
    display: inline-block;
    position: relative;
    vertical-align: bottom;
    min-width: 4ch;
}

.headline-rotator__word {
    display: inline-block;
    color: var(--color-accent);
    font-weight: var(--weight-bold);
    white-space: nowrap;
}

.rotator-enter-active {
    transition:
        opacity 0.35s var(--ease-out-expo),
        transform 0.45s var(--ease-spring);
}

.rotator-leave-active {
    transition:
        opacity 0.25s ease-in,
        transform 0.3s ease-in;
}

.rotator-enter-from {
    opacity: 0;
    transform: translateY(0.6em) scale(0.85);
}

.rotator-leave-to {
    opacity: 0;
    transform: translateY(-0.6em) scale(0.85);
}

.hero-subtext {
    font-family: var(--font-body);
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-10);
    max-width: 48ch;
    margin-left: auto;
    margin-right: auto;
}

.hero-cta {
    display: flex;
    gap: var(--space-4);
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
}

/* Scroll hint */
.hero-scroll-hint {
    position: absolute;
    bottom: var(--space-10);
    left: 50%;
    transform: translateX(-50%);
    color: var(--color-text-muted);
    animation: bounce-down 2s ease-in-out infinite;
    opacity: 0.5;
}

/* --- Stats Bar --- */
.stats-section {
    padding: var(--space-16) var(--container-padding-x);
    max-width: var(--container-max-width);
    margin: 0 auto;
    opacity: 0;
    transform: translateY(30px);
    transition:
        opacity 0.6s var(--ease-out-expo),
        transform 0.6s var(--ease-out-expo);
}

.stats-section.is-revealed {
    opacity: 1;
    transform: translateY(0);
}

.stats-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-12);
    padding: var(--space-10) var(--space-8);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-2xl);
    transition: border-color var(--duration-normal) var(--ease-standard);
}

.stats-row:hover {
    border-color: var(--color-primary);
}

.stat-item {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
}

.stat-number {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    font-weight: var(--weight-bold);
    color: var(--color-text);
    line-height: var(--leading-tight);
}

.stat-label {
    font-family: var(--font-body);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
}

.stat-divider {
    width: 1px;
    height: 48px;
    background: var(--color-border);
    flex-shrink: 0;
}

/* --- Capabilities Grid --- */
.capabilities-section {
    padding: var(--space-20) var(--container-padding-x) var(--space-24);
    max-width: var(--container-max-width);
    margin: 0 auto;
}

.section-heading {
    font-family: var(--font-display);
    font-size: var(--text-4xl);
    font-weight: var(--weight-bold);
    line-height: var(--leading-tight);
    color: var(--color-text);
    margin-bottom: var(--space-16);
    opacity: 0;
    transform: translateY(24px);
    transition:
        opacity 0.6s var(--ease-out-expo),
        transform 0.6s var(--ease-out-expo);
}

.section-heading.is-revealed {
    opacity: 1;
    transform: translateY(0);
}

.section-heading__accent {
    color: var(--color-text-secondary);
    font-weight: var(--weight-regular);
}

.capabilities-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
}

.capability-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-2xl);
    padding: var(--space-8);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    transition:
        transform var(--duration-normal) var(--ease-out-expo),
        box-shadow var(--duration-normal) var(--ease-out-expo),
        border-color var(--duration-fast) var(--ease-standard),
        opacity 0.5s var(--ease-out-expo);
    text-decoration: none;
    color: inherit;
    opacity: 0;
    transform: translateY(32px);
}

.capability-card.is-revealed {
    opacity: 1;
    transform: translateY(0);
}

.capability-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
}

.capability-card:hover .capability-icon {
    transform: scale(1.05);
}

.capability-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-lg);
    background: var(--color-primary-muted);
    color: var(--color-primary);
    display: grid;
    place-items: center;
    flex-shrink: 0;
    transition: transform var(--duration-fast) var(--ease-spring);
}

.capability-icon--secondary {
    background: var(--color-accent-muted);
    color: var(--color-accent);
}

.capability-icon--accent {
    background: rgba(239, 68, 68, 0.1);
    color: var(--color-danger);
}

.capability-icon--tertiary {
    background: rgba(245, 158, 11, 0.1);
    color: var(--color-warning);
}

.capability-title {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    font-weight: var(--weight-bold);
    line-height: var(--leading-tight);
    color: var(--color-text);
}

.capability-desc {
    font-family: var(--font-body);
    font-size: var(--text-sm);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
}

.capability-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin-top: auto;
}

.capability-list li {
    font-family: var(--font-body);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    padding-left: var(--space-5);
    position: relative;
}

.capability-list li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.6em;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-primary);
}

/* --- Workflow --- */
.workflow-section {
    padding: var(--space-24) var(--container-padding-x);
    max-width: var(--container-max-width);
    margin: 0 auto;
}

.workflow-steps {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
}

.workflow-step {
    display: flex;
    gap: var(--space-6);
    align-items: flex-start;
    opacity: 0;
    transform: translateX(-24px);
    transition:
        opacity 0.5s var(--ease-out-expo),
        transform 0.5s var(--ease-out-expo);
}

.workflow-step.is-revealed {
    opacity: 1;
    transform: translateX(0);
}

.step-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    width: 48px;
}

.step-number {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--color-primary);
    color: var(--color-surface);
    display: grid;
    place-items: center;
    font-family: var(--font-display);
    font-size: var(--text-xl);
    font-weight: var(--weight-bold);
    flex-shrink: 0;
    transition:
        transform var(--duration-fast) var(--ease-spring),
        box-shadow var(--duration-fast) var(--ease-standard);
}

.workflow-step:hover .step-number {
    transform: scale(1.1);
    box-shadow: var(--shadow-md);
}

.step-line {
    width: 2px;
    height: 56px;
    background: var(--color-border);
    margin-top: var(--space-2);
    transform-origin: top;
    transform: scaleY(0);
    transition: transform 0.5s var(--ease-out-expo) 0.2s;
}

.workflow-step.is-revealed .step-line {
    transform: scaleY(1);
}

.step-body {
    padding-top: var(--space-2);
}

.step-title {
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    font-weight: var(--weight-bold);
    line-height: var(--leading-tight);
    color: var(--color-text);
    margin-bottom: var(--space-2);
}

.step-desc {
    font-family: var(--font-body);
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
    max-width: 56ch;
}

/* --- CTA --- */
.cta-section {
    padding: var(--space-32) var(--container-padding-x);
    text-align: center;
    opacity: 0;
    transform: translateY(30px);
    transition:
        opacity 0.6s var(--ease-out-expo),
        transform 0.6s var(--ease-out-expo);
}

.cta-section.is-revealed {
    opacity: 1;
    transform: translateY(0);
}

.cta-content {
    max-width: 52ch;
    margin: 0 auto;
}

.cta-headline {
    font-family: var(--font-display);
    font-size: var(--text-4xl);
    font-weight: var(--weight-bold);
    line-height: var(--leading-tight);
    color: var(--color-text);
    margin-bottom: var(--space-5);
}

.cta-headline-accent {
    color: var(--color-text-secondary);
    font-weight: var(--weight-regular);
}

.cta-subtext {
    font-family: var(--font-body);
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-8);
}

/* --- Button Shimmer --- */
.btn-shimmer {
    position: relative;
    overflow: hidden;
}

.btn-shimmer::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
        105deg,
        transparent 40%,
        rgba(255, 255, 255, 0.12),
        transparent 60%
    );
    transform: translateX(-100%);
}

.btn-shimmer:hover::after {
    animation: shimmer 0.8s var(--ease-out-expo);
}

/* --- Keyframes --- */
@keyframes fade-up {
    from {
        opacity: 0;
        transform: translateY(24px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes bounce-down {
    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateX(-50%) translateY(0);
    }
    40% {
        transform: translateX(-50%) translateY(8px);
    }
    60% {
        transform: translateX(-50%) translateY(4px);
    }
}

@keyframes float {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-6px);
    }
}

@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
}

.anim-fade-up {
    animation: fade-up 0.6s var(--ease-out-expo) both;
}

.anim-float {
    animation: float 3s ease-in-out infinite;
}

/* --- Responsive --- */
@media (max-width: 1024px) {
    .capabilities-grid {
        grid-template-columns: 1fr;
    }
    .stats-row {
        flex-wrap: wrap;
        gap: var(--space-6);
    }
    .stat-divider {
        display: none;
    }
    .section-heading {
        font-size: var(--text-3xl);
    }
}

@media (max-width: 640px) {
    .hero-cta {
        flex-direction: column;
        width: 100%;
    }
    .hero-cta .btn-primary,
    .hero-cta .btn-ghost {
        width: 100%;
    }
    .stats-row {
        flex-direction: column;
        gap: var(--space-5);
    }
    .workflow-step {
        flex-direction: column;
        gap: var(--space-3);
        transform: translateY(24px);
    }
    .workflow-step.is-revealed {
        transform: translateY(0);
    }
    .step-line {
        display: none;
    }
    .step-marker {
        width: auto;
    }
    .cta-headline {
        font-size: var(--text-3xl);
    }
    .hero-headline {
        font-size: var(--text-4xl);
    }
}

/* --- Reduced Motion --- */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
</style>
