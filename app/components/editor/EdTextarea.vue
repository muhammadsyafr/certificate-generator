<template>
  <textarea
    class="ed-textarea"
    :value="modelValue"
    :rows="rows"
    :placeholder="placeholder"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: string
  rows?: number
  placeholder?: string
}>(), { rows: 2 })
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<style scoped>
.ed-textarea {
  width: 100%; border: 1px solid rgba(20,17,14,0.09); border-radius: 9px;
  padding: 10px 12px; font-family: inherit; font-size: 13.5px;
  resize: vertical; outline: none; color: #14110E; background: #fff;
}
</style>
