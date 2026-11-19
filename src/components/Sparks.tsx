import { useEffect, useRef } from 'react'

/** Every click throws a small burst of welding sparks. Sleeps when nothing is burning. */
export default function Sparks() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; w: number }
    let parts: P[] = []
    let raf: number | null = null
    let last = 0

    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    size()

    const step = (now: number) => {
      const dt = Math.min(40, now - (last || now))
      last = now
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.globalCompositeOperation = 'lighter'
      parts = parts.filter((p) => (p.life += dt) < p.max)
      for (const p of parts) {
        const t = p.life / p.max
        const px = p.x
        const py = p.y
        p.vy += 0.0016 * dt // gravity
        p.vx *= 0.985
        p.x += p.vx * dt
        p.y += p.vy * dt
        // white-hot to amber to rust as it cools
        const col = t < 0.25 ? '255,244,214' : t < 0.6 ? '255,200,97' : '232,118,42'
        ctx.strokeStyle = `rgba(${col},${(1 - t).toFixed(3)})`
        ctx.lineWidth = p.w * (1 - t * 0.6)
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
      }
      ctx.globalCompositeOperation = 'source-over'
      if (parts.length) raf = requestAnimationFrame(step)
      else {
        raf = null
        last = 0
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      }
    }

    const burst = (e: PointerEvent) => {
      // Mouse and pen only: on touch screens a drag steers JUN977 instead
      if (reduce.matches || e.button !== 0 || e.pointerType === 'touch') return
      const n = 16 + Math.floor(Math.random() * 10)
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.5
        const sp = 0.25 + Math.random() * 0.55
        parts.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 0,
          max: 380 + Math.random() * 520,
          w: 1 + Math.random() * 1.6,
        })
      }
      if (raf === null) raf = requestAnimationFrame(step)
    }

    window.addEventListener('pointerdown', burst, { passive: true })
    window.addEventListener('resize', size)
    return () => {
      window.removeEventListener('pointerdown', burst)
      window.removeEventListener('resize', size)
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 h-full w-full" style={{ zIndex: 70 }} />
}
