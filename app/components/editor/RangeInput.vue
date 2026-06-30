<template>
  <div class="range-row">
    <input
      type="range"
      :min="min"
      :max="max"
      :value="modelValue"
      @input="$emit('update:modelValue', +($event.target as HTMLInputElement).value)"
    />
    <span class="range-val">{{ suffix ? modelValue + suffix : modelValue }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: number
  min?: number
  max?: number
  suffix?: string
}>()
defineEmits<{ 'update:modelValue': [value: number] }>()
</script>

<style scoped>
.range-row {
  display: flex; align-items: center; gap: 8px;
  background: #fff; border: 1px solid rgba(20,17,14,0.09);
  border-radius: 9px; padding: 7px 11px;
}
.range-row input[type="range"] { flex: 1; }
.range-val { font-size: 12.5px; font-weight: 600; min-width: 26px; text-align: right; }
input[type="range"] {
  -webkit-appearance: none; appearance: none; height: 4px;
  border-radius: 4px; background: rgba(20,17,14,0.12); outline: none;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; width: 15px; height: 15px;
  border-radius: 50%; background: #14110E; cursor: pointer;
  border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.25);
}
</style>
