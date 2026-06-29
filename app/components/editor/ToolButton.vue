<template>
  <button
    class="ed-tool-btn"
    :class="{ active }"
    :title="tool.label"
    @click="$emit('activate', tool)"
  >
    <span class="tool-icon" :style="{ WebkitMask: iconBg, mask: iconBg }"></span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  tool: { id: string; label: string; d: string }
  active?: boolean
}>()

defineEmits<{ activate: [tool: { id: string; label: string; d: string }] }>()

const iconBg = computed(() => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'><path d='${props.tool.d}'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") center/contain no-repeat`;
})
</script>

<style scoped>
.ed-tool-btn {
  border: none; cursor: pointer; width: 40px; height: 40px;
  border-radius: 11px; display: grid; place-items: center;
  background: transparent; transition: background .2s;
}
.ed-tool-btn.active { background: #14110E; }
.ed-tool-btn.active .tool-icon { background-color: #fff !important; }
.tool-icon { display: block; width: 20px; height: 20px; background-color: #14110E; }
</style>
