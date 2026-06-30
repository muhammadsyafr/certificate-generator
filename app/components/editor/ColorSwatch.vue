<template>
  <div class="swatches-row">
    <button
      v-for="c in swatches"
      :key="c"
      class="swatch"
      :class="{ active: modelValue === c }"
      :style="{ background: c }"
      @click="$emit('update:modelValue', c)"
    />
    <input
      type="color"
      class="swatch-picker"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  swatches?: string[]
}>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<style scoped>
.swatches-row { display: flex; gap: 9px; align-items: center; }
.swatch {
  width: 34px; height: 34px; border-radius: 9px; cursor: pointer;
  border: 2px solid #fff; box-shadow: 0 0 0 1px rgba(20,17,14,0.12);
}
.swatch.active { border-color: #14110E; border-width: 2.5px; }
.swatch-picker {
  width: 34px; height: 34px; border-radius: 9px; cursor: pointer;
  border: 1px solid rgba(20,17,14,0.09); padding: 2px; background: #fff;
}
</style>
