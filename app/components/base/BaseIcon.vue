<template>
  <img 
    :src="`/icons/icon-${name}.svg`" 
    :width="size" 
    :height="size" 
    :alt="alt || name"
    :class="['base-icon', className]"
  />
</template>

<script setup lang="ts">
defineProps<{
  name: string
  size?: number | string
  alt?: string
  className?: string
}>()
</script>

<style scoped>
.base-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
