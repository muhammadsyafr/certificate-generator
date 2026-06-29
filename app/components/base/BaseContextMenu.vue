<template>
  <div class="bcm-root" ref="root">
    <slot name="trigger" :toggle="toggle" :open="isOpen" />
    <Transition name="bcm-drop">
      <div v-if="isOpen" class="bcm-drop" @click.stop>
        <slot :close="close" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const root = ref<HTMLElement>()

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

function onDocClick(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
</script>

<style scoped>
.bcm-root {
  position: relative;
}

.bcm-drop {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 4px;
  background: #fff;
  border: 1px solid rgba(20,17,14,0.09);
  border-radius: 12px;
  box-shadow: 0 16px 40px rgba(20,17,14,0.14);
  padding: 6px;
  z-index: 10;
  min-width: 160px;
  animation: popIn .2s ease both;
}

@keyframes popIn {
  0% { transform: scale(.92) translateY(8px); opacity: 0; }
  70% { transform: scale(1.01) translateY(-1px); }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

.bcm-drop-enter-active { animation: popIn .2s ease both; }
.bcm-drop-leave-active { transition: opacity .12s ease, transform .12s ease; }
.bcm-drop-leave-to { opacity: 0; transform: scale(.92) translateY(8px); }
</style>
