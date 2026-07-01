export const useTour = () => {
  // Use useState for global shared state across all components
  const isActive = useState('tour-active', () => false)
  const currentStep = useState('tour-step', () => 0)
  const steps = useState<TourStep[]>('tour-steps', () => [])
  const tourContext = useState('tour-context', () => 'templates') // 'templates' or 'editor'

  const hasSeenTour = () => {
    if (process.client) {
      return localStorage.getItem('certify-tour-completed') === 'true'
    }
    return true
  }

  const markTourComplete = () => {
    if (process.client) {
      localStorage.setItem('certify-tour-completed', 'true')
    }
    isActive.value = false
  }

  const startTour = (tourSteps: TourStep[], context = 'templates') => {
    console.log('[useTour] startTour called', { hasSeenTour: hasSeenTour(), tourSteps })
    if (hasSeenTour()) {
      console.log('[useTour] Tour already seen, skipping')
      return
    }
    steps.value = tourSteps
    currentStep.value = 0
    tourContext.value = context
    isActive.value = true
    console.log('[useTour] Tour activated', { isActive: isActive.value, steps: steps.value.length })
  }

  const nextStep = () => {
    const current = currentStepData.value
    
    // If current step has an action requirement, don't advance automatically
    if (current?.action === 'create') {
      // Wait for user to click the button
      return
    }
    
    if (currentStep.value < steps.value.length - 1) {
      currentStep.value++
    } else {
      completeTour()
    }
  }

  const prevStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }

  const skipTour = () => {
    markTourComplete()
  }

  const completeTour = () => {
    markTourComplete()
  }

  // Called when user performs the required action
  const completeActionStep = () => {
    if (currentStep.value < steps.value.length - 1) {
      currentStep.value++
    } else {
      // Continue to editor tour
      isActive.value = false
    }
  }

  const currentStepData = computed(() => steps.value[currentStep.value])
  const progress = computed(() => ((currentStep.value + 1) / steps.value.length) * 100)
  const isFirstStep = computed(() => currentStep.value === 0)
  const isLastStep = computed(() => currentStep.value === steps.value.length - 1)

  return {
    isActive,
    currentStep,
    steps,
    tourContext,
    currentStepData,
    progress,
    isFirstStep,
    isLastStep,
    hasSeenTour,
    startTour,
    nextStep,
    prevStep,
    skipTour,
    completeTour,
    completeActionStep
  }
}

export interface TourStep {
  target: string // CSS selector
  title: string
  description: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  action?: string // Optional action label (e.g. "Create template")
}
