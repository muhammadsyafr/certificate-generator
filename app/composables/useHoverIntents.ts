export function useHoverIntents() {
  function softIn(e: MouseEvent)  { (e.currentTarget as HTMLElement).style.background = 'rgba(20,17,14,0.05)' }
  function softOut(e: MouseEvent) { (e.currentTarget as HTMLElement).style.background = 'transparent' }
  function whiteOut(e: MouseEvent) { (e.currentTarget as HTMLElement).style.background = '#fff' }
  function ctaIn(e: MouseEvent)   { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }
  function ctaOut(e: MouseEvent)  { (e.currentTarget as HTMLElement).style.transform = 'none' }
  function cardIn(e: MouseEvent) {
    const t = e.currentTarget as HTMLElement
    if (!t.classList.contains('active')) t.style.borderColor = 'rgba(20,17,14,0.22)'
    t.style.transform = 'translateY(-1px)'
  }
  function cardOut(e: MouseEvent) {
    const t = e.currentTarget as HTMLElement
    if (!t.classList.contains('active')) t.style.borderColor = 'rgba(20,17,14,0.09)'
    t.style.transform = 'none'
  }
  function ghostIn(e: MouseEvent) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)' }
  function ghostOut(e: MouseEvent) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)' }

  return { softIn, softOut, whiteOut, ctaIn, ctaOut, cardIn, cardOut, ghostIn, ghostOut }
}
