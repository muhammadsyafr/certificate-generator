<template>
  <div class="form-group">
    <label v-if="label" class="form-label">{{ label }}</label>
    <slot />
    <span v-if="hint" class="form-hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  hint?: string
}>(), {})
</script>

<style scoped>
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-label {
  font-size: 11.5px; font-weight: 600; color: #6E665E;
  text-transform: uppercase; letter-spacing: 0.04em;
}
.form-hint { font-size: 11.5px; color: #6E665E; margin-top: 4px; }
</style>
