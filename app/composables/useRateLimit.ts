/**
 * Rate limiting utilities (debounce, throttle, upload queue)
 */

export function useRateLimit() {
  /**
   * Debounce function calls
   */
  function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    return function (this: any, ...args: Parameters<T>) {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn.apply(this, args), delay)
    }
  }

  /**
   * Throttle function calls
   */
  function throttle<T extends (...args: any[]) => any>(
    fn: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle = false

    return function (this: any, ...args: Parameters<T>) {
      if (!inThrottle) {
        fn.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }

  /**
   * Upload queue manager - limit concurrent uploads
   */
  function createUploadQueue(maxConcurrent: number = 3) {
    const queue: Array<() => Promise<any>> = []
    let active = 0

    async function processNext() {
      if (queue.length === 0 || active >= maxConcurrent) return

      const task = queue.shift()
      if (!task) return

      active++
      try {
        await task()
      } finally {
        active--
        processNext()
      }
    }

    function add<T>(uploadFn: () => Promise<T>): Promise<T> {
      return new Promise((resolve, reject) => {
        queue.push(async () => {
          try {
            const result = await uploadFn()
            resolve(result)
          } catch (error) {
            reject(error)
          }
        })
        processNext()
      })
    }

    function getStatus() {
      return {
        active,
        queued: queue.length,
        total: active + queue.length,
      }
    }

    return { add, getStatus }
  }

  /**
   * Retry failed requests with exponential backoff
   */
  async function retry<T>(
    fn: () => Promise<T>,
    options: {
      maxRetries?: number
      initialDelay?: number
      maxDelay?: number
      onRetry?: (attempt: number, error: any) => void
    } = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      initialDelay = 1000,
      maxDelay = 10000,
      onRetry,
    } = options

    let lastError: any

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error

        if (attempt === maxRetries) break

        const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay)
        
        if (onRetry) {
          onRetry(attempt + 1, error)
        }

        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError
  }

  /**
   * Rate limit state for UI feedback
   */
  function useRateLimitState() {
    const isLimited = ref(false)
    const remainingTime = ref(0)
    let intervalId: ReturnType<typeof setInterval> | null = null

    function trigger(durationMs: number) {
      isLimited.value = true
      remainingTime.value = durationMs

      if (intervalId) clearInterval(intervalId)

      intervalId = setInterval(() => {
        remainingTime.value -= 100
        if (remainingTime.value <= 0) {
          isLimited.value = false
          if (intervalId) clearInterval(intervalId)
        }
      }, 100)
    }

    onUnmounted(() => {
      if (intervalId) clearInterval(intervalId)
    })

    return { isLimited, remainingTime, trigger }
  }

  return {
    debounce,
    throttle,
    createUploadQueue,
    retry,
    useRateLimitState,
  }
}
