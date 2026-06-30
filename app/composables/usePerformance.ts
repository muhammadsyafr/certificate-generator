/**
 * Performance utilities (lazy loading, image optimization)
 */

export function usePerformance() {
  /**
   * Lazy load image with IntersectionObserver
   */
  function useLazyImage(threshold: number = 0.1) {
    const imageRef = ref<HTMLImageElement | null>(null)
    const isLoaded = ref(false)
    const isInView = ref(false)

    onMounted(() => {
      if (!imageRef.value) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              isInView.value = true
              const img = entry.target as HTMLImageElement
              const src = img.dataset.src
              
              if (src && !isLoaded.value) {
                img.src = src
                img.onload = () => {
                  isLoaded.value = true
                }
              }
              
              observer.unobserve(img)
            }
          })
        },
        { threshold }
      )

      observer.observe(imageRef.value)

      onUnmounted(() => {
        if (imageRef.value) {
          observer.unobserve(imageRef.value)
        }
      })
    })

    return { imageRef, isLoaded, isInView }
  }

  /**
   * Compress image before upload
   */
  async function compressImage(
    file: File,
    options: {
      maxWidth?: number
      maxHeight?: number
      quality?: number
      format?: 'image/jpeg' | 'image/png' | 'image/webp'
    } = {}
  ): Promise<File> {
    const {
      maxWidth = 2048,
      maxHeight = 2048,
      quality = 0.85,
      format = 'image/jpeg',
    } = options

    return new Promise((resolve, reject) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }

      img.onload = () => {
        let { width, height } = img

        // Calculate new dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }

        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'))
              return
            }

            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^.]+$/, format === 'image/webp' ? '.webp' : format === 'image/png' ? '.png' : '.jpg'),
              { type: format }
            )

            resolve(compressedFile)
          },
          format,
          quality
        )
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }

      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * Preload critical images
   */
  function preloadImages(urls: string[]): Promise<void[]> {
    return Promise.all(
      urls.map(
        (url) =>
          new Promise<void>((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve()
            img.onerror = reject
            img.src = url
          })
      )
    )
  }

  /**
   * Memory-efficient chunk processor
   */
  async function processInChunks<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    chunkSize: number = 10
  ): Promise<R[]> {
    const results: R[] = []

    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize)
      const chunkResults = await Promise.all(chunk.map(processor))
      results.push(...chunkResults)
      
      // Allow UI to breathe between chunks
      await new Promise(resolve => setTimeout(resolve, 0))
    }

    return results
  }

  /**
   * Detect slow network
   */
  function useNetworkStatus() {
    const isOnline = ref(navigator.onLine)
    const isSlow = ref(false)

    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      
      watchEffect(() => {
        // 2G or slow-2g considered slow
        isSlow.value = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g'
      })
    }

    const updateOnlineStatus = () => {
      isOnline.value = navigator.onLine
    }

    onMounted(() => {
      window.addEventListener('online', updateOnlineStatus)
      window.addEventListener('offline', updateOnlineStatus)
    })

    onUnmounted(() => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    })

    return { isOnline, isSlow }
  }

  /**
   * Track upload progress
   */
  function useUploadProgress() {
    const progress = ref(0)
    const isUploading = ref(false)
    const speed = ref(0) // bytes per second
    
    let startTime = 0
    let uploadedBytes = 0

    function start(totalBytes: number) {
      isUploading.value = true
      progress.value = 0
      speed.value = 0
      startTime = Date.now()
      uploadedBytes = 0
    }

    function update(loaded: number, total: number) {
      progress.value = Math.round((loaded / total) * 100)
      uploadedBytes = loaded
      
      const elapsed = (Date.now() - startTime) / 1000
      if (elapsed > 0) {
        speed.value = Math.round(loaded / elapsed)
      }
    }

    function complete() {
      progress.value = 100
      isUploading.value = false
    }

    function reset() {
      progress.value = 0
      isUploading.value = false
      speed.value = 0
    }

    const formatSpeed = computed(() => {
      const s = speed.value
      if (s < 1024) return `${s} B/s`
      if (s < 1024 * 1024) return `${(s / 1024).toFixed(1)} KB/s`
      return `${(s / (1024 * 1024)).toFixed(1)} MB/s`
    })

    return { progress, isUploading, speed, formatSpeed, start, update, complete, reset }
  }

  return {
    useLazyImage,
    compressImage,
    preloadImages,
    processInChunks,
    useNetworkStatus,
    useUploadProgress,
  }
}
