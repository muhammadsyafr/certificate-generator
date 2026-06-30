<template>
  <div id="nf-root">
    <div class="nf-card">
      <NuxtLink to="/" class="nf-logo">
        <span class="logo-mark">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="9.5" r="5.5" stroke="#F5521E" stroke-width="2" />
            <path d="M9 14l-2 7 5-3 5 3-2-7" stroke="#fff" stroke-width="2" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="logo-text">Certif<span class="accent">y</span></span>
      </NuxtLink>

      <div class="nf-code">404</div>
      <h1 class="nf-title">Page not found</h1>
      <p class="nf-desc">The page you're looking for doesn't exist or has been moved.</p>

      <NuxtLink to="/" class="nf-btn" @mouseenter="ctaIn" @mouseleave="ctaOut">
        Back to home
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { ctaIn, ctaOut } = useHoverIntents();
</script>

<style scoped>
#nf-root {
  --accent: #F5521E;
  --ink: #14110E;
  --muted: #6E665E;
  --cream: #F2ECE7;
  font-family: "General Sans", system-ui, sans-serif;
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  padding: 32px;
}

.accent { color: var(--accent); }

.nf-card {
  text-align: center;
  max-width: 400px;
  animation: nf-fadeIn .6s cubic-bezier(.16,1,.3,1) both;
}

@keyframes nf-fadeIn { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: translateY(0) } }

.nf-logo {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
}
.logo-mark {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--ink);
}
.logo-text { font-size: 17px; font-weight: 600; }

.nf-code {
  font-family: "Playfair Display", serif;
  font-size: 96px;
  font-weight: 700;
  line-height: 1;
  color: var(--ink);
  margin-bottom: 12px;
}
.nf-title { margin: 0 0 10px; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; }
.nf-desc { margin: 0 0 32px; font-size: 15px; color: var(--muted); line-height: 1.5; }

.nf-btn {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--ink);
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  padding: 14px 24px;
  border-radius: 999px;
  box-shadow: 0 8px 22px rgba(20,17,14,0.18);
  transition: transform .25s, box-shadow .25s;
}
</style>
