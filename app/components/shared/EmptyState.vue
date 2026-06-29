<template>
  <div class="empty-state">
    <div class="empty-icon">
      <slot name="icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round">
          <path d="M5 3l14 9-6 1.5L11 20 5 3z" />
        </svg>
      </slot>
    </div>
    <p class="empty-title">{{ title }}</p>
    <p v-if="description" class="empty-text">{{ description }}</p>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
}>(), {
  title: 'Nothing here yet',
})
</script>

<style scoped>
.empty-state { text-align: center; padding: 48px 12px; color: #6E665E; }
.empty-icon {
  width: 52px; height: 52px; border-radius: 14px;
  background: #fff; border: 1px solid rgba(20,17,14,0.09);
  display: grid; place-items: center; margin: 0 auto 14px;
}
.empty-title { font-size: 14px; font-weight: 600; color: #14110E; margin: 0; }
.empty-text { font-size: 13px; margin-top: 5px; line-height: 1.5; }
</style>
