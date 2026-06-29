<template>
  <div class="prop-section">
    <label class="prop-label">{{ label }}</label>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<style scoped>
.prop-section { margin-top: 16px; }
.prop-label {
  font-size: 11.5px; font-weight: 600; color: #6E665E;
  text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 8px;
  display: block;
}
</style>
