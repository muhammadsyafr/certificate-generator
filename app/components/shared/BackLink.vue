<template>
  <NuxtLink :to="to" class="back-link">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
    <span>{{ label }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  to?: string
  label?: string
}>(), {
  to: '/',
  label: 'Back',
})
</script>

<style scoped>
.back-link {
  display: inline-flex; align-items: center; gap: 8px;
  margin-bottom: 8px;
  color: #6E665E; font-size: 14px; font-weight: 500;
  text-decoration: none; transition: color .15s;
}
.back-link:hover { color: #14110E; }
</style>
