<template>
  <select
    class="ed-select"
    :class="{ sm }"
    :value="modelValue"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <slot />
  </select>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  sm?: boolean
}>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<style scoped>
.ed-select {
  width: 100%; border: 1px solid rgba(20,17,14,0.09); border-radius: 9px;
  padding: 10px 12px; font-family: inherit; font-size: 13.5px;
  background: #fff; outline: none; cursor: pointer; color: #14110E;
}
.ed-select.sm { padding: 8px 10px; font-size: 13px; }
</style>
