<template>
  <div class="section-header" :class="{ centered }">
    <span v-if="label" class="section-label">{{ label }}</span>
    <h2 v-if="title" class="section-title">{{ title }}</h2>
    <p v-if="description" class="section-desc">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  title?: string
  description?: string
  centered?: boolean
}>(), {
  centered: true,
})
</script>

<style scoped>
.section-header.centered { text-align: center; max-width: 640px; margin: 0 auto 52px; }
.section-label {
  font-size: 13px; font-weight: 600; letter-spacing: 0.14em;
  text-transform: uppercase; color: #F5521E;
}
.section-title {
  margin: 14px 0 0;
  font-size: clamp(32px, 3.6vw, 46px); letter-spacing: -0.03em;
  font-weight: 600; line-height: 1.05; color: #14110E;
}
.section-desc { margin: 14px 0 0; font-size: 17px; color: #6E665E; line-height: 1.5; }
</style>
