<template>
  <div id="su-root">
    <div class="su-grid">
      <!-- LEFT: brand panel -->
      <div class="brand-panel">
        <div class="brand-orb brand-orb-tr"></div>
        <div class="brand-orb brand-orb-bl"></div>

        <NuxtLink to="/" class="brand-logo">
          <span class="logo-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="9.5" r="5.5" stroke="#F5521E" stroke-width="2" />
              <path d="M9 14l-2 7 5-3 5 3-2-7" stroke="#fff" stroke-width="2" stroke-linejoin="round" />
            </svg>
          </span>
          <span class="logo-text">Certif<span class="accent">y</span></span>
        </NuxtLink>

        <div class="brand-hero">
          <div class="hero-eyebrow">Get started free</div>
          <h2 class="hero-title">Create your first<br>certificate today.</h2>
          <p class="hero-sub">No credit card needed. Design, preview and export your first batch completely free.</p>

          <div class="perks-list">
            <div v-for="p in perks" :key="p" class="perk-row">
              <span class="perk-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4.5 4.5L19 7" stroke="#F5521E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
              <span class="perk-text">{{ p }}</span>
            </div>
          </div>

          <div class="users-badge" data-float>
            <div class="avatar-stack">
              <span class="avatar" style="background:linear-gradient(135deg,#F5521E,#ff8a5b)">A</span>
              <span class="avatar" style="background:linear-gradient(135deg,#2F6BFF,#5b8fff)">M</span>
              <span class="avatar" style="background:linear-gradient(135deg,#1F8A5B,#2dba7d)">P</span>
            </div>
            <div>
              <div class="users-num">Join 4,000+ users</div>
              <div class="users-sub">issuing certificates every day</div>
            </div>
          </div>
        </div>

        <div class="brand-footer">&copy; 2026 Certify</div>
      </div>

      <!-- RIGHT: form panel -->
      <div class="form-panel">
        <div class="form-wrap">
          <h1 class="form-title">Create account</h1>
          <p class="form-switch">Already have an account? <NuxtLink to="/signin" class="accent-link">Sign in</NuxtLink></p>

          <Transition name="fade">
            <div v-if="showBanner" class="banner" :class="{ 'banner-ok': bannerOk, 'banner-err': !bannerOk }">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" /><path d="M12 8v5M12 16v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
              {{ bannerMsg }}
            </div>
          </Transition>

          <form @submit.prevent="onSubmit" class="su-form">
            <!-- name row -->
            <div class="name-row">
              <div>
                <label class="field-label">First name</label>
                <input v-model="firstName" type="text" placeholder="Olivia" class="field-input" :class="{ focused: focusA }" @focus="focusA = true" @blur="focusA = false" />
              </div>
              <div>
                <label class="field-label">Last name</label>
                <input v-model="lastName" type="text" placeholder="Hartwell" class="field-input" :class="{ focused: focusB }" @focus="focusB = true" @blur="focusB = false" />
              </div>
            </div>

            <!-- email -->
            <div>
              <label class="field-label">Work email</label>
              <div class="field-wrap" :class="{ focused: emailFocused }">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="3" stroke="#6E665E" stroke-width="1.8" /><path d="M2 8l10 7 10-7" stroke="#6E665E" stroke-width="1.8" stroke-linecap="round" /></svg>
                <input v-model="email" type="email" placeholder="you@company.com" @focus="emailFocused = true" @blur="emailFocused = false" @input="clearBanner" class="field-input-plain" />
              </div>
            </div>

            <!-- password -->
            <div>
              <label class="field-label">Password</label>
              <div class="field-wrap" :class="{ focused: pwdFocused }">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#6E665E" stroke-width="1.8" /><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#6E665E" stroke-width="1.8" /></svg>
                <input v-model="password" :type="showPwd ? 'text' : 'password'" placeholder="Min. 8 characters" @focus="pwdFocused = true" @blur="pwdFocused = false" class="field-input-plain" />
                <button type="button" @click="showPwd = !showPwd" class="pwd-toggle" :aria-label="showPwd ? 'Hide password' : 'Show password'">
                  <svg v-if="showPwd" width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="#6E665E" stroke-width="1.7" /><circle cx="12" cy="12" r="2.6" stroke="#6E665E" stroke-width="1.7" /></svg>
                  <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.4 5.2A9.6 9.6 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3 3.6M6.2 6.2A16 16 0 0 0 2 12s3.5 7 10 7a9.5 9.5 0 0 0 3.3-.6" stroke="#6E665E" stroke-width="1.7" stroke-linecap="round" /></svg>
                </button>
              </div>
              <div v-if="password.length > 0" class="strength-wrap">
                <div class="strength-track">
                  <div class="strength-bar" :style="{ width: (pwdScore / 4 * 100) + '%', background: strengthColor }"></div>
                </div>
                <div class="strength-meta">
                  <span :style="{ color: strengthHex }">{{ strengthLabel }}</span>
                  <span class="strength-tip">{{ strengthTip }}</span>
                </div>
              </div>
            </div>

            <!-- role -->
            <div>
              <label class="field-label">I'm mainly a&hellip;</label>
              <div class="role-row">
                <button v-for="r in roles" :key="r.id" type="button" class="role-btn" :class="{ active: role === r.id }" @click="role = r.id">{{ r.label }}</button>
              </div>
            </div>

            <!-- terms -->
            <label class="terms-row" @click="termsAgreed = !termsAgreed">
              <span class="checkbox" :class="{ checked: termsAgreed }">
                <svg v-if="termsAgreed" width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12l4.5 4.5L19 7" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
              <span>I agree to the <a href="#">Terms of service</a> and <a href="#">Privacy policy</a></span>
            </label>

            <!-- submit -->
            <button type="submit" class="submit-btn" :disabled="loading" @mouseenter="ctaIn" @mouseleave="ctaOut">
              <template v-if="loading">
                <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" stroke-width="2.5" /><path d="M12 3a9 9 0 0 1 9 9" stroke="#fff" stroke-width="2.5" stroke-linecap="round" /></svg>
                Creating account&hellip;
              </template>
              <template v-else>
                Create free account
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </template>
            </button>
          </form>

          <div class="divider-row">
            <div class="divider-line"></div>
            <span class="divider-text">or sign up with</span>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const { ctaIn, ctaOut } = useHoverIntents();

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const role = ref("admin");
const showPwd = ref(false);
const focusA = ref(false);
const focusB = ref(false);
const emailFocused = ref(false);
const pwdFocused = ref(false);
const termsAgreed = ref(false);
const loading = ref(false);
const showBanner = ref(false);
const bannerMsg = ref("");
const bannerOk = ref(true);

let bannerTimer: ReturnType<typeof setTimeout> | null = null;

const perks = [
  "Drag-and-drop certificate editor",
  "Upload 1 background, add signature",
  "Generate your first batch free",
  "Upgrade anytime to unlock Pro",
];

const roles = [
  { id: "admin", label: "Admin / HR" },
  { id: "trainer", label: "Trainer" },
  { id: "event", label: "Event organizer" },
  { id: "other", label: "Other" },
];

const pwdScore = computed(() => {
  const p = password.value;
  if (!p) return 0;
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
});

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
const strengthHexColors = ["", "#DC3545", "#F59E0B", "#1F8A5B", "#1F8A5B"];
const strengthTips = ["", "Add uppercase letters", "Add numbers", "Add symbols", "Looking great!"];

const strengthLabel = computed(() => strengthLabels[pwdScore.value]);
const strengthHex = computed(() => strengthHexColors[pwdScore.value]);
const strengthColor = computed(() => strengthHexColors[pwdScore.value] || "#E8E1D9");
const strengthTip = computed(() => strengthTips[pwdScore.value]);

function clearBanner() {
  showBanner.value = false;
}

function showBannerMsg(msg: string, ok: boolean) {
  showBanner.value = true;
  bannerOk.value = ok;
  bannerMsg.value = msg;
}

function socialLogin() {
  showBannerMsg("Social login not wired in demo mode.", false);
  if (bannerTimer) clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => { showBanner.value = false; }, 4000);
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
  if (!firstName.value) { showBannerMsg("Please enter your first name.", false); return; }
  if (!email.value) { showBannerMsg("Please enter your email.", false); return; }
  if (password.value.length < 8) { showBannerMsg("Password must be at least 8 characters.", false); return; }
  if (!termsAgreed.value) { showBannerMsg("Please agree to the Terms of service.", false); return; }
  loading.value = true;
  showBanner.value = false;
  setTimeout(() => {
    loading.value = false;
    navigateTo("/templates");
  }, 1600);
}
</script>

<style scoped>
#su-root {
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

#su-root ::selection { background: var(--accent); color: #fff; }
.accent { color: var(--accent); }

@keyframes su-floaty  { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
@keyframes su-floatyB { 0%,100% { transform: translateY(0) } 50% { transform: translateY(9px) } }
@keyframes su-fadeIn   { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: translateY(0) } }
@keyframes su-spinSlow { to { transform: rotate(360deg) } }

.su-grid {
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
  padding: 40px 48px;
}
.brand-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.brand-orb-tr { top: -80px; right: -60px; width: 380px; height: 380px; background: radial-gradient(circle, rgba(245,82,30,0.24), transparent 60%); }
.brand-orb-bl { bottom: -40px; left: -40px; width: 260px; height: 260px; background: radial-gradient(circle, rgba(245,82,30,0.12), transparent 60%); }

.brand-logo {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 11px;
  position: relative;
}
.logo-mark {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255,255,255,0.1);
}
.logo-text { font-size: 17px; font-weight: 600; color: #fff; }

.brand-hero {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}
.hero-eyebrow {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 18px;
}
.hero-title {
  margin: 0;
  font-size: clamp(32px, 3.2vw, 44px);
  font-weight: 600;
  color: #fff;
  line-height: 1.05;
  letter-spacing: -0.03em;
}
.hero-sub {
  margin: 18px 0 0;
  font-size: 16px;
  color: rgba(255,255,255,0.55);
  line-height: 1.6;
  max-width: 340px;
}

.perks-list {
  margin-top: 36px;
  display: flex;
  flex-direction: column;
  gap: 13px;
}
.perk-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.perk-icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(245,82,30,0.2);
  flex: 0 0 auto;
}
.perk-text { font-size: 14.5px; color: rgba(255,255,255,0.78); }

.users-badge {
  animation: su-floatyB 6s ease-in-out infinite 0.5s;
  margin-top: 36px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 12px 16px;
  width: fit-content;
}
.avatar-stack { display: flex; }
.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #14110E;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
}
.avatar + .avatar { margin-left: -8px; }
.users-num { font-size: 12.5px; font-weight: 600; color: #fff; }
.users-sub { font-size: 11px; color: rgba(255,255,255,0.5); }

.brand-footer { font-size: 12.5px; color: rgba(255,255,255,0.3); position: relative; }

/* ── Form Panel ── */
.form-panel {
  background: #F2ECE7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
  overflow-y: auto;
}
.form-wrap {
  width: 100%;
  max-width: 420px;
  animation: su-fadeIn .6s cubic-bezier(.16,1,.3,1) both;
}
.form-title { margin: 0 0 6px; font-size: 28px; font-weight: 600; letter-spacing: -0.025em; }
.form-switch { margin: 0 0 28px; font-size: 15px; color: var(--muted); }
.accent-link { color: var(--accent); font-weight: 600; text-decoration: none; }

.banner {
  display: flex;
  align-items: center;
  gap: 9px;
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 13.5px;
  margin-bottom: 4px;
}
.banner-ok { background: rgba(31,138,91,0.08); border: 1px solid rgba(31,138,91,0.22); color: #1F8A5B; }
.banner-err { background: rgba(220,53,69,0.07); border: 1px solid rgba(220,53,69,0.22); color: #B91C2E; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.su-form { display: flex; flex-direction: column; gap: 15px; }
.field-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 7px; }

.name-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.field-input {
  width: 100%;
  border: 1.5px solid var(--line);
  border-radius: 11px;
  padding: 8px 14px;
  font-family: inherit;
  font-size: 14.5px;
  color: var(--ink);
  background: #fff;
  outline: none;
  box-shadow: none;
  -webkit-appearance: none;
  transition: border-color .15s;
}
.field-input::placeholder { color: var(--muted); }
.field-input.focused {
  border-color: var(--ink);
}

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
.field-input-plain { flex: 1; border: none; outline: none; background: transparent; font-family: inherit; font-size: 14.5px; color: var(--ink); box-shadow: none; -webkit-appearance: none; }
.field-input-plain::placeholder { color: var(--muted); }

.pwd-toggle {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: grid;
  place-items: center;
}

.strength-wrap { margin-top: 8px; }
.strength-track {
  height: 4px;
  border-radius: 4px;
  background: rgba(20,17,14,0.08);
  overflow: hidden;
}
.strength-bar { height: 100%; border-radius: 4px; transition: width .4s, background .3s; }
.strength-meta { display: flex; justify-content: space-between; margin-top: 5px; }
.strength-meta span:first-child { font-size: 11.5px; font-weight: 500; }
.strength-tip { font-size: 11.5px; color: var(--muted); }

.role-row { display: flex; gap: 8px; flex-wrap: wrap; }
.role-btn {
  border: 1.5px solid var(--line);
  background: #fff;
  color: var(--ink);
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: all .15s;
}
.role-btn.active { border-color: var(--ink); background: var(--ink); color: #fff; }

.terms-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--muted);
}
.terms-row a { color: var(--ink); text-decoration: underline; text-underline-offset: 2px; }
.checkbox {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 5px;
  flex-shrink: 0;
  cursor: pointer;
  background: #fff;
  border: 1.5px solid var(--line);
  transition: background .15s;
  margin-top: 2px;
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
  margin-top: 2px;
}
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.spinner { animation: su-spinSlow .8s linear infinite; }

.divider-row { display: flex; align-items: center; gap: 14px; margin: 20px 0; }
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

@media (max-width: 768px) {
  .su-grid { grid-template-columns: 1fr; }
  .brand-panel { display: none; }
  .form-panel { min-height: 100vh; }
}
</style>
