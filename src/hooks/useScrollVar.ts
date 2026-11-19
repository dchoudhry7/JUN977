import { useEffect, type RefObject } from 'react'

/**
 * Writes the element's scroll progress (0 as its top reaches `start` of the
 * viewport, 1 as its bottom reaches `end`) into a CSS variable, only while it
 * is on screen and only when the value changes.
 */
export function useScrollVar(
  ref: RefObject<HTMLElement | null>,
  name = '--p',
  { start = 0.85, end = 0.35, onChange }: { start?: number; end?: number; onChange?: (p: number) => void } = {},
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty(name, '1')
      onChange?.(1)
      return
    }
    let raf: number | null = null
    let lastV = -1
    let visible = false
    const measure = () => {
      raf = null
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const from = vh * start
      const to = vh * end - r.height
      const p = Math.min(1, Math.max(0, (from - r.top) / (from - to)))
      if (Math.abs(p - lastV) > 0.002 || (p === 1 && lastV !== 1) || (p === 0 && lastV !== 0)) {
        lastV = p
        el.style.setProperty(name, p.toFixed(4))
        onChange?.(p)
      }
    }
    const onScroll = () => {
      if (visible && raf === null) raf = requestAnimationFrame(measure)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) onScroll()
    })
    io.observe(el)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    measure()
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf !== null) cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, name, start, end])
}
