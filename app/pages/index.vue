<template>
    <div id="lp-root">
        <!-- NAV -->
        <header class="nav-header">
            <nav ref="navEl" class="nav-container">
                <NuxtLink to="#top" class="nav-brand">
                    <span class="brand-icon">
                        <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                cx="12"
                                cy="9.5"
                                r="5.5"
                                stroke="#F5521E"
                                stroke-width="2"
                            />
                            <circle cx="12" cy="9.5" r="2" fill="#F5521E" />
                            <path
                                d="M9 14l-2 7 5-3 5 3-2-7"
                                stroke="#fff"
                                stroke-width="2"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </span>
                    <span class="brand-name"
                        >Certif<span class="accent">y</span></span
                    >
                </NuxtLink>
                <div class="nav-links">
                    <a href="#how" @mouseenter="navHover" @mouseleave="navLeave"
                        >How it works</a
                    >
                    <a
                        href="#features"
                        @mouseenter="navHover"
                        @mouseleave="navLeave"
                        >Features</a
                    >
                    <NuxtLink
                        to="/templates"
                        @mouseenter="navHover"
                        @mouseleave="navLeave"
                        >Editor</NuxtLink
                    >
                    <a
                        href="#pricing"
                        @mouseenter="navHover"
                        @mouseleave="navLeave"
                        >Pricing</a
                    >
                </div>
                <div class="nav-actions">
                    <a
                        href="#"
                        class="nav-signin"
                        @mouseenter="navHover"
                        @mouseleave="navLeave"
                        >Sign in</a
                    >
                    <NuxtLink
                        to="/templates"
                        class="nav-cta"
                        @mouseenter="ctaIn"
                        @mouseleave="ctaOut"
                    >
                        Start free
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M5 12h14M13 6l6 6-6 6"
                                stroke="#fff"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </NuxtLink>
                </div>
            </nav>
        </header>

        <!-- HERO -->
        <section id="top" class="hero-section">
            <div class="hero-glow"></div>
            <div class="hero-grid">
                <!-- left -->
                <div class="hero-left">
                    <div class="hero-badge" data-reveal>
                        <span class="badge-dot"></span>
                        Bulk PDF generation, on autopilot
                        <span class="badge-new">New</span>
                    </div>
                    <h1 class="hero-title" data-reveal data-delay="60">
                        Design once.<br />Generate for
                        <span class="accent">credentials.</span>
                    </h1>
                    <p class="hero-subtitle" data-reveal data-delay="120">
                        A drag-and-drop canvas, your CSV, and production-ready
                        certificate PDFs in seconds — backgrounds, logos,
                        signatures and custom fonts, all in one place.
                    </p>
                    <div class="hero-cta" data-reveal data-delay="180">
                        <NuxtLink
                            to="/templates"
                            class="btn-primary"
                            @mouseenter="ctaIn"
                            @mouseleave="ctaOut"
                        >
                            Start creating
                            <svg
                                width="17"
                                height="17"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M5 12h14M13 6l6 6-6 6"
                                    stroke="#fff"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </NuxtLink>
                        <form
                            @submit.prevent="submitEmail"
                            class="hero-email-form"
                        >
                            <input
                                v-model="email"
                                placeholder="your@email.com"
                                class="email-input"
                            />
                            <button
                                type="submit"
                                aria-label="Subscribe"
                                class="email-submit"
                                @mouseenter="ctaIn"
                                @mouseleave="ctaOut"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M5 12h14M13 6l6 6-6 6"
                                        stroke="#fff"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </button>
                        </form>
                    </div>
                    <div class="hero-note" data-reveal data-delay="230">
                        {{ emailNote }}
                    </div>
                    <div class="hero-stats" data-reveal data-delay="280">
                        <div class="stat-item">
                            <span class="stat-value">12k+</span>
                            <span class="stat-label">certificates / day</span>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                            <span class="stat-value">9s</span>
                            <span class="stat-label">avg per batch</span>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                            <span class="stat-value">PDF</span>
                            <span class="stat-label">print-ready</span>
                        </div>
                    </div>
                </div>

                <!-- right: certificate showcase -->
                <div class="hero-right">
        <div class="cert-main" data-float>
            <div class="cert-card" ref="tiltEl">
                            <div class="cert-inner">
                                <div class="cert-badge">
                                    <BaseIcon name="seal" :size="48" />
                                    <span
                                        class="cert-badge-seal"
                                        data-float-seal
                                    ></span>
                                </div>
                                <div class="cert-type">
                                    Certificate of Achievement
                                </div>
                                <div class="cert-presented">
                                    This is proudly presented to
                                </div>
                                <div class="cert-name">Olivia Hartwell</div>
                                <div class="cert-line"></div>
                                <div class="cert-desc">
                                    for the successful completion of the
                                    Advanced Product Design program, June 2026.
                                </div>
                                <div class="cert-sigs">
                                    <div class="cert-sig">
                                        <div class="sig-script">A. Rivera</div>
                                        <div class="sig-underline"></div>
                                        <div class="sig-title">Director</div>
                                    </div>
                                    <div class="cert-sig">
                                        <div class="sig-script">M. Chen</div>
                                        <div class="sig-underline"></div>
                                        <div class="sig-title">Instructor</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- floating chips -->
                    <div class="float-chip chip-progress" data-float>
                        <div class="chip-header">
                            <span>Bulk generating</span>
                            <span class="accent">99%</span>
                        </div>
                        <div class="chip-bar">
                            <div class="chip-bar-fill"></div>
                        </div>
                        <div class="chip-text">248 / 250 PDFs ready</div>
                    </div>
                    <div class="float-chip chip-csv" data-float>
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M4 7h16M4 12h16M4 17h10"
                                stroke="#F5521E"
                                stroke-width="2"
                                stroke-linecap="round"
                            />
                        </svg>
                        <div>
                            <div class="chip-title">attendees.csv</div>
                            <div class="chip-subtitle">250 rows mapped</div>
                        </div>
                    </div>
                    <div class="float-chip chip-brand" data-float>
                        <span class="chip-color"></span>
                        Brand color applied
                    </div>
                </div>
            </div>

            <!-- marquee strip -->
            <div class="marquee-container" data-reveal data-delay="120">
                <div class="marquee-content">
                    <template v-for="i in 2" :key="i">
                        <template
                            v-for="(item, idx) in marqueeItems"
                            :key="`${i}-${idx}`"
                        >
                            <span>{{ item }}</span>
                            <span class="accent">◆</span>
                        </template>
                    </template>
                </div>
            </div>
        </section>

        <!-- HOW IT WORKS -->
        <section id="how" class="section-how">
            <div class="section-header" data-reveal>
                <div class="section-label">How it works</div>
                <h2 class="section-title">
                    From blank canvas to a stack of PDFs
                </h2>
                <p class="section-desc">
                    Three steps. No design tool, no developer, no waiting.
                </p>
            </div>
            <div class="how-grid">
                <div class="how-card" data-reveal data-delay="0">
                    <div class="how-card-header">
                        <span class="how-icon">
                            <BaseIcon name="template" :size="48" />
                        </span>
                        <span class="how-number">01</span>
                    </div>
                    <h3 class="how-title">Design the template</h3>
                    <p class="how-text">
                        Drop your background, place text, logo and signature on
                        a free canvas. Snap, align, done.
                    </p>
                </div>
                <div class="how-card" data-reveal data-delay="90">
                    <div class="how-card-header">
                        <span class="how-icon">
                            <BaseIcon name="csv" :size="48" />
                        </span>
                        <span class="how-number">02</span>
                    </div>
                    <h3 class="how-title">Upload your data</h3>
                    <p class="how-text">
                        Bring a CSV of names, courses and dates. Map each column
                        to a field with one click.
                    </p>
                </div>
                <div
                    class="how-card how-card-dark"
                    data-reveal
                    data-delay="180"
                >
                    <div class="how-card-header">
                        <span class="how-icon how-icon-light">
                            <BaseIcon name="generate" :size="48" />
                        </span>
                        <span class="how-number how-number-light">03</span>
                    </div>
                    <h3 class="how-title">Generate the batch</h3>
                    <p class="how-text">
                        Hit generate and download every personalized,
                        print-ready PDF as a zip in seconds.
                    </p>
                </div>
            </div>
        </section>

        <!-- FEATURES -->
        <section id="features" class="section-features">
            <div class="features-header" data-reveal>
                <div>
                    <div class="section-label">Everything in one place</div>
                    <h2 class="section-title">
                        A studio built for certificates
                    </h2>
                </div>
                <p class="features-subtitle">
                    No stitching tools together. Editor, data and asset library
                    live side by side.
                </p>
            </div>
            <div class="features-grid">
                <div class="feature-card feature-card-big" data-reveal>
                    <span class="feature-icon">
                        <BaseIcon name="template" :size="48" />
                    </span>
                    <h3 class="feature-title-sm">Drag-and-drop canvas</h3>
                    <p class="feature-text-sm">
                        Place every element exactly where you want it. Live
                        guides, snapping, layers and instant preview of real
                        data.
                    </p>
                    <div class="feature-demo">
                        <div class="demo-cert">
                            <div class="demo-cert-label">Certificate</div>
                            <div class="demo-cert-field">{ full_name }</div>
                            <div class="demo-cert-line"></div>
                        </div>
                        <span class="demo-badge">
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="#fff"
                            >
                                <path d="M4 2l16 9-7 2-2 7L4 2z" />
                            </svg>
                            Drag
                        </span>
                    </div>
                </div>
                <div class="feature-card" data-reveal data-delay="80">
                    <span class="feature-icon">
                        <BaseIcon name="generate" :size="48" />
                    </span>
                    <h3 class="feature-title-sm">Bulk from CSV</h3>
                    <p class="feature-text-sm">
                        One template, thousands of personalized PDFs. Mapped
                        from your spreadsheet automatically.
                    </p>
                </div>
                <div class="feature-card" data-reveal data-delay="160">
                    <span class="feature-icon">
                        <BaseIcon name="download" :size="48" />
                    </span>
                    <h3 class="feature-title-sm">Print-ready PDF</h3>
                    <p class="feature-text-sm">
                        Crisp vector text and embedded fonts at true print
                        resolution. Download as a zip.
                    </p>
                </div>
                <div
                    class="feature-card feature-card-wide"
                    data-reveal
                    data-delay="120"
                >
                    <div class="feature-wide-content">
                        <span class="feature-icon">
                            <svg
                                width="21"
                                height="21"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <rect
                                    x="3"
                                    y="4"
                                    width="18"
                                    height="16"
                                    rx="2"
                                    stroke="#F5521E"
                                    stroke-width="1.8"
                                />
                                <path
                                    d="M3 16l5-4 4 3 4-4 5 4"
                                    stroke="#F5521E"
                                    stroke-width="1.8"
                                    stroke-linejoin="round"
                                />
                                <circle cx="9" cy="9" r="1.4" fill="#F5521E" />
                            </svg>
                        </span>
                        <h3 class="feature-title-sm">Asset library</h3>
                        <p class="feature-text-sm">
                            Backgrounds, logos, signatures and custom fonts —
                            uploaded once, reused across every template.
                        </p>
                    </div>
                    <div class="asset-preview">
                        <div class="asset-item asset-bg">BG</div>
                        <div class="asset-item asset-logo">
                            <span class="asset-circle"></span>
                        </div>
                        <div class="asset-item asset-sig">Sig</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- PRICING -->
        <section id="pricing" class="section-pricing">
            <div class="section-header" data-reveal>
                <div class="section-label">Pricing</div>
                <h2 class="section-title">
                    Start free. Upgrade when you scale.
                </h2>
                <p class="section-desc">
                    Try the editor for free. Unlock logos, custom fonts and
                    unlimited batches with Pro.
                </p>
            </div>
            <div class="pricing-grid">
                <div class="pricing-card" data-reveal>
                    <div class="pricing-name">Free trial</div>
                    <div class="pricing-price">
                        <span class="price-amount">$0</span>
                        <span class="price-period">forever</span>
                    </div>
                    <p class="pricing-desc">
                        Everything you need to design and try a real
                        certificate.
                    </p>
                    <div class="pricing-features">
                        <div class="pricing-feature pricing-yes">
                            <span class="feature-check"></span>
                            <span>Full drag-and-drop editor</span>
                        </div>
                        <div class="pricing-feature pricing-yes">
                            <span class="feature-check"></span>
                            <span>Upload 1 background</span>
                        </div>
                        <div class="pricing-feature pricing-yes">
                            <span class="feature-check"></span>
                            <span>Add a signature</span>
                        </div>
                        <div class="pricing-feature pricing-no">
                            <span class="feature-cross"></span>
                            <span>Upload your logo</span>
                        </div>
                        <div class="pricing-feature pricing-no">
                            <span class="feature-cross"></span>
                            <span>Custom fonts</span>
                        </div>
                        <div class="pricing-feature pricing-yes">
                            <span class="feature-check"></span>
                            <span>Export with watermark</span>
                        </div>
                    </div>
                    <NuxtLink
                        to="/templates"
                        class="pricing-btn pricing-btn-light"
                        @mouseenter="pricingSoftIn"
                        @mouseleave="pricingSoftOut"
                    >
                        Start free
                    </NuxtLink>
                </div>
                <div
                    class="pricing-card pricing-card-pro"
                    data-reveal
                    data-delay="90"
                >
                    <div class="pricing-glow"></div>
                    <div class="pricing-header">
                        <div class="pricing-name">Pro</div>
                        <span class="pricing-badge">Most popular</span>
                    </div>
                    <div class="pricing-price">
                        <span class="price-amount">$19</span>
                        <span class="price-period">/ month</span>
                    </div>
                    <p class="pricing-desc">
                        For teams running real credential programs at volume.
                    </p>
                    <div class="pricing-features">
                        <div
                            class="pricing-feature pricing-yes pricing-yes-light"
                        >
                            <span
                                class="feature-check feature-check-light"
                            ></span>
                            <span>Unlimited backgrounds</span>
                        </div>
                        <div
                            class="pricing-feature pricing-yes pricing-yes-light"
                        >
                            <span
                                class="feature-check feature-check-light"
                            ></span>
                            <span>Upload logos & branding</span>
                        </div>
                        <div
                            class="pricing-feature pricing-yes pricing-yes-light"
                        >
                            <span
                                class="feature-check feature-check-light"
                            ></span>
                            <span>Custom font uploads</span>
                        </div>
                        <div
                            class="pricing-feature pricing-yes pricing-yes-light"
                        >
                            <span
                                class="feature-check feature-check-light"
                            ></span>
                            <span>Unlimited bulk generation</span>
                        </div>
                        <div
                            class="pricing-feature pricing-yes pricing-yes-light"
                        >
                            <span
                                class="feature-check feature-check-light"
                            ></span>
                            <span>Watermark-free PDFs</span>
                        </div>
                        <div
                            class="pricing-feature pricing-yes pricing-yes-light"
                        >
                            <span
                                class="feature-check feature-check-light"
                            ></span>
                            <span>Priority export queue</span>
                        </div>
                    </div>
                    <a
                        href="#"
                        class="pricing-btn pricing-btn-accent"
                        @mouseenter="ctaIn"
                        @mouseleave="ctaOut"
                    >
                        Upgrade to Pro
                    </a>
                </div>
            </div>
        </section>

        <!-- FINAL CTA -->
        <section class="section-cta">
            <div class="cta-box" data-reveal>
                <div class="cta-glow"></div>
                <h2 class="cta-title">
                    Your next 500 certificates,<br />done before lunch.
                </h2>
                <p class="cta-text">
                    Design a template once and let the batch run itself.
                </p>
                <div class="cta-buttons">
                    <NuxtLink
                        to="/templates"
                        class="cta-btn cta-btn-primary"
                        @mouseenter="ctaIn"
                        @mouseleave="ctaOut"
                    >
                        Start creating
                        <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M5 12h14M13 6l6 6-6 6"
                                stroke="#14110E"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </NuxtLink>
                    <a
                        href="#pricing"
                        class="cta-btn cta-btn-ghost"
                        @mouseenter="ghostIn"
                        @mouseleave="ghostOut"
                    >
                        See pricing
                    </a>
                </div>
            </div>
        </section>

        <!-- FOOTER -->
        <footer class="footer">
            <div class="footer-content">
                <NuxtLink to="#top" class="footer-brand">
                    <span class="footer-icon">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
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
                    <span class="footer-name"
                        >Certif<span class="accent">y</span></span
                    >
                </NuxtLink>
                <div class="footer-links">
                    <a href="#how">How it works</a>
                    <a href="#features">Features</a>
                    <a href="#pricing">Pricing</a>
                    <NuxtLink to="/templates">Editor</NuxtLink>
                </div>
                <div class="footer-copy">
                    © 2026 Certify. Design once, generate forever.
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
const { softIn, softOut, ctaIn, ctaOut, ghostIn, ghostOut, cardIn, cardOut } =
    useHoverIntents();
const toast = useToast();

// State
const email = ref("");
const emailNote = ref("Free forever. No card required.");
const navEl = ref<HTMLElement | null>(null);
const tiltEl = ref<HTMLElement | null>(null);

// Marquee items
const marqueeItems = [
    "Course completion",
    "Workshop badges",
    "Employee awards",
    "Webinar credentials",
    "Training records",
    "Event participation",
    "Membership cards",
    "Achievement diplomas",
];

// Event handlers
const navHover = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.background = "rgba(20,17,14,0.05)";
    target.style.color = "#14110E";
};
const navLeave = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.background = "transparent";
    target.style.color = "";
};
const pricingSoftIn = (e: MouseEvent) => {
    (e.currentTarget as HTMLElement).style.background = "#ece4dc";
};
const pricingSoftOut = (e: MouseEvent) => {
    (e.currentTarget as HTMLElement).style.background = "";
};

const submitEmail = () => {
    if (email.value) {
        emailNote.value = "✓ Thanks — check your inbox to get started.";
    } else {
        emailNote.value = "Enter an email to continue.";
    }
};

// Lifecycle
let io: IntersectionObserver | null = null;
let onMoveHandler: ((e: MouseEvent) => void) | null = null;
let onScrollHandler: (() => void) | null = null;

onMounted(() => {
    const root = document.getElementById("lp-root");
    if (!root) return;

    // Reveal animations
    const els = root.querySelectorAll("[data-reveal]");
    els.forEach((el) => {
        const element = el as HTMLElement;
        element.style.opacity = "0";
        element.style.transform = "translateY(26px)";
        element.style.transition =
            "opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1)";
        const delay = element.dataset.delay || "0";
        element.style.transitionDelay = delay + "ms";
    });

    io = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "1";
                    target.style.transform = "none";
                    io?.unobserve(e.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    els.forEach((el) => io?.observe(el));

    // Parallax tilt
    if (tiltEl.value) {
        onMoveHandler = (ev: MouseEvent) => {
            if (!tiltEl.value) return;
            const x = ev.clientX / window.innerWidth - 0.5;
            const y = ev.clientY / window.innerHeight - 0.5;
            tiltEl.value.style.transform = `perspective(1500px) rotateY(${-15 + x * 8}deg) rotateX(${7 - y * 6}deg)`;
        };
        window.addEventListener("mousemove", onMoveHandler, { passive: true });
    }

    // Nav shadow on scroll
    if (navEl.value) {
        onScrollHandler = () => {
            if (!navEl.value) return;
            if (window.scrollY > 16) {
                navEl.value.style.boxShadow = "0 14px 40px rgba(20,17,14,0.12)";
                navEl.value.style.background = "rgba(255,255,255,0.86)";
            } else {
                navEl.value.style.boxShadow = "0 10px 34px rgba(20,17,14,0.07)";
                navEl.value.style.background = "rgba(255,255,255,0.72)";
            }
        };
        window.addEventListener("scroll", onScrollHandler, { passive: true });
    }
});

onUnmounted(() => {
    if (io) io.disconnect();
    if (onMoveHandler) window.removeEventListener("mousemove", onMoveHandler);
    if (onScrollHandler) window.removeEventListener("scroll", onScrollHandler);
});
</script>

<style scoped>
/* ── Landing Page Design Tokens ── */
#lp-root {
    --accent: #f5521e;
    --ink: #14110e;
    --muted: #6e665e;
    --cream: #f2ece7;
    --line: rgba(20, 17, 14, 0.08);
    --surface: #fff;
    overflow-x: hidden;
    background: var(--cream);
    font-family: "General Sans", system-ui, sans-serif;
    color: var(--ink);
    -webkit-font-smoothing: antialiased;
}

/* ── Animations ── */
@keyframes lp-floaty {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-16px);
    }
}
@keyframes lp-floatyB {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(12px);
    }
}
@keyframes lp-spinSlow {
    to {
        transform: rotate(360deg);
    }
}
@keyframes lp-marquee {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(-50%);
    }
}

/* ── Selections ── */
#lp-root ::selection {
    background: var(--accent);
    color: #fff;
}

/* ── Accent utility ── */
.accent {
    color: var(--accent);
}

/* ══════════════════════════════════════════════════════
   NAV
   ══════════════════════════════════════════════════════ */
.nav-header {
    position: fixed;
    top: 16px;
    left: 0;
    right: 0;
    z-index: 60;
    display: flex;
    justify-content: center;
    padding: 0 18px;
    pointer-events: none;
}
.nav-container {
    pointer-events: auto;
    width: 100%;
    max-width: 1080px;
    display: flex;
    align-items: center;
    gap: 24px;
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(20, 17, 14, 0.06);
    border-radius: 999px;
    padding: 11px 14px 11px 22px;
    box-shadow: 0 10px 34px rgba(20, 17, 14, 0.07);
    transition:
        box-shadow 0.4s,
        background 0.4s;
}
.nav-brand {
    display: flex;
    align-items: center;
    gap: 11px;
    text-decoration: none;
    color: var(--ink);
}
.brand-icon {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 9px;
    background: var(--ink);
}
.brand-name {
    font-weight: 600;
    font-size: 16px;
    letter-spacing: -0.01em;
}
.nav-links {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: 8px;
    font-size: 14.5px;
    font-weight: 500;
    color: var(--muted);
    white-space: nowrap;
}
.nav-links a {
    text-decoration: none;
    color: inherit;
    padding: 8px 13px;
    border-radius: 999px;
    transition:
        color 0.2s,
        background 0.2s;
}
.nav-actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 8px;
}
.nav-signin {
    text-decoration: none;
    color: var(--ink);
    font-weight: 500;
    font-size: 14.5px;
    padding: 9px 14px;
    border-radius: 999px;
    transition: background 0.2s;
}
.nav-cta {
    text-decoration: none;
    color: #fff;
    background: var(--ink);
    font-weight: 500;
    font-size: 14.5px;
    padding: 10px 18px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    transition:
        transform 0.25s,
        box-shadow 0.25s;
    box-shadow: 0 6px 18px rgba(20, 17, 14, 0.18);
}

/* ══════════════════════════════════════════════════════
   HERO
   ══════════════════════════════════════════════════════ */
.hero-section {
    position: relative;
    padding: 150px 32px 70px;
    max-width: 1240px;
    margin: 0 auto;
}
.hero-glow {
    position: absolute;
    top: 90px;
    left: 50%;
    transform: translateX(-50%);
    width: 680px;
    height: 680px;
    border-radius: 50%;
    background: radial-gradient(
        circle,
        rgba(245, 82, 30, 0.1),
        transparent 62%
    );
    filter: blur(10px);
    pointer-events: none;
}
.hero-grid {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 48px;
    align-items: center;
    position: relative;
}

/* hero left */
.hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    background: var(--surface);
    border: 1px solid var(--line);
    padding: 7px 7px 7px 13px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 500;
    color: var(--ink);
    box-shadow: 0 4px 14px rgba(20, 17, 14, 0.05);
}
.badge-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #1fae6b;
    box-shadow: 0 0 0 4px rgba(31, 174, 107, 0.18);
}
.badge-new {
    background: var(--cream);
    border-radius: 999px;
    padding: 3px 9px;
    font-size: 12px;
    font-weight: 600;
}
.hero-title {
    margin: 22px 0 0;
    font-size: clamp(46px, 5.6vw, 78px);
    line-height: 0.98;
    letter-spacing: -0.035em;
    font-weight: 600;
}
.hero-subtitle {
    margin: 24px 0 0;
    font-size: 19px;
    line-height: 1.5;
    color: var(--muted);
    max-width: 480px;
    font-weight: 450;
}
.hero-cta {
    margin: 34px 0 0;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}
.btn-primary {
    text-decoration: none;
    color: #fff;
    background: var(--ink);
    font-weight: 600;
    font-size: 16px;
    padding: 16px 26px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    box-shadow: 0 12px 30px rgba(20, 17, 14, 0.22);
    transition:
        transform 0.25s,
        box-shadow 0.25s;
}
.hero-email-form {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 6px 6px 6px 18px;
    box-shadow: 0 6px 18px rgba(20, 17, 14, 0.05);
}
.email-input {
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: 15px;
    width: 170px;
    color: var(--ink);
}
.email-input::placeholder {
    color: var(--muted);
}
.email-submit {
    border: none;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--accent);
    display: grid;
    place-items: center;
    transition: transform 0.2s;
}
.hero-note {
    margin: 18px 0 0;
    font-size: 13.5px;
    color: var(--muted);
    font-weight: 450;
    height: 20px;
}
.hero-stats {
    margin: 30px 0 0;
    display: flex;
    align-items: center;
    gap: 26px;
    flex-wrap: wrap;
}
.stat-item {
    display: flex;
    align-items: baseline;
    gap: 7px;
}
.stat-value {
    font-size: 26px;
    font-weight: 600;
    letter-spacing: -0.02em;
}
.stat-label {
    font-size: 13px;
    color: var(--muted);
}
.stat-divider {
    width: 1px;
    height: 26px;
    background: var(--line);
}

/* hero right – certificate */
.hero-right {
    position: relative;
    height: 520px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.cert-main {
    animation: lp-floaty 7s ease-in-out infinite;
    position: relative;
    z-index: 2;
}
.cert-card {
    transform: perspective(1500px) rotateY(-15deg) rotateX(7deg);
    transform-style: preserve-3d;
    width: 430px;
    background: var(--surface);
    border-radius: 14px;
    box-shadow:
        0 40px 90px rgba(20, 17, 14, 0.22),
        0 8px 20px rgba(20, 17, 14, 0.1);
    padding: 14px;
}
.cert-inner {
    border: 1.5px solid rgba(20, 17, 14, 0.14);
    border-radius: 8px;
    padding: 34px 30px 28px;
    text-align: center;
    position: relative;
    background: linear-gradient(180deg, #fff, #fdfbf9);
}
.cert-badge {
    display: grid;
    place-items: center;
    margin: 0 auto 16px;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 2px solid var(--accent);
    position: relative;
}
.cert-badge-seal {
    position: absolute;
    inset: -7px;
    border: 1px dashed rgba(245, 82, 30, 0.4);
    border-radius: 50%;
    animation: lp-spinSlow 18s linear infinite;
}
.cert-type {
    font-size: 11px;
    letter-spacing: 0.34em;
    color: var(--muted);
    font-weight: 600;
    text-transform: uppercase;
}
.cert-presented {
    font-size: 12.5px;
    color: var(--muted);
    margin: 16px 0 4px;
    font-style: italic;
    font-family: "Playfair Display", serif;
}
.cert-name {
    font-family: "Playfair Display", serif;
    font-size: 34px;
    font-weight: 600;
    letter-spacing: -0.01em;
    margin: 2px 0 6px;
}
.cert-line {
    width: 90px;
    height: 2px;
    background: var(--accent);
    margin: 6px auto 14px;
    border-radius: 2px;
}
.cert-desc {
    font-size: 11.5px;
    line-height: 1.6;
    color: var(--muted);
    max-width: 300px;
    margin: 0 auto;
}
.cert-sigs {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 26px;
    padding: 0 6px;
}
.cert-sig {
    text-align: center;
}
.sig-script {
    font-family: "Allura", cursive;
    font-size: 26px;
    line-height: 1;
    color: var(--ink);
}
.sig-underline {
    height: 1px;
    background: rgba(20, 17, 14, 0.18);
    margin: 4px 0 5px;
}
.sig-title {
    font-size: 9px;
    letter-spacing: 0.16em;
    color: var(--muted);
    text-transform: uppercase;
}

/* floating chips */
.float-chip {
    position: absolute;
    z-index: 3;
}
.chip-progress {
    animation: lp-floatyB 6s ease-in-out infinite 0.4s;
    top: 36px;
    left: -6px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 13px 15px;
    box-shadow: 0 16px 40px rgba(20, 17, 14, 0.14);
    width: 188px;
}
.chip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 9px;
}
.chip-bar {
    height: 7px;
    border-radius: 6px;
    background: var(--cream);
    overflow: hidden;
}
.chip-bar-fill {
    width: 99%;
    height: 100%;
    background: var(--accent);
    border-radius: 6px;
}
.chip-text {
    font-size: 11px;
    color: var(--muted);
    margin-top: 8px;
}
.chip-csv {
    animation: lp-floaty 6.5s ease-in-out infinite 0.9s;
    bottom: 42px;
    right: -10px;
    background: var(--ink);
    color: #fff;
    border-radius: 13px;
    padding: 11px 15px;
    box-shadow: 0 16px 40px rgba(20, 17, 14, 0.22);
    display: flex;
    align-items: center;
    gap: 10px;
}
.chip-title {
    font-size: 12px;
    font-weight: 600;
}
.chip-subtitle {
    font-size: 10.5px;
    color: rgba(255, 255, 255, 0.6);
}
.chip-brand {
    animation: lp-floatyB 7.5s ease-in-out infinite 0.2s;
    bottom: -6px;
    left: 24px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 8px 14px;
    box-shadow: 0 12px 30px rgba(20, 17, 14, 0.12);
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    font-weight: 500;
}
.chip-color {
    width: 18px;
    height: 18px;
    border-radius: 5px;
    background: var(--accent);
}

/* ── Marquee ── */
.marquee-container {
    margin-top: 64px;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    padding: 18px 0;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(
        90deg,
        transparent,
        #000 12%,
        #000 88%,
        transparent
    );
    mask-image: linear-gradient(
        90deg,
        transparent,
        #000 12%,
        #000 88%,
        transparent
    );
}
.marquee-content {
    display: flex;
    gap: 54px;
    width: max-content;
    animation: lp-marquee 26s linear infinite;
    font-size: 14px;
    font-weight: 500;
    color: var(--muted);
    white-space: nowrap;
}

/* ══════════════════════════════════════════════════════
   HOW IT WORKS
   ══════════════════════════════════════════════════════ */
.section-how {
    max-width: 1140px;
    margin: 0 auto;
    padding: 70px 32px;
}
.section-header {
    text-align: center;
    max-width: 640px;
    margin: 0 auto 52px;
}
.section-label {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
}
.section-title {
    margin: 14px 0 0;
    font-size: clamp(32px, 3.6vw, 46px);
    letter-spacing: -0.03em;
    font-weight: 600;
    line-height: 1.05;
}
.section-desc {
    margin: 14px 0 0;
    font-size: 17px;
    color: var(--muted);
    line-height: 1.5;
}
.how-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
}
.how-card {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 20px;
    padding: 26px;
    box-shadow: 0 10px 30px rgba(20, 17, 14, 0.04);
}
.how-card-dark {
    background: var(--ink);
    color: #fff;
    border-color: var(--ink);
    box-shadow: 0 18px 40px rgba(20, 17, 14, 0.18);
}
.how-card-dark p {
    color: rgba(255, 255, 255, 0.66);
}
.how-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.how-icon {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: var(--cream);
}
.how-icon-light {
    background: rgba(255, 255, 255, 0.1);
}
.how-number {
    font-family: "Playfair Display", serif;
    font-size: 40px;
    color: rgba(20, 17, 14, 0.1);
    font-weight: 700;
    line-height: 1;
}
.how-number-light {
    color: rgba(255, 255, 255, 0.16);
}
.how-title {
    margin: 20px 0 8px;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.01em;
}
.how-card-dark .how-title {
    color: #fff;
}
.how-text {
    margin: 0;
    font-size: 14.5px;
    line-height: 1.55;
    color: var(--muted);
}

/* ══════════════════════════════════════════════════════
   FEATURES
   ══════════════════════════════════════════════════════ */
.section-features {
    max-width: 1140px;
    margin: 0 auto;
    padding: 60px 32px 70px;
}
.features-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
    margin-bottom: 40px;
}
.features-header > div {
    max-width: 560px;
}
.features-subtitle {
    font-size: 16px;
    color: var(--muted);
    max-width: 330px;
    line-height: 1.5;
}
.features-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr;
    grid-auto-rows: auto;
    gap: 20px;
}
.feature-card {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 22px;
    padding: 26px;
    box-shadow: 0 10px 30px rgba(20, 17, 14, 0.05);
}
.feature-card-big {
    padding: 28px;
    display: flex;
    flex-direction: column;
    grid-row: span 2;
}
.feature-card-wide {
    display: flex;
    align-items: center;
    gap: 24px;
    grid-column: span 2;
}
.feature-icon {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: var(--cream);
}
.feature-card-big .feature-icon {
    width: 46px;
    height: 46px;
    border-radius: 13px;
}
.feature-title-sm {
    margin: 16px 0 7px;
    font-size: 19px;
    font-weight: 600;
    letter-spacing: -0.01em;
}
.feature-card-big .feature-title-sm {
    font-size: 22px;
    letter-spacing: -0.015em;
    margin-top: 18px;
}
.feature-text-sm {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: var(--muted);
}
.feature-card-big .feature-text-sm {
    font-size: 15px;
    line-height: 1.55;
    max-width: 360px;
}
.feature-demo {
    margin-top: auto;
    position: relative;
    border-radius: 14px;
    background: linear-gradient(160deg, #fbf8f5, #f1ebe5);
    border: 1px solid var(--line);
    padding: 18px;
    overflow: hidden;
}
.demo-cert {
    background: var(--surface);
    border-radius: 9px;
    border: 1px solid var(--line);
    padding: 18px 14px;
    text-align: center;
    box-shadow: 0 8px 24px rgba(20, 17, 14, 0.06);
}
.demo-cert-label {
    font-size: 8.5px;
    letter-spacing: 0.28em;
    color: var(--muted);
    text-transform: uppercase;
}
.demo-cert-field {
    font-family: "Playfair Display", serif;
    font-size: 22px;
    font-weight: 600;
    margin: 8px 0 4px;
    outline: 1.5px dashed var(--accent);
    outline-offset: 5px;
    border-radius: 3px;
    display: inline-block;
    padding: 1px 6px;
}
.demo-cert-line {
    width: 54px;
    height: 2px;
    background: var(--accent);
    margin: 10px auto 0;
    border-radius: 2px;
}
.demo-badge {
    position: absolute;
    right: 30px;
    bottom: 24px;
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--ink);
    color: #fff;
    font-size: 11px;
    font-weight: 500;
    padding: 5px 9px;
    border-radius: 7px;
}
.feature-wide-content {
    flex: 1;
}
.feature-card-wide .feature-text-sm {
    max-width: 330px;
}
.asset-preview {
    display: flex;
    gap: 10px;
}
.asset-item {
    width: 62px;
    height: 78px;
    border-radius: 9px;
    border: 1px solid var(--line);
    display: grid;
    place-items: center;
}
.asset-bg {
    background: linear-gradient(160deg, #fff, #f0e9e2);
    font-size: 10px;
    color: var(--muted);
}
.asset-logo {
    background: var(--surface);
}
.asset-circle {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: var(--accent);
}
.asset-sig {
    background: var(--surface);
    font-family: "Allura", cursive;
    font-size: 22px;
}

/* ══════════════════════════════════════════════════════
   PRICING
   ══════════════════════════════════════════════════════ */
.section-pricing {
    max-width: 1000px;
    margin: 0 auto;
    padding: 60px 32px 80px;
}
.pricing-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 22px;
    align-items: stretch;
}
.pricing-card {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 10px 30px rgba(20, 17, 14, 0.04);
    display: flex;
    flex-direction: column;
}
.pricing-card-pro {
    position: relative;
    background: var(--ink);
    color: #fff;
    border-color: var(--ink);
    box-shadow: 0 26px 56px rgba(20, 17, 14, 0.26);
    overflow: hidden;
}
.pricing-glow {
    position: absolute;
    top: -40px;
    right: -40px;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: radial-gradient(
        circle,
        rgba(245, 82, 30, 0.45),
        transparent 65%
    );
}
.pricing-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
}
.pricing-name {
    font-size: 15px;
    font-weight: 600;
}
.pricing-card-pro .pricing-name {
    color: #fff;
}
.pricing-badge {
    background: var(--accent);
    color: #fff;
    font-size: 11.5px;
    font-weight: 600;
    padding: 5px 11px;
    border-radius: 999px;
}
.pricing-price {
    margin: 14px 0 4px;
    display: flex;
    align-items: baseline;
    gap: 6px;
    position: relative;
}
.price-amount {
    font-size: 46px;
    font-weight: 600;
    letter-spacing: -0.03em;
}
.price-period {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.6);
}
.pricing-card:not(.pricing-card-pro) .price-period {
    color: var(--muted);
}
.pricing-desc {
    margin: 0 0 22px;
    font-size: 14px;
}
.pricing-card-pro .pricing-desc {
    color: rgba(255, 255, 255, 0.62);
    position: relative;
}
.pricing-card:not(.pricing-card-pro) .pricing-desc {
    color: var(--muted);
}
.pricing-features {
    display: flex;
    flex-direction: column;
    gap: 13px;
    font-size: 14.5px;
    position: relative;
}
.pricing-feature {
    display: flex;
    align-items: center;
    gap: 11px;
}
.pricing-no {
    opacity: 0.42;
}
.pricing-no span:last-child {
    text-decoration: line-through;
}
.feature-check {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(20, 17, 14, 0.06);
}
.feature-cross {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(20, 17, 14, 0.06);
}
.feature-check-light {
    background: var(--accent);
}
.pricing-btn {
    margin-top: 26px;
    text-decoration: none;
    text-align: center;
    font-weight: 600;
    font-size: 15px;
    padding: 14px;
    border-radius: 999px;
    transition: background 0.2s;
}
.pricing-btn-light {
    color: var(--ink);
    background: var(--cream);
    border: 1px solid var(--line);
}
.pricing-btn-accent {
    color: #fff;
    background: var(--accent);
    box-shadow: 0 12px 28px rgba(245, 82, 30, 0.4);
    transition: transform 0.25s;
}

/* ══════════════════════════════════════════════════════
   FINAL CTA
   ══════════════════════════════════════════════════════ */
.section-cta {
    max-width: 1140px;
    margin: 0 auto;
    padding: 0 32px 90px;
}
.cta-box {
    position: relative;
    background: linear-gradient(135deg, #1b1714, #14110e);
    border-radius: 30px;
    padding: 64px 40px;
    text-align: center;
    overflow: hidden;
    box-shadow: 0 30px 70px rgba(20, 17, 14, 0.3);
}
.cta-glow {
    position: absolute;
    top: -80px;
    left: 50%;
    transform: translateX(-50%);
    width: 520px;
    height: 320px;
    background: radial-gradient(
        circle,
        rgba(245, 82, 30, 0.32),
        transparent 60%
    );
}
.cta-title {
    position: relative;
    margin: 0;
    font-size: clamp(34px, 4.4vw, 56px);
    letter-spacing: -0.035em;
    font-weight: 600;
    color: #fff;
    line-height: 1.02;
}
.cta-text {
    position: relative;
    margin: 18px auto 0;
    max-width: 440px;
    font-size: 17px;
    color: rgba(255, 255, 255, 0.66);
    line-height: 1.5;
}
.cta-buttons {
    position: relative;
    margin-top: 32px;
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
}
.cta-btn {
    text-decoration: none;
    font-weight: 600;
    font-size: 16px;
    padding: 16px 28px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    transition: transform 0.25s;
}
.cta-btn-primary {
    color: var(--ink);
    background: #fff;
}
.cta-btn-ghost {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.18);
    transition: background 0.2s;
}

/* ══════════════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════════════ */
.footer {
    border-top: 1px solid var(--line);
}
.footer-content {
    max-width: 1140px;
    margin: 0 auto;
    padding: 40px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
}
.footer-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    color: var(--ink);
}
.footer-icon {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: var(--ink);
}
.footer-name {
    font-weight: 600;
    font-size: 15px;
}
.footer-links {
    display: flex;
    gap: 24px;
    font-size: 14px;
    color: var(--muted);
    font-weight: 500;
}
.footer-links a {
    text-decoration: none;
    color: inherit;
}
.footer-copy {
    font-size: 13px;
    color: var(--muted);
}
</style>
