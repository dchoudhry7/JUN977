import { useEffect, useRef, useState, type CSSProperties, type ElementType } from 'react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>?$@'

type Props = {
  text: string
  as?: ElementType
  className?: string
  style?: CSSProperties
  id?: string
  /** Total time for the whole line to resolve, in ms. */
  duration?: number
  /** Controlled start. Leave undefined to start when scrolled into view. */
  start?: boolean
}

type Cell = { ch: string; state: 'wait' | 'scr' | 'done' }

/**
 * A heading that decodes in place: each character flickers through random
 * glyphs and lands on its letter, left to right, like JUN977 reading it out.
 * Monospace means nothing reflows while it runs. Inside a journey band it
 * re-runs every time that band comes back on screen.
 */
export default function ScrambleText({ text, as: Tag = 'span', className = '', style, id, duration = 1100, start }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [cells, setCells] = useState<Cell[]>(() => [...text].map((ch) => ({ ch, state: ch === ' ' ? 'done' : 'wait' })))
  const raf = useRef<number | null>(null)
  const ran = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const chars = [...text]
    const n = chars.length

    const finish = () => setCells(chars.map((ch) => ({ ch, state: 'done' })))

    const run = () => {
      if (reduce) return finish()
      if (raf.current !== null) cancelAnimationFrame(raf.current)
      ran.current = true
      const t0 = performance.now()
      let lastPaint = 0
      const step = (now: number) => {
        const e = now - t0
        if (now - lastPaint >= 45 || e >= duration) {
          lastPaint = now
          setCells(
            chars.map((ch, i) => {
              if (ch === ' ') return { ch, state: 'done' }
              const s = (i / n) * duration * 0.55 // this glyph starts flickering
              const r = s + duration * 0.4 // and lands here
              if (e < s) return { ch, state: 'wait' }
              if (e < r) return { ch: GLYPHS[(Math.random() * GLYPHS.length) | 0], state: 'scr' }
              return { ch, state: 'done' }
            }),
          )
        }
        raf.current = e < duration ? requestAnimationFrame(step) : null
        if (raf.current === null) finish()
      }
      raf.current = requestAnimationFrame(step)
    }

    // Controlled start (the hero question waits for the typing to finish)
    if (start !== undefined) {
      if (start) run()
      return () => {
        if (raf.current !== null) cancelAnimationFrame(raf.current)
      }
    }

    // Otherwise: decode when scrolled into view, and again whenever the
    // journey band holding it comes back on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !ran.current) run()
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    const band = el.closest('.band')
    const onBand = () => run()
    band?.addEventListener('decode', onBand)
    return () => {
      io.disconnect()
      band?.removeEventListener('decode', onBand)
      if (raf.current !== null) cancelAnimationFrame(raf.current)
    }
  }, [text, duration, start])

  return (
    <Tag ref={ref} id={id} className={className} style={style}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {cells.map((c, i) => (
          <span key={i} className={c.state === 'scr' ? 'scr' : c.state === 'wait' ? 'scr-wait' : undefined}>
            {c.ch}
          </span>
        ))}
      </span>
    </Tag>
  )
}
