<template>
  <button
    :class="classes"
    :disabled="disabled"
    @mouseenter="hoverIn"
    @mouseleave="hoverOut"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  full?: boolean
  pill?: boolean
  radius?: 'sm' | 'md' | 'lg'
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  full: false,
  pill: true,
  radius: 'lg',
})

const radiusMap: Record<string, string> = { sm: '9px', md: '11px', lg: '14px' }
const base = { border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'transform .2s, background .15s, box-shadow .2s' }

const variantStyles: Record<string, Record<string, string>> = {
  primary: { background: '#14110E', color: '#fff', boxShadow: '0 12px 30px rgba(20,17,14,0.22)' },
  secondary: { background: 'transparent', color: '#14110E', border: '1px solid rgba(20,17,14,0.12)' },
  ghost: { background: 'transparent', color: '#6E665E' },
  danger: { background: 'rgba(239,68,68,0.12)', color: '#EF4444' },
  accent: { background: '#F5521E', color: '#fff', boxShadow: '0 12px 28px rgba(245,82,30,0.4)' },
  outline: { background: '#fff', color: '#14110E', border: '1px solid rgba(20,17,14,0.09)' },
}

const sizeMap: Record<string, Record<string, string>> = {
  sm: { padding: '7px 12px', fontSize: '12.5px' },
  md: { padding: '10px 17px', fontSize: '13.5px' },
  lg: { padding: '16px 26px', fontSize: '16px' },
}

const styleObj = computed(() => ({
  ...base,
  ...variantStyles[props.variant],
  ...sizeMap[props.size],
  borderRadius: props.pill ? '999px' : radiusMap[props.radius],
  width: props.full ? '100%' : undefined,
  opacity: props.disabled ? 0.5 : undefined,
  cursor: props.disabled ? 'not-allowed' : 'pointer',
}))

const classes = computed(() => ({
  'ed-btn-accent': props.variant === 'accent',
  'ed-btn-accent full': props.variant === 'accent' && props.full,
}))

function hoverIn(e: MouseEvent) {
  const t = e.currentTarget as HTMLElement
  if (props.variant === 'ghost' || props.variant === 'secondary') t.style.background = 'rgba(20,17,14,0.05)'
  else if (props.variant !== 'primary') t.style.transform = 'translateY(-1px)'
}
function hoverOut(e: MouseEvent) {
  const t = e.currentTarget as HTMLElement
  if (props.variant === 'ghost' || props.variant === 'secondary') t.style.background = 'transparent'
  else if (props.variant === 'outline') t.style.background = '#fff'
  else t.style.transform = 'none'
}
</script>
