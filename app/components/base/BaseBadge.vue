<template>
  <span class="base-badge" :class="variant" :style="styleObj">
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'accent' | 'dark' | 'muted' | 'success' | 'pro'
  size?: 'sm' | 'md'
}>(), {
  variant: 'accent',
  size: 'sm',
})

const variantMap: Record<string, Record<string, string>> = {
  accent: { background: '#F5521E', color: '#fff' },
  dark: { background: '#14110E', color: '#fff' },
  muted: { background: '#F2ECE7', color: '#14110E' },
  success: { background: 'rgba(31,174,107,0.12)', color: '#1Fae6b' },
  pro: { background: 'rgba(20,17,14,0.06)', color: '#6E665E', border: '1px solid rgba(20,17,14,0.09)' },
}

const sizeMap: Record<string, Record<string, string>> = {
  sm: { padding: '3px 9px', fontSize: '12px' },
  md: { padding: '5px 11px', fontSize: '13px' },
}

const styleObj = computed(() => ({
  display: 'inline-flex', alignItems: 'center', borderRadius: '999px',
  fontWeight: 600,
  ...variantMap[props.variant],
  ...sizeMap[props.size],
}))
</script>
