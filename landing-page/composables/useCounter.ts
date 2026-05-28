export const useCounter = () => {
  const animateCounter = (
    el: HTMLElement,
    target: number,
    duration: number = 1800,
    prefix: string = '',
    suffix: string = ''
  ) => {
    const start = performance.now()
    const step = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * target)
      el.textContent = prefix + current.toLocaleString() + suffix
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  const initCounters = () => {
    if (typeof window === 'undefined') return

    const counters = document.querySelectorAll<HTMLElement>('[data-counter]')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const target = parseInt(el.dataset.counter ?? '0', 10)
            const prefix = el.dataset.prefix ?? ''
            const suffix = el.dataset.suffix ?? ''
            animateCounter(el, target, 1800, prefix, suffix)
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.5 }
    )

    counters.forEach((el) => observer.observe(el))
  }

  return { initCounters }
}
