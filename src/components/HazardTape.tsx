import { useEffect, useRef } from 'react'

const WORDS = ['Built from parts', 'Runs on taste', 'JUN977 on duty', 'Brands', 'Products', 'The odd machine', 'Rotterdam', 'Lisbon']

function Track({ dark }: { dark?: boolean }) {
  // Repeated until each track comfortably exceeds a 2560px screen (10k marquee rule)
  const items = [...WORDS, ...WORDS, ...WORDS]
  return (
    <div className="flex shrink-0 items-center">
      {items.map((w, i) => (
        <span key={i} className="flex items-center">
          <span
            className="font-heading font-normal tracking-[-0.03em] whitespace-nowrap px-6"
            style={{ fontSize: 'clamp(18px, 2vw, 30px)', letterSpacing: '0.02em', color: dark ? 'var(--color-rust)' : 'var(--color-plum-950)' }}
          >
            {w}
          </span>
          <span aria-hidden="true" style={{ color: dark ? 'var(--color-glow)' : 'var(--color-plum-950)', fontSize: 'clamp(18px, 2vw, 28px)' }}>
            ✳︎
          </span>
        </span>
      ))}
    </div>
  )
}

/**
 * Two strips of hazard tape crossing over each other. They crawl on their own and
 * speed up with how fast you scroll, then ease back.
 */
export default function HazardTape() {
  const wrap = useRef<HTMLDivElement>(null)
  const a = useRef<HTMLDivElement>(null)
  const b = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf: number | null = null
    let visible = false
    let x = 0
    let vel = 0
    let lastY = window.scrollY
    let last = 0

    const loop = (now: number) => {
      const dt = Math.min(50, now - (last || now))
      last = now
      const y = window.scrollY
      const dy = y - lastY
      lastY = y
      vel += (Math.abs(dy) * 0.6 - vel) * 0.12
      x -= (0.05 + vel * 0.02) * dt
      const wA = a.current?.firstElementChild as HTMLElement | null
      const span = wA?.offsetWidth || 2000
      if (-x > span) x += span
      if (a.current) a.current.style.transform = `translate3d(${x}px,0,0)`
      if (b.current) b.current.style.transform = `translate3d(${-span - x}px,0,0)`
      raf = visible && !document.hidden ? requestAnimationFrame(loop) : null
      if (raf === null) last = 0
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && raf === null) raf = requestAnimationFrame(loop)
    })
    if (wrap.current) io.observe(wrap.current)
    const onVis = () => {
      if (!document.hidden && visible && raf === null) raf = requestAnimationFrame(loop)
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={wrap} aria-hidden="true" className="relative h-[180px] sm:h-[220px] overflow-hidden bg-plum-900 select-none">
      <div className="absolute left-[-10%] right-[-10%] top-1/2 -translate-y-1/2 rotate-[-4deg]">
        <div className="hazard h-2" />
        <div className="bg-rust py-2 overflow-hidden">
          <div ref={a} className="flex will-change-transform">
            <Track />
            <Track />
          </div>
        </div>
        <div className="hazard h-2" />
      </div>
      <div className="absolute left-[-10%] right-[-10%] top-1/2 -translate-y-1/2 rotate-[3deg] opacity-95">
        <div className="bg-plum-950 py-2 overflow-hidden border-y border-rust/40">
          <div ref={b} className="flex will-change-transform">
            <Track dark />
            <Track dark />
          </div>
        </div>
      </div>
    </div>
  )
}
