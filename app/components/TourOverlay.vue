<template>
  <Teleport to="body">
    <Transition name="tour-fade">
      <div v-if="isActive" class="tour-overlay">
        <!-- Backdrop with spotlight cutout -->
        <div class="tour-backdrop" @click="onBackdropClick" />
        
        <!-- Spotlight highlight -->
        <div 
          v-if="spotlightRect" 
          class="tour-spotlight"
          :style="{
            top: `${spotlightRect.top - 8}px`,
            left: `${spotlightRect.left - 8}px`,
            width: `${spotlightRect.width + 16}px`,
            height: `${spotlightRect.height + 16}px`,
          }"
        />

        <!-- Tooltip -->
        <div 
          v-if="spotlightRect && currentStepData"
          class="tour-tooltip"
          :class="`tour-tooltip--${tooltipPlacement}`"
          :style="tooltipStyle"
        >
          <div class="tour-tooltip-header">
            <div class="tour-tooltip-title">{{ currentStepData.title }}</div>
            <button class="tour-tooltip-close" @click="skipTour" title="Skip tour">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          
          <p class="tour-tooltip-desc">{{ currentStepData.description }}</p>
          
          <div class="tour-tooltip-footer">
            <div class="tour-tooltip-progress">
              <span class="tour-tooltip-step">{{ currentStep + 1 }} / {{ totalSteps }}</span>
              <div class="tour-tooltip-progress-bar">
                <div class="tour-tooltip-progress-fill" :style="{ width: `${progress}%` }" />
              </div>
            </div>
            
            <div class="tour-tooltip-actions">
              <button 
                v-if="!isFirstStep" 
                class="tour-btn tour-btn--secondary" 
                @click="prevStep"
              >
                Back
              </button>
              <button 
                class="tour-btn tour-btn--primary" 
                @click="nextStep"
              >
                {{ isLastStep ? 'Got it!' : 'Next' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const tour = useTour()

const { 
  isActive, 
  currentStep, 
  currentStepData, 
  progress, 
  isFirstStep, 
  isLastStep,
  nextStep, 
  prevStep, 
  skipTour 
} = tour

const spotlightRect = ref<DOMRect | null>(null)
const tooltipPlacement = ref<'top' | 'bottom' | 'left' | 'right'>('bottom')

const totalSteps = computed(() => {
  return tour.steps.value.length
})

const updateSpotlight = () => {
  if (!currentStepData.value?.target) return
  
  nextTick(() => {
    const el = document.querySelector(currentStepData.value.target)
    if (el) {
      spotlightRect.value = el.getBoundingClientRect()
      calculateTooltipPlacement()
    }
  })
}

const calculateTooltipPlacement = () => {
  if (!spotlightRect.value) return
  
  const preferredPlacement = currentStepData.value?.placement || 'bottom'
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth
  const rect = spotlightRect.value
  
  // Check if preferred placement fits
  if (preferredPlacement === 'bottom' && rect.bottom + 200 < viewportHeight) {
    tooltipPlacement.value = 'bottom'
  } else if (preferredPlacement === 'top' && rect.top - 200 > 0) {
    tooltipPlacement.value = 'top'
  } else if (preferredPlacement === 'right' && rect.right + 320 < viewportWidth) {
    tooltipPlacement.value = 'right'
  } else if (preferredPlacement === 'left' && rect.left - 320 > 0) {
    tooltipPlacement.value = 'left'
  } else {
    // Fallback: choose best fit
    if (rect.bottom + 200 < viewportHeight) {
      tooltipPlacement.value = 'bottom'
    } else if (rect.top - 200 > 0) {
      tooltipPlacement.value = 'top'
    } else {
      tooltipPlacement.value = 'right'
    }
  }
}

const tooltipStyle = computed(() => {
  if (!spotlightRect.value) return {}
  
  const rect = spotlightRect.value
  const gap = 16
  
  switch (tooltipPlacement.value) {
    case 'bottom':
      return {
        top: `${rect.bottom + gap}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translateX(-50%)'
      }
    case 'top':
      return {
        top: `${rect.top - gap}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translate(-50%, -100%)'
      }
    case 'right':
      return {
        top: `${rect.top + rect.height / 2}px`,
        left: `${rect.right + gap}px`,
        transform: 'translateY(-50%)'
      }
    case 'left':
      return {
        top: `${rect.top + rect.height / 2}px`,
        left: `${rect.left - gap}px`,
        transform: 'translate(-100%, -50%)'
      }
    default:
      return {}
  }
})

const onBackdropClick = () => {
  // Don't close on backdrop click - require explicit skip
}

watch([currentStep, isActive], () => {
  if (isActive.value) {
    updateSpotlight()
  }
})

onMounted(() => {
  if (isActive.value) {
    updateSpotlight()
  }
  window.addEventListener('resize', updateSpotlight)
  window.addEventListener('scroll', updateSpotlight, true)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateSpotlight)
  window.removeEventListener('scroll', updateSpotlight, true)
})
</script>

<style scoped>
.tour-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  pointer-events: none;
}

.tour-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(20, 17, 14, 0.7);
  backdrop-filter: blur(2px);
  pointer-events: auto;
}

.tour-spotlight {
  position: fixed;
  border-radius: 8px;
  box-shadow: 0 0 0 4000px rgba(20, 17, 14, 0.7);
  border: 2px solid #F5521E;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.tour-tooltip {
  position: fixed;
  width: 320px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(20, 17, 14, 0.24);
  padding: 20px;
  pointer-events: auto;
  z-index: 2;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tour-tooltip-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.tour-tooltip-title {
  font-size: 16px;
  font-weight: 600;
  color: #14110E;
  line-height: 1.4;
}

.tour-tooltip-close {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #6E665E;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s;
}

.tour-tooltip-close:hover {
  background: #F7F1E9;
  color: #14110E;
}

.tour-tooltip-desc {
  font-size: 14px;
  line-height: 1.6;
  color: #6E665E;
  margin: 0 0 20px 0;
}

.tour-tooltip-footer {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tour-tooltip-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tour-tooltip-step {
  font-size: 12px;
  font-weight: 500;
  color: #6E665E;
}

.tour-tooltip-progress-bar {
  height: 4px;
  background: #E8DEC8;
  border-radius: 2px;
  overflow: hidden;
}

.tour-tooltip-progress-fill {
  height: 100%;
  background: #F5521E;
  border-radius: 2px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tour-tooltip-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.tour-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
}

.tour-btn--secondary {
  background: transparent;
  color: #6E665E;
  border: 1px solid #E8DEC8;
}

.tour-btn--secondary:hover {
  background: #F7F1E9;
  border-color: #D4C4A8;
  color: #14110E;
}

.tour-btn--primary {
  background: #F5521E;
  color: #fff;
}

.tour-btn--primary:hover {
  background: #E04718;
}

.tour-fade-enter-active,
.tour-fade-leave-active {
  transition: opacity 0.3s;
}

.tour-fade-enter-from,
.tour-fade-leave-to {
  opacity: 0;
}
</style>
