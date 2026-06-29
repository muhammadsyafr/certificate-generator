<template>
  <select
    :value="modelValue"
    class="bs-root"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <option
      v-for="opt in options"
      :key="opt.value"
      :value="opt.value"
    >{{ opt.label }}</option>
  </select>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  options: { value: string; label: string }[]
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.bs-root {
  border: 1px solid rgba(20,17,14,0.09); background: #fff; border-radius: 10px;
  padding: 9px 12px; font-family: inherit; font-size: 13.5px; color: #14110E;
  outline: none; cursor: pointer;
}
</style>
