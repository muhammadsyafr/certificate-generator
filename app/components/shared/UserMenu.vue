<template>
  <div class="user-menu">
    <button class="user-avatar" @click="showMenu = !showMenu">
      {{ getUserInitials() }}
    </button>
    <Transition name="fade">
      <div v-if="showMenu" class="user-dropdown">
        <div class="user-info">
          <div class="user-name">{{ user?.name || 'User' }}</div>
          <div class="user-email">{{ user?.email || '' }}</div>
        </div>
        <div class="user-divider"></div>
        <button class="user-item" @click="handleLogout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Sign out
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { user, loadUser, logout, getUserInitials } = useAuth()
const showMenu = ref(false)

function handleLogout() {
  showMenu.value = false
  logout()
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.user-menu')) {
    showMenu.value = false
  }
}

onMounted(() => {
  loadUser()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.user-menu {
  position: relative;
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f5521e, #ff8a5b);
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: transform 0.2s;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #fff;
  border: 1px solid rgba(20, 17, 14, 0.09);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(20, 17, 14, 0.12);
  min-width: 220px;
  overflow: hidden;
  z-index: 100;
}

.user-info {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(20, 17, 14, 0.09);
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #14110e;
  margin-bottom: 2px;
}

.user-email {
  font-size: 12.5px;
  color: #6e665e;
}

.user-divider {
  height: 1px;
  background: rgba(20, 17, 14, 0.09);
}

.user-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 13.5px;
  color: #14110e;
  cursor: pointer;
  transition: background 0.15s;
  text-align: left;
}

.user-item:hover {
  background: #f2ece7;
}

.user-item svg {
  flex-shrink: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
