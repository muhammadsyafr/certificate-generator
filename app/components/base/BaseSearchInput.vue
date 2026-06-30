<template>
  <div class="bsi-root">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="#6E665E" stroke-width="1.8"/>
      <path d="M20 20l-3-3" stroke="#6E665E" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
    <input
      :value="modelValue"
      :placeholder="placeholder"
      class="bsi-input"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
}>(), {
  placeholder: 'Search…',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.bsi-root {
  display: flex; align-items: center; gap: 9px; height: 36px;
  background: #fff; border: 1px solid rgba(20,17,14,0.09);
  border-radius: 10px; padding: 0 13px; box-sizing: border-box;
  outline: none;
}
.bsi-root:focus-within {
  border-color: rgba(20,17,14,0.18);
}
.bsi-input {
  border: none; outline: none; background: transparent;
  font-family: inherit; font-size: 13.5px; color: #14110E; width: 170px; height: 18px;
  box-shadow: none; -webkit-appearance: none;
}
.bsi-input::placeholder { color: #6E665E; }
</style>
