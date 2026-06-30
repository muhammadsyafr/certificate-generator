<template>
  <header class="page-header">
    <BackLink v-if="backTo" :to="backTo" :label="backLabel" />
    <h1 class="page-title">{{ title }}</h1>
    <p v-if="description" class="page-desc">{{ description }}</p>
    <slot />
  </header>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
  backTo?: string
  backLabel?: string
}>(), {
  backTo: '',
  backLabel: 'Back',
})
</script>

<style scoped>
.page-header { margin-bottom: 32px; }
.page-title { font-size: 40px; font-weight: 700; line-height: 1.12; margin-bottom: 8px; font-family: 'General Sans', system-ui, sans-serif; }
.page-desc { font-size: 16px; color: #6E665E; }
</style>
