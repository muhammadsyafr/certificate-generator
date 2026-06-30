<template>
  <div class="base-divider" :class="direction" :style="styleObj" />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  direction?: 'horizontal' | 'vertical'
  size?: string
  color?: string
}>(), {
  direction: 'horizontal',
  size: '1px',
  color: 'rgba(20,17,14,0.08)',
})

const styleObj = computed(() => ({
  background: props.color,
  ...(props.direction === 'vertical'
    ? { width: props.size, height: props.size === '1px' ? '24px' : '26px', flexShrink: 0 }
    : { height: props.size, width: '100%' }),
}))
</script>
