<template>
  <div class="page-guide">
    <!-- Floating Nav (reuse from index) -->
    <nav class="floating-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <img src="/badge.png" alt="Certificate Generator" class="brand-badge" />
          <span class="brand-name">Certificate Generator</span>
        </div>
        <div class="nav-menu">
          <NuxtLink to="/" class="nav-link">Home</NuxtLink>
          <NuxtLink to="/templates" class="nav-link">Templates</NuxtLink>
          <NuxtLink to="/generate" class="nav-link">Generate</NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Header -->
    <section class="guide-header">
      <h1 class="guide-title">How it works</h1>
      <p class="guide-subtitle">Four simple steps to generate certificates at scale</p>
    </section>

    <!-- Steps Container -->
    <section class="guide-container">
      <div class="steps-wrapper">
        <!-- Step 1 -->
        <div class="step-block" :class="{ active: activeStep >= 0 }">
          <div class="step-visual">
            <div class="step-number">1</div>
            <div class="step-icon">✏️</div>
          </div>
          <div class="step-content">
            <h2 class="step-title">Design Your Template</h2>
            <p class="step-description">
              Use our drag-and-drop editor to create your certificate design. Add text fields, images, logos, and customize colors and fonts. Position every element with pixel precision.
            </p>
            <ul class="step-features">
              <li>Drag-and-drop interface</li>
              <li>Custom fonts & colors</li>
              <li>Add images & logos</li>
              <li>Preview in real-time</li>
            </ul>
          </div>
        </div>

        <!-- Connector 1 -->
        <div class="step-connector" :class="{ active: activeStep >= 1 }">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" stroke-width="2" />
          </svg>
        </div>

        <!-- Step 2 -->
        <div class="step-block" :class="{ active: activeStep >= 1 }">
          <div class="step-visual">
            <div class="step-number">2</div>
            <div class="step-icon">📋</div>
          </div>
          <div class="step-content">
            <h2 class="step-title">Prepare Your Data</h2>
            <p class="step-description">
              Upload your recipient data as CSV or paste JSON. Our intelligent mapper automatically matches your data columns to template fields. Preview before proceeding.
            </p>
            <ul class="step-features">
              <li>CSV or JSON format</li>
              <li>Automatic field mapping</li>
              <li>Data validation</li>
              <li>Preview each certificate</li>
            </ul>
          </div>
        </div>

        <!-- Connector 2 -->
        <div class="step-connector" :class="{ active: activeStep >= 2 }">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" stroke-width="2" />
          </svg>
        </div>

        <!-- Step 3 -->
        <div class="step-block" :class="{ active: activeStep >= 2 }">
          <div class="step-visual">
            <div class="step-number">3</div>
            <div class="step-icon">⚡</div>
          </div>
          <div class="step-content">
            <h2 class="step-title">Generate Certificates</h2>
            <p class="step-description">
              Click generate and watch our engine create all your certificates in seconds. Choose PDF or PNG format, set resolution, and configure output options. No waiting, no limits.
            </p>
            <ul class="step-features">
              <li>PDF or PNG output</li>
              <li>Batch processing</li>
              <li>Adjustable resolution</li>
              <li>Instant processing</li>
            </ul>
          </div>
        </div>

        <!-- Connector 3 -->
        <div class="step-connector" :class="{ active: activeStep >= 3 }">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" stroke-width="2" />
          </svg>
        </div>

        <!-- Step 4 -->
        <div class="step-block" :class="{ active: activeStep >= 3 }">
          <div class="step-visual">
            <div class="step-number">4</div>
            <div class="step-icon">📥</div>
          </div>
          <div class="step-content">
            <h2 class="step-title">Download & Distribute</h2>
            <p class="step-description">
              Download all certificates as a single ZIP file, ready for printing or email distribution. No additional processing needed—everything is production-ready from day one.
            </p>
            <ul class="step-features">
              <li>ZIP file download</li>
              <li>Print-ready quality</li>
              <li>Email-ready format</li>
              <li>Organized file structure</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Progress Indicator -->
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
    </section>

    <!-- Call-to-Action Section -->
    <section class="guide-cta">
      <h2>Ready to get started?</h2>
      <p>No sign-up required. Start creating your first certificate now.</p>
      <NuxtLink to="/templates" class="btn-primary btn-large">Create Template</NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const activeStep = ref(-1)
const progressPercent = computed(() => Math.min((activeStep.value + 1) * 25, 100))

onMounted(() => {
  // Auto-progress through steps
  let step = -1
  const interval = setInterval(() => {
    step++
    if (step <= 3) {
      activeStep.value = step
    } else {
      clearInterval(interval)
    }
  }, 800)
})
</script>

<style scoped>
.page-guide {
  min-height: 100vh;
  background: var(--color-mist);
  padding-bottom: 80px;
}

/* Reuse floating nav styles */
.floating-nav {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 36px;
  border: 1px solid rgba(212, 212, 216, 0.5);
  box-shadow: rgba(0, 0, 0, 0.04) 0px 4px 12px 0px;
  padding: 12px 24px;
  animation: navSlideDown 0.6s var(--ease-out-expo);
}

@keyframes navSlideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.nav-container {
  display: flex;
  align-items: center;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.brand-badge {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  flex-shrink: 0;
}

.brand-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-obsidian);
  font-family: var(--font-cosmica);
  letter-spacing: -0.3px;
}

.nav-menu {
  display: flex;
  gap: 24px;
  flex: 1;
}

.nav-link {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-ink);
  font-family: var(--font-cosmica);
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--color-obsidian);
}

/* Header */
.guide-header {
  text-align: center;
  padding: 120px 20px 60px;
  max-width: 800px;
  margin: 0 auto;
}

.guide-title {
  font-size: 64px;
  font-weight: 700;
  color: var(--color-obsidian);
  font-family: var(--font-cosmica);
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.guide-subtitle {
  font-size: 18px;
  color: var(--color-ink);
  font-family: var(--font-cosmica);
  font-weight: 400;
}

/* Guide Container */
.guide-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
}

.steps-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Step Block */
.step-block {
  background: var(--color-snow);
  border-radius: 36px;
  padding: 48px;
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 48px;
  align-items: center;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s var(--ease-out-expo);
  border: 1px solid var(--color-pebble);
}

.step-block:last-of-type {
  margin-bottom: 0;
}

.step-block.active {
  opacity: 1;
  transform: translateY(0);
}

.step-visual {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-number {
  position: absolute;
  font-size: 120px;
  font-weight: 700;
  color: var(--color-mist);
  font-family: var(--font-cosmica);
  z-index: 1;
}

.step-icon {
  font-size: 80px;
  z-index: 2;
  animation: float 3s ease-in-out infinite;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-obsidian);
  font-family: var(--font-cosmica);
}

.step-description {
  font-size: 16px;
  color: var(--color-ink);
  line-height: 1.56;
  font-family: var(--font-cosmica);
}

.step-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.step-features li {
  font-size: 14px;
  color: var(--color-ink);
  font-family: var(--font-cosmica);
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 0;
}

.step-features li::before {
  content: '✓';
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: var(--color-mist);
  border-radius: 4px;
  color: var(--color-obsidian);
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
}

/* Step Connector */
.step-connector {
  height: 60px;
  margin: 0;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 0;
}

.step-connector svg {
  width: 4px;
  height: 100%;
  color: var(--color-pebble);
  transition: color 0.6s var(--ease-out-expo);
}

.step-connector.active svg {
  color: var(--color-obsidian);
}

/* Progress Bar */
.progress-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--color-pebble);
  z-index: 100;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-ember) 0%, var(--color-orchid-flash) 100%);
  transition: width 0.6s var(--ease-out-expo);
}

/* CTA Section */
.guide-cta {
  text-align: center;
  padding: 80px 20px;
  max-width: 600px;
  margin: 0 auto;
}

.guide-cta h2 {
  font-size: 40px;
  font-weight: 700;
  color: var(--color-obsidian);
  font-family: var(--font-cosmica);
  margin-bottom: 12px;
}

.guide-cta p {
  font-size: 16px;
  color: var(--color-ink);
  font-family: var(--font-cosmica);
  margin-bottom: 32px;
}

.btn-large {
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 500;
  display: inline-block;
}

/* Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .nav-container {
    gap: 20px;
  }

  .nav-menu {
    gap: 16px;
  }

  .step-block {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 32px;
  }

  .step-number {
    font-size: 80px;
  }

  .step-icon {
    font-size: 60px;
  }
}

@media (max-width: 768px) {
  .floating-nav {
    padding: 10px 16px;
    border-radius: 28px;
  }

  .nav-container {
    gap: 12px;
  }

  .nav-menu {
    display: none;
  }

  .brand-name {
    display: none;
  }

  .guide-header {
    padding: 100px 20px 40px;
  }

  .guide-title {
    font-size: 40px;
  }

  .guide-subtitle {
    font-size: 16px;
  }

  .step-block {
    padding: 24px;
    border-radius: 28px;
  }

  .step-visual {
    height: 120px;
  }

  .step-number {
    font-size: 60px;
  }

  .step-icon {
    font-size: 48px;
  }

  .step-title {
    font-size: 24px;
  }

  .step-description {
    font-size: 14px;
  }

  .guide-cta h2 {
    font-size: 32px;
  }

  .guide-cta p {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .guide-title {
    font-size: 32px;
  }

  .step-block {
    padding: 20px;
  }

  .step-content {
    gap: 12px;
  }

  .step-title {
    font-size: 20px;
  }
}
</style>
