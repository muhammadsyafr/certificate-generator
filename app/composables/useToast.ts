export function useToast() {
  const message = ref('')
  const visible = computed(() => !!message.value)
  let timer: ReturnType<typeof setTimeout> | null = null

  function show(msg: string, duration = 2200) {
    message.value = msg
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => { message.value = '' }, duration)
  }

  function hide() {
    message.value = ''
    if (timer) clearTimeout(timer)
  }

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
  })

  return { message, visible, show, hide }
}
