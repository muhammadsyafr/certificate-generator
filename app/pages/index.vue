<template>
  <div class="page">
    <!-- Hero: Full-Bleed Centered -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="brand-mark">C</div>
        <p class="brand-subtitle">Certificate Generator</p>
        
        <h1 class="hero-headline anim-fade-up">
          Design once.<br />
          <span class="headline-accent">Generate hundreds.</span>
        </h1>
        
        <p class="hero-subtext anim-fade-up" style="animation-delay: 100ms;">
          Drag-and-drop templates. CSV data. Production-ready PDFs in seconds.
        </p>
        
        <div class="hero-cta anim-fade-up" style="animation-delay: 200ms;">
          <NuxtLink to="/templates" class="btn-primary btn-lg">
            Start Creating
          </NuxtLink>
          <NuxtLink to="/templates" class="btn-ghost">
            View sample templates →
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Bento Grid: Asymmetric Feature Cards -->
    <section class="bento-section">
      <div class="bento-grid">
        <!-- Templates Card: 1×1 -->
        <NuxtLink to="/templates" class="bento-card bento-card--featured card-hover-lift">
          <div class="bento-card__icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <h3 class="bento-card__title">Templates</h3>
          <p class="bento-card__desc">
            Drag-and-drop canvas editor. Position text, images, and logos exactly where you want them.
          </p>
          <span class="bento-card__link">Create template →</span>
        </NuxtLink>

        <!-- Assets Card: 1×1 -->
        <NuxtLink to="/templates/assets" class="bento-card bento-card--tall card-hover-lift">
          <div class="bento-card__icon bento-card__icon--secondary">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
          <h3 class="bento-card__title">Assets</h3>
          <p class="bento-card__desc">
            Logos, backgrounds, free images. Drag in any file, categorized automatically.
          </p>
          <span class="bento-card__link">Manage assets →</span>
        </NuxtLink>

        <!-- Bulk Generate Card: 1×1 -->
        <NuxtLink to="/generate" class="bento-card bento-card--tall bento-card--accent card-hover-lift">
          <div class="bento-card__icon bento-card__icon--accent">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <h3 class="bento-card__title">Bulk Generate</h3>
          <p class="bento-card__desc">
            Upload CSV or paste JSON. Select output format. Download a ZIP with every certificate rendered at 2× resolution.
          </p>
          <span class="bento-card__link">Start generating →</span>
        </NuxtLink>

        <!-- CSV Upload: 1.5×1 -->
        <div class="bento-card bento-card--wide-half">
          <div class="bento-card__icon-small">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </div>
          <div>
            <h4 class="bento-card__title-sm">CSV Upload</h4>
            <p class="bento-card__desc-sm">Paste or upload recipient data</p>
          </div>
        </div>

        <!-- PDF/PNG Output: 1.5×1 -->
        <div class="bento-card bento-card--wide-half">
          <div class="bento-card__icon-small">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <path d="M14 2v6h6"/>
            </svg>
          </div>
          <div>
            <h4 class="bento-card__title-sm">PDF/PNG Output</h4>
            <p class="bento-card__desc-sm">High-res files bundled in ZIP</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works: Narrow Column -->
    <section class="workflow-section">
      <div class="workflow-content">
        <h2 class="workflow-headline">How It Works</h2>
        <div class="workflow-steps">
          <div class="workflow-step">
            <div class="step-number">1</div>
            <h3 class="step-title">Design Template</h3>
            <p class="step-desc">Use the canvas editor to position elements exactly where you want them</p>
          </div>
          <div class="workflow-step">
            <div class="step-number">2</div>
            <h3 class="step-title">Upload Data</h3>
            <p class="step-desc">CSV or JSON with recipient names, dates, and custom fields</p>
          </div>
          <div class="workflow-step">
            <div class="step-number">3</div>
            <h3 class="step-title">Download ZIP</h3>
            <p class="step-desc">Get production-ready PDFs or PNGs in seconds</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer-section">
      <p class="footer-text">fully local · no keys · no limits</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* Hero Section */
.hero-section {
  min-height: 100svh;
  display: grid;
  place-items: center;
  text-align: center;
  padding: var(--space-8) var(--container-padding-x);
  position: relative;
  background: linear-gradient(180deg, var(--color-bg) 0%, var(--color-surface-hover) 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 56ch;
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
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--weight-bold);
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
  font-size: var(--text-hero);
  font-family: var(--font-display);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  color: var(--color-text);
  margin-bottom: var(--space-6);
}

.headline-accent {
  color: var(--color-text-secondary);
  font-weight: var(--weight-regular);
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

/* Bento Grid Section */
.bento-section {
  padding: var(--space-20) var(--container-padding-x);
  max-width: var(--container-max-width);
  margin: 0 auto;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
}

.bento-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  transition: 
    transform var(--duration-normal) var(--ease-out-expo),
    box-shadow var(--duration-normal) var(--ease-out-expo),
    border-color var(--duration-fast) var(--ease-standard);
}

.bento-card--featured { 
  grid-column: span 1; 
  grid-row: span 1;
  padding: var(--space-6);
}

.bento-card--tall { 
  grid-row: span 1; 
}

.bento-card--wide-half {
  grid-column: span 1.5;
  flex-direction: row;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5);
}

.bento-card--accent {
  background: linear-gradient(135deg, var(--color-accent) 0%, hsl(45, 60%, 45%) 100%);
  border-color: transparent;
  color: var(--color-primary);
}

.card-hover-lift:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

.bento-card--accent:hover {
  border-color: transparent;
  box-shadow: var(--shadow-lg);
}

.bento-card__icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-xl);
  background: var(--color-primary-muted);
  color: var(--color-primary);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.bento-card__icon--secondary {
  background: var(--color-accent-muted);
  color: var(--color-accent);
}

.bento-card__icon--accent {
  background: rgba(0, 0, 0, 0.1);
  color: var(--color-primary);
}

.bento-card__icon-small {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  background: var(--color-primary-muted);
  color: var(--color-primary);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.bento-card__title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  color: inherit;
}

.bento-card__title-sm {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-1);
}

.bento-card__desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--color-text-secondary);
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bento-card--accent .bento-card__desc {
  color: rgba(0, 0, 0, 0.7);
}

.bento-card__desc-sm {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  line-height: var(--leading-normal);
  color: var(--color-text-secondary);
}

.bento-card__link {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: var(--color-primary);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: auto;
}

.bento-card--accent .bento-card__link {
  color: var(--color-primary);
}

.bento-card__content-wide {
  display: flex;
  align-items: center;
  gap: var(--space-10);
  justify-content: space-between;
}

/* Workflow Section */
.workflow-section {
  padding: var(--space-24) var(--container-padding-x);
  background: var(--color-surface);
}

.workflow-content {
  max-width: 68ch;
  margin: 0 auto;
  text-align: center;
}

.workflow-headline {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: var(--weight-bold);
  margin-bottom: var(--space-16);
  color: var(--color-text);
}

.workflow-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-12);
}

.workflow-step {
  text-align: center;
}

.step-number {
  width: 56px;
  height: 56px;
  margin: 0 auto var(--space-4);
  background: var(--color-accent);
  color: var(--color-primary);
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--weight-bold);
}

.step-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  margin-bottom: var(--space-2);
}

.step-desc {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--color-text-secondary);
}

/* Footer */
.footer-section {
  padding: var(--space-16) var(--container-padding-x);
  text-align: center;
}

.footer-text {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

/* Animations */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

.anim-fade-up {
  animation: fade-up 0.6s var(--ease-out-expo) both;
}

/* Responsive */
@media (max-width: 1024px) {
  .bento-grid { grid-template-columns: repeat(2, 1fr); }
  .bento-card--wide-half { grid-column: span 1; }
  .workflow-steps { grid-template-columns: 1fr; gap: var(--space-8); }
}

@media (max-width: 640px) {
  .bento-grid { grid-template-columns: 1fr; }
  .bento-card--featured, .bento-card--tall, .bento-card--wide-half {
    grid-column: span 1;
    grid-row: span 1;
  }
  .bento-card--wide-half {
    flex-direction: column;
    align-items: flex-start;
  }
  .hero-cta { flex-direction: column; width: 100%; }
  .hero-cta .btn-primary, .hero-cta .btn-ghost { width: 100%; }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
