<template>
  <Transition name="toast">
    <div v-if="visible" class="base-toast">
      <slot name="icon">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="11" width="14" height="9" rx="2" :stroke="iconColor" stroke-width="1.9"/>
          <path d="M8 11V8a4 4 0 0 1 8 0v3" :stroke="iconColor" stroke-width="1.9"/>
        </svg>
      </slot>
      <slot />
    </div>
  </Transition>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  visible?: boolean
  iconColor?: string
}>(), {
  visible: false,
  iconColor: '#F5521E',
})
</script>

<style scoped>
.base-toast {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  background: #14110E; color: #fff; font-size: 13px; font-weight: 500;
  padding: 12px 18px; border-radius: 11px;
  box-shadow: 0 12px 34px rgba(20,17,14,0.35); z-index: 9999;
  display: flex; align-items: center; gap: 9px;
  font-family: 'General Sans', system-ui, sans-serif;
}
.toast-enter-active { transition: opacity .3s, transform .3s; }
.toast-leave-active { transition: opacity .2s, transform .2s; }
.toast-enter-from { opacity: 0; transform: translateX(-50%) translateY(10px); }
.toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }
</style>
