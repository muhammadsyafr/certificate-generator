<template>
  <div class="error-state">
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  message?: string
}>(), {
  message: 'Failed to load.',
})
</script>

<style scoped>
.error-state { text-align: center; padding: 48px 12px; color: #EF4444; font-size: 14px; }
</style>
