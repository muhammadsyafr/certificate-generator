<template>
  <div class="layer-row" :class="{ active, hidden }" @click="$emit('select')">
    <span class="layer-dot" :style="{ background: dotColor }" />
    <span class="layer-name">{{ label }}</span>
    <button class="layer-eye" @click.stop="$emit('toggle')">
      <svg v-if="hidden" width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.4 5.2A9.6 9.6 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3 3.6M6.2 6.2A16 16 0 0 0 2 12s3.5 7 10 7a9.5 9.5 0 0 0 3.3-.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
      </svg>
      <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="1.7"/>
        <circle cx="12" cy="12" r="2.4" stroke="currentColor" stroke-width="1.7"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  dotColor: string
  active?: boolean
  hidden?: boolean
}>()
defineEmits<{ select: []; toggle: [] }>()
</script>

<style scoped>
.layer-row {
  display: flex; align-items: center; gap: 9px; padding: 7px 9px;
  border-radius: 9px; cursor: pointer; border: 1px solid transparent;
  transition: background .15s;
}
.layer-row.active { background: #fff; border-color: #F5521E; box-shadow: 0 2px 8px rgba(20,17,14,0.06); }
.layer-row.hidden .layer-name { color: #A29A92; }
.layer-row.hidden .layer-dot { opacity: 0.3; }
.layer-dot { flex: 0 0 auto; width: 8px; height: 8px; border-radius: 2px; }
.layer-name { flex: 1; font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.layer-eye {
  width: 24px; height: 24px; display: grid; place-items: center;
  border-radius: 6px; cursor: pointer; opacity: 0.6; color: #6E665E;
  border: none; background: none;
}
</style>
