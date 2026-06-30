<template>
  <div class="loading-state">
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  message?: string
}>(), {
  message: 'Loading...',
})
</script>

<style scoped>
.loading-state { text-align: center; padding: 48px 12px; color: #6E665E; font-size: 14px; }
</style>
