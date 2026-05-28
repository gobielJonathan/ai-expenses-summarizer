export const useParallax = () => {
  let ticking = false
  let cleanupFns: (() => void)[] = []

  const bindParallax = (
    selector: string,
    speedFactor: number = 0.35
  ) => {
    if (typeof window === 'undefined') return

    const elements = document.querySelectorAll<HTMLElement>(selector)
    if (!elements.length) return

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY
          elements.forEach((el) => {
            el.style.transform = `translateY(${scrollY * speedFactor}px)`
          })
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    cleanupFns.push(() => window.removeEventListener('scroll', onScroll))
  }

  const cleanup = () => {
    cleanupFns.forEach((fn) => fn())
    cleanupFns = []
  }

  return { bindParallax, cleanup }
}
