<template>
  <div id="si-root">
    <div class="si-grid">
      <!-- LEFT: brand panel -->
      <div class="brand-panel">
        <div class="brand-texture"></div>
        <div class="brand-glow"></div>
        <div class="brand-arc brand-arc-1"></div>
        <div class="brand-arc brand-arc-2"></div>

        <NuxtLink to="/" class="brand-logo">
          <span class="logo-mark">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="9.5" r="5.5" stroke="#F5521E" stroke-width="2" />
              <path d="M9 14l-2 7 5-3 5 3-2-7" stroke="#fff" stroke-width="2" stroke-linejoin="round" />
            </svg>
          </span>
          <span class="logo-text">Certif<span class="accent">y</span></span>
        </NuxtLink>

        <div class="brand-hero">
          <div class="hero-label">
            <span class="label-dot"></span>
            <span>Welcome back</span>
          </div>
          <h2 class="hero-title">Your certificates<br>are waiting.</h2>
          <p class="hero-sub">Resume editing, download past batches, or launch a new template.</p>

          <div class="hero-pills">
            <div class="pill">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M13 3L5 13h6l-1 8 8-10h-6l1-8z" stroke="#F5521E" stroke-width="2" stroke-linejoin="round" /></svg>
              <span>12k+ <span class="pill-dim">certs/day</span></span>
            </div>
            <div class="pill">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#F5521E" stroke-width="1.8" /><path d="M12 7v5l3 3" stroke="#F5521E" stroke-width="1.8" stroke-linecap="round" /></svg>
              <span>9s <span class="pill-dim">avg batch</span></span>
            </div>
          </div>

          <div class="cert-showcase">
            <div class="cert-card" data-float>
              <div class="cert-ribbon">
                <div class="ribbon-line"></div>
                <div class="ribbon-label">Certificate of Achievement</div>
                <div class="ribbon-line"></div>
              </div>
              <div class="cert-recipient">Olivia Hartwell</div>
              <div class="cert-divider"></div>
              <div class="cert-desc">for completing the Advanced Product Design program</div>
              <div class="cert-signatures">
                <span class="sig-name">A. Rivera</span>
                <span class="sig-dot"></span>
                <span class="sig-name">M. Chen</span>
              </div>
            </div>
            <div class="cert-chip" data-float-delay>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M13 3L5 13h6l-1 8 8-10h-6l1-8z" stroke="#fff" stroke-width="2.2" stroke-linejoin="round" /></svg>
              <div><div class="chip-num">248 PDFs ready</div><div class="chip-sub">Spring Cohort 2026</div></div>
            </div>
          </div>
        </div>

        <div class="brand-footer">&copy; 2026 Certify</div>
      </div>

      <!-- RIGHT: form panel -->
      <div class="form-panel">
        <div class="form-wrap">
          <h1 class="form-title">Sign in</h1>
          <p class="form-switch">Don't have an account? <NuxtLink to="/signup" class="accent-link">Sign up free</NuxtLink></p>

          <Transition name="fade">
            <div v-if="showError" class="error-banner">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#DC3545" stroke-width="1.8" /><path d="M12 8v5M12 16v.5" stroke="#DC3545" stroke-width="2" stroke-linecap="round" /></svg>
              {{ errorMsg }}
            </div>
          </Transition>

          <form @submit.prevent="onSubmit" class="si-form">
            <!-- email -->
            <div>
              <label class="field-label">Email</label>
              <div class="field-wrap" :class="{ focused: emailFocused }">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="3" stroke="#6E665E" stroke-width="1.8" /><path d="M2 8l10 7 10-7" stroke="#6E665E" stroke-width="1.8" stroke-linecap="round" /></svg>
                <input v-model="email" type="email" placeholder="you@example.com" @focus="emailFocused = true" @blur="emailFocused = false" @input="clearError" class="field-input" />
              </div>
            </div>

            <!-- password -->
            <div>
              <div class="field-header">
                <label class="field-label">Password</label>
                <a href="#" @click.prevent="forgotPwd" class="forgot-link">Forgot password?</a>
              </div>
              <div class="field-wrap" :class="{ focused: pwdFocused }">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#6E665E" stroke-width="1.8" /><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#6E665E" stroke-width="1.8" /></svg>
                <input v-model="password" :type="showPwd ? 'text' : 'password'" placeholder="••••••••" @focus="pwdFocused = true" @blur="pwdFocused = false" @input="clearError" class="field-input" />
                <button type="button" @click="showPwd = !showPwd" class="pwd-toggle" :aria-label="showPwd ? 'Hide password' : 'Show password'">
                  <svg v-if="showPwd" width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="#6E665E" stroke-width="1.7" /><circle cx="12" cy="12" r="2.6" stroke="#6E665E" stroke-width="1.7" /></svg>
                  <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.4 5.2A9.6 9.6 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3 3.6M6.2 6.2A16 16 0 0 0 2 12s3.5 7 10 7a9.5 9.5 0 0 0 3.3-.6" stroke="#6E665E" stroke-width="1.7" stroke-linecap="round" /></svg>
                </button>
              </div>
            </div>

            <!-- remember me -->
            <label class="remember-row" @click="remember = !remember">
              <span class="checkbox" :class="{ checked: remember }">
                <svg v-if="remember" width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12l4.5 4.5L19 7" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
              Keep me signed in
            </label>

            <!-- submit -->
            <button type="submit" class="submit-btn" :disabled="loading" @mouseenter="ctaIn" @mouseleave="ctaOut">
              <template v-if="loading">
                <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" stroke-width="2.5" /><path d="M12 3a9 9 0 0 1 9 9" stroke="#fff" stroke-width="2.5" stroke-linecap="round" /></svg>
                Signing in&hellip;
              </template>
              <template v-else>
                Sign in
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </template>
            </button>
          </form>

          <div class="divider-row">
            <div class="divider-line"></div>
            <span class="divider-text">or continue with</span>
            <div class="divider-line"></div>
          </div>

          <div class="social-row">
            <button @click="socialLogin" class="social-btn" @mouseenter="socialIn" @mouseleave="socialOut">
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button @click="socialLogin" class="social-btn" @mouseenter="socialIn" @mouseleave="socialOut">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#14110E"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
              GitHub
            </button>
          </div>

          <p class="terms">By signing in you agree to our <a href="#">Terms</a> and <a href="#">Privacy policy</a>.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const { ctaIn, ctaOut } = useHoverIntents();

const email = ref("");
const password = ref("");
const remember = ref(false);
const showPwd = ref(false);
const emailFocused = ref(false);
const pwdFocused = ref(false);
const loading = ref(false);
const showError = ref(false);
const errorMsg = ref("");

let errorTimer: ReturnType<typeof setTimeout> | null = null;

function clearError() {
  showError.value = false;
}

function forgotPwd() {
  showError.value = true;
  errorMsg.value = "Password reset email sent &mdash; check your inbox.";
  if (errorTimer) clearTimeout(errorTimer);
  errorTimer = setTimeout(() => { showError.value = false; }, 4000);
}

function socialLogin() {
  showError.value = true;
  errorMsg.value = "Social login not wired in demo mode.";
  if (errorTimer) clearTimeout(errorTimer);
  errorTimer = setTimeout(() => { showError.value = false; }, 4000);
}

function socialIn(e: MouseEvent) {
  const t = e.currentTarget as HTMLElement;
  t.style.borderColor = "#14110E";
  t.style.transform = "translateY(-1px)";
}
function socialOut(e: MouseEvent) {
  const t = e.currentTarget as HTMLElement;
  t.style.borderColor = "rgba(20,17,14,0.09)";
  t.style.transform = "none";
}

function onSubmit() {
  if (!email.value) {
    showError.value = true;
    errorMsg.value = "Please enter your email address.";
    return;
  }
  if (!password.value) {
    showError.value = true;
    errorMsg.value = "Please enter your password.";
    return;
  }
  loading.value = true;
  showError.value = false;
  setTimeout(() => {
    loading.value = false;
    navigateTo("/templates");
  }, 1400);
}
</script>

<style scoped>
#si-root {
  --accent: #F5521E;
  --ink: #14110E;
  --muted: #6E665E;
  --cream: #F2ECE7;
  --line: rgba(20, 17, 14, 0.09);
  font-family: "General Sans", system-ui, sans-serif;
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

#si-root ::selection { background: var(--accent); color: #fff; }
.accent { color: var(--accent); }

@keyframes si-floaty  { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
@keyframes si-floatyB { 0%,100% { transform: translateY(0) } 50% { transform: translateY(8px) } }
@keyframes si-fadeIn   { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: translateY(0) } }
@keyframes si-spinSlow { to { transform: rotate(360deg) } }

.si-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

/* ── Brand Panel ── */
.brand-panel {
  background: #14110E;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 36px 44px;
}
.brand-texture {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 36px 36px;
  pointer-events: none;
}
.brand-glow {
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  width: 420px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(245,82,30,0.36), transparent 68%);
  filter: blur(8px);
  pointer-events: none;
}
.brand-arc {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.brand-arc-1 { top: -80px; right: -80px; width: 260px; height: 260px; border: 1.5px solid rgba(245,82,30,0.18); }
.brand-arc-2 { top: -50px; right: -50px; width: 180px; height: 180px; border: 1.5px solid rgba(245,82,30,0.10); }

.brand-logo {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 11px;
  position: relative;
  z-index: 2;
}
.logo-mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: rgba(245,82,30,0.18);
  border: 1px solid rgba(245,82,30,0.3);
}
.logo-text { font-size: 16px; font-weight: 600; color: #fff; }

.brand-hero {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 2;
}
.hero-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}
.label-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 4px rgba(245,82,30,0.25);
}
.hero-label span {
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
}
.hero-title {
  margin: 0 0 12px;
  font-size: clamp(34px, 3.4vw, 46px);
  font-weight: 600;
  color: #fff;
  line-height: 1.0;
  letter-spacing: -0.035em;
}
.hero-sub {
  margin: 0 0 24px;
  font-size: 14.5px;
  color: rgba(255,255,255,0.48);
  line-height: 1.55;
  max-width: 300px;
}

.hero-pills {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}
.pill {
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 999px;
  padding: 6px 13px;
}
.pill span { font-size: 12.5px; font-weight: 600; color: #fff; }
.pill-dim { font-weight: 400; color: rgba(255,255,255,0.5); }

.cert-showcase { position: relative; width: 100%; }
.cert-card {
  animation: si-floaty 7s ease-in-out infinite;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px;
  padding: 24px 24px 12px;
  backdrop-filter: blur(12px);
  height: 180px;
}
.cert-ribbon {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-bottom: 8px;
}
.ribbon-line { width: 20px; height: 1px; background: rgba(245,82,30,0.5); border-radius: 1px; }
.ribbon-label { font-size: 7.5px; letter-spacing: 0.32em; text-transform: uppercase; color: rgba(255,255,255,0.35); }
.cert-recipient {
  font-family: "Playfair Display", serif;
  font-size: 21px;
  font-weight: 600;
  color: #fff;
  text-align: center;
  line-height: 1.15;
}
.cert-divider { width: 36px; height: 1.5px; background: var(--accent); margin: 7px auto; border-radius: 1px; }
.cert-desc { font-size: 9.5px; color: rgba(255,255,255,0.36); text-align: center; line-height: 1.5; margin-bottom: 10px; }
.cert-signatures {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 9px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.sig-name { font-family: "Allura", cursive; font-size: 17px; color: rgba(255,255,255,0.62); }
.sig-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(245,82,30,0.5); }

.cert-chip {
  animation: si-floatyB 5.5s ease-in-out infinite 0.6s;
  position: absolute;
  bottom: -18px;
  right: 16px;
  background: #F5521E;
  border-radius: 12px;
  padding: 9px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 10px 26px rgba(245,82,30,0.46);
}
.chip-num { font-size: 11.5px; font-weight: 700; color: #fff; letter-spacing: 0.01em; }
.chip-sub { font-size: 10px; color: rgba(255,255,255,0.72); }

.brand-footer {
  font-size: 12px;
  color: rgba(255,255,255,0.25);
  position: relative;
  z-index: 2;
  margin-top: 32px;
}

/* ── Form Panel ── */
.form-panel {
  background: #F2ECE7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
}
.form-wrap {
  width: 100%;
  max-width: 400px;
  animation: si-fadeIn .6s cubic-bezier(.16,1,.3,1) both;
}
.form-title { margin: 0 0 6px; font-size: 28px; font-weight: 600; letter-spacing: -0.025em; }
.form-switch { margin: 0 0 30px; font-size: 15px; color: var(--muted); }
.accent-link { color: var(--accent); font-weight: 600; text-decoration: none; }

.error-banner {
  display: flex;
  align-items: center;
  gap: 9px;
  background: rgba(220,53,69,0.07);
  border: 1px solid rgba(220,53,69,0.22);
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 13.5px;
  color: #B91C2E;
  margin-bottom: 4px;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.si-form { display: flex; flex-direction: column; gap: 16px; }
.field-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 7px; color: var(--ink); }
.field-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px; }
.field-header .field-label { margin-bottom: 0; }
.forgot-link { font-size: 12.5px; color: var(--accent); text-decoration: none; font-weight: 500; }

.field-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1.5px solid var(--line);
  border-radius: 11px;
  padding: 10px 14px;
  transition: border-color .15s;
}
.field-wrap.focused {
  border-color: var(--ink);
}
.field-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 14.5px;
  color: var(--ink);
  box-shadow: none;
  -webkit-appearance: none;
}
.pwd-toggle {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: grid;
  place-items: center;
  color: var(--muted);
}

.remember-row {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
}
.checkbox {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 5px;
  flex-shrink: 0;
  background: #fff;
  border: 1.5px solid var(--line);
  transition: background .15s, border-color .15s;
}
.checkbox.checked { background: var(--ink); border-color: var(--ink); }

.submit-btn {
  border: none;
  background: var(--ink);
  color: #fff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  padding: 15px;
  border-radius: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  box-shadow: 0 8px 22px rgba(20,17,14,0.2);
  transition: transform .2s, box-shadow .2s, opacity .2s;
  margin-top: 4px;
}
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.spinner { animation: si-spinSlow .8s linear infinite; }

.divider-row { display: flex; align-items: center; gap: 14px; margin: 22px 0; }
.divider-line { flex: 1; height: 1px; background: rgba(20,17,14,0.1); }
.divider-text { font-size: 12.5px; color: var(--muted); font-weight: 500; }

.social-row { display: flex; gap: 10px; }
.social-btn {
  flex: 1;
  border: 1px solid var(--line);
  background: #fff;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  padding: 12px 14px;
  border-radius: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: border-color .2s, transform .15s;
}

.terms {
  margin: 28px 0 0;
  font-size: 12.5px;
  color: var(--muted);
  text-align: center;
  line-height: 1.5;
}
.terms a { color: var(--ink); text-decoration: underline; text-underline-offset: 2px; }

@media (max-width: 768px) {
  .si-grid { grid-template-columns: 1fr; }
  .brand-panel { display: none; }
  .form-panel { min-height: 100vh; }
}
</style>
