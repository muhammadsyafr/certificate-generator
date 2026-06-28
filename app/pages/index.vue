<template>
  <div class="page-landing">
    <!-- Floating Navigation -->
    <nav class="floating-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <img src="/badge.png" alt="Certificate Generator" class="brand-badge" />
          <span class="brand-name">Certificate Generator</span>
        </div>
        <div class="nav-menu">
          <NuxtLink to="/guide" class="nav-link">How it works</NuxtLink>
          <NuxtLink to="/templates" class="nav-link">Template Editor</NuxtLink>
          <NuxtLink to="/generate" class="nav-link">Bulk Generate</NuxtLink>
          <NuxtLink to="/templates/assets" class="nav-link">Asset Library</NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Floating Help Button -->
    <NuxtLink to="/guide" class="floating-help">
      <span class="help-icon">?</span>
      <span class="help-tooltip">Guide</span>
    </NuxtLink>

    <!-- Hero Section — Full Height -->
    <section class="hero-full">
      <div class="hero-backdrop"></div>
      
      <div class="hero-content">
        <h1 class="hero-title">
          Design once.<br />
          <span class="hero-accent">Generate for</span>
          <span class="hero-rotator">
            <Transition name="rotator" mode="out-in">
              <span :key="currentRotatorWord" class="rotator-word" :style="{ color: currentRotatorColor }">{{ currentRotatorWord }}</span>
            </Transition>
          </span>
        </h1>
        
        <p class="hero-subtitle">
          Drag-and-drop templates. CSV data. Production-ready PDFs in seconds.
        </p>
        
        <div class="hero-cta-group">
          <NuxtLink to="/templates" class="btn-primary btn-large">Start Creating</NuxtLink>
          <div class="hero-email-group">
            <input 
              type="email" 
              placeholder="your@email.com" 
              class="email-input-hero"
            />
            <button class="btn-email-submit">→</button>
          </div>
        </div>

        <div class="hero-features">
          <div class="feature-badge">
            <span class="badge-icon">✏️</span>
            <span>Drag & Drop</span>
          </div>
          <div class="feature-badge">
            <span class="badge-icon">⚡</span>
            <span>Bulk Generate</span>
          </div>
          <div class="feature-badge">
            <span class="badge-icon">🎨</span>
            <span>Asset Library</span>
          </div>
          <div class="feature-badge">
            <span class="badge-icon">🔤</span>
            <span>Custom Fonts</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Rotating words with colors
const rotatorWords = [
  { word: 'assessment', color: '#ff5a00' }, // Ember
  { word: 'awards', color: '#fe45e2' }, // Orchid Flash
  { word: 'certificates', color: '#ff5a00' }, // Ember
  { word: 'completion', color: '#fe45e2' }, // Orchid Flash
  { word: 'credentials', color: '#ff5a00' }, // Ember
  { word: 'course', color: '#fe45e2' }, // Orchid Flash
]

const rotatorIndex = ref(-1)
const currentRotatorWord = computed(() =>
  rotatorIndex.value >= 0 ? rotatorWords[rotatorIndex.value].word : '',
)
const currentRotatorColor = computed(() =>
  rotatorIndex.value >= 0 ? rotatorWords[rotatorIndex.value].color : '#09090b',
)

let rotatorTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  rotatorIndex.value = 0
  rotatorTimer = setInterval(() => {
    rotatorIndex.value = (rotatorIndex.value + 1) % rotatorWords.length
  }, 2500)
})

onUnmounted(() => {
  if (rotatorTimer) clearInterval(rotatorTimer)
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.page-landing {
  min-height: 100vh;
  background: var(--color-mist);
  position: relative;
  overflow: hidden;
}

/* Floating Navigation */
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
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--color-obsidian);
}

/* Floating Help Button */
.floating-help {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 999;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-obsidian);
  color: var(--color-snow);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s var(--ease-out-expo);
  animation: floatIn 0.6s var(--ease-out-expo) 0.8s both;
}

.floating-help:hover {
  transform: translateY(-4px);
  box-shadow: rgba(0, 0, 0, 0.12) 0px 8px 24px 0px;
}

.floating-help:active {
  transform: scale(0.95);
}

.help-icon {
  font-size: 28px;
  font-weight: 700;
  font-family: var(--font-cosmica);
  line-height: 1;
}

.help-tooltip {
  position: absolute;
  background: rgba(9, 9, 11, 0.9);
  color: var(--color-snow);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  font-family: var(--font-cosmica);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  bottom: 70px;
  right: 0;
}

.floating-help:hover .help-tooltip {
  opacity: 1;
}

@keyframes floatIn {
  from {
    opacity: 0;
    transform: scale(0) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Hero Section */
.hero-full {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 120px 20px 60px;
  position: relative;
  text-align: center;
}

.hero-backdrop {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 90, 0, 0.04) 0%,
    rgba(254, 69, 226, 0.04) 100%
  );
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  animation: heroFadeUp 0.8s var(--ease-out-expo) 0.2s both;
}

@keyframes heroFadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  font-size: 64px;
  font-weight: 700;
  line-height: 1.1;
  color: var(--color-obsidian);
  font-family: var(--font-cosmica);
  margin-bottom: 24px;
  letter-spacing: -0.5px;
}

.hero-highlight {
  font-weight: 300;
  color: var(--color-steel);
  background: linear-gradient(
    135deg,
    var(--color-ember) 0%,
    var(--color-orchid-flash) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-rotator {
  display: inline-block;
  min-width: 180px;
  text-align: left;
  margin-left: 8px;
  position: relative;
}

.rotator-word {
  display: inline-block;
  font-weight: 700;
  color: var(--color-obsidian);
  white-space: nowrap;
}

.rotator-enter-active,
.rotator-leave-active {
  transition: all 0.5s var(--ease-out-expo);
}

.rotator-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.rotator-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.hero-subtitle {
  font-size: 18px;
  line-height: 1.56;
  color: var(--color-ink);
  font-family: var(--font-cosmica);
  margin-bottom: 48px;
  font-weight: 400;
}

.hero-cta-group {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 60px;
}

.btn-large {
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 500;
}

.hero-email-group {
  display: flex;
  gap: 8px;
  background: var(--color-snow);
  border-radius: 36px;
  padding: 6px 6px;
  border: 1px solid var(--color-pebble);
  transition: all 0.2s ease;
}

.hero-email-group:focus-within {
  border-color: var(--color-obsidian);
  box-shadow: 0 0 0 3px rgba(9, 9, 11, 0.08);
}

.email-input-hero {
  background: transparent;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  color: var(--color-ink);
  font-family: var(--font-cosmica);
  min-width: 200px;
  outline: none;
}

.email-input-hero::placeholder {
  color: var(--color-ash);
}

.btn-email-submit {
  background: var(--color-obsidian);
  color: var(--color-snow);
  border: none;
  border-radius: 30px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s ease;
}

.btn-email-submit:hover {
  background: var(--color-ink);
  transform: translateX(2px);
}

/* Feature Badges */
.hero-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  max-width: 600px;
  margin: 0 auto;
  animation: badgeStagger 0.6s var(--ease-out-expo) 0.4s both;
}

@keyframes badgeStagger {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-badge {
  background: var(--color-snow);
  border: 1px solid var(--color-pebble);
  border-radius: 28px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--color-ink);
  font-family: var(--font-cosmica);
  font-weight: 500;
  transition: all 0.2s ease;
}

.feature-badge:hover {
  border-color: var(--color-obsidian);
  background: var(--color-mist);
  transform: translateY(-2px);
}

.badge-icon {
  font-size: 18px;
}

/* Responsive */
@media (max-width: 1024px) {
  .nav-container {
    gap: 20px;
  }

  .nav-menu {
    gap: 16px;
  }

  .nav-link {
    font-size: 12px;
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

  .hero-full {
    min-height: 100vh;
    padding: 100px 20px 60px;
  }

  .hero-title {
    font-size: 40px;
  }

  .hero-subtitle {
    font-size: 16px;
    margin-bottom: 32px;
  }

  .hero-cta-group {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 40px;
  }

  .hero-email-group {
    width: 100%;
  }

  .email-input-hero {
    min-width: 100%;
    flex: 1;
  }

  .hero-features {
    grid-template-columns: repeat(2, 1fr);
    max-width: 100%;
    gap: 12px;
  }

  .feature-badge {
    padding: 10px 12px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 14px;
  }

  .btn-large {
    width: 100%;
  }

  .hero-features {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
