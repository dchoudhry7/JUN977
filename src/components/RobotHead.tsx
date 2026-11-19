import { useEffect, useRef, useState } from 'react'

type Props = {
  /** 'thinking' narrows the eyes, 'talking' flickers them. */
  mood?: 'idle' | 'thinking' | 'talking'
  className?: string
}

/**
 * JUN977's box head, drawn from the reference renders: steel plate, rivets,
 * a hazard-stripe patch, two glowing eyes that follow the pointer.
 */
export default function RobotHead({ mood = 'idle', className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const eyesRef = useRef<HTMLDivElement>(null)
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf: number | null = null
    let tx = 0
    let ty = 0
    let x = 0
    let y = 0

    const tick = () => {
      x += (tx - x) * 0.25
      y += (ty - y) * 0.25
      if (eyesRef.current) eyesRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.05 ? requestAnimationFrame(tick) : null
    }

    const onMove = (e: PointerEvent) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const dist = Math.hypot(dx, dy) || 1
      const reach = Math.min(1, dist / 450)
      tx = (dx / dist) * reach * r.width * 0.07
      ty = (dy / dist) * reach * r.height * 0.07
      if (raf === null) raf = requestAnimationFrame(tick)
    }

    let blinkTimer: number
    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(() => {
        setBlink(true)
        window.setTimeout(() => setBlink(false), 130)
        scheduleBlink()
      }, 2600 + Math.random() * 3400)
    }
    scheduleBlink()

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.clearTimeout(blinkTimer)
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [])

  const eyeScale = blink ? 0.08 : mood === 'thinking' ? 0.4 : 1

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`relative overflow-hidden rounded-[10%] ${className}`}
      style={{
        boxShadow:
          'inset 0 2px 0 rgba(255,255,255,0.18), inset 0 -10px 24px rgba(0,0,0,0.35), 0 24px 50px -24px rgba(0,0,0,0.7)',
        background: 'linear-gradient(165deg, #a9a5ad 0%, #8d8a92 45%, #6f6b76 100%)',
      }}
    >
      {/* Rivets */}
      {['top-[6%] left-[5%]', 'top-[6%] right-[5%]', 'bottom-[6%] left-[5%]', 'bottom-[6%] right-[5%]'].map((pos) => (
        <span key={pos} className={`absolute ${pos} size-[4.5%] rounded-full bg-black/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]`} />
      ))}
      {/* Hazard patch, a little scuffed */}
      <span
        className="absolute top-[9%] right-[16%] h-[11%] w-[22%] opacity-90"
        style={{
          backgroundImage: 'repeating-linear-gradient(-45deg, #e8762a 0 18%, transparent 18% 36%)',
          clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)',
        }}
      />
      {/* Rust smear */}
      <span className="absolute bottom-[14%] left-[10%] h-[8%] w-[16%] rounded-full bg-brick/40 blur-[2px]" />

      {/* Eyes: sockets stay put, the glowing lenses track the pointer */}
      <div className="absolute inset-x-0 top-[24%] flex justify-center gap-[12%]">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="relative block w-[27%] aspect-square rounded-full bg-plum-950"
            style={{ boxShadow: 'inset 0 0 0 3px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,255,255,0.06)' }}
          />
        ))}
      </div>
      <div ref={eyesRef} className="absolute inset-x-0 top-[24%] flex justify-center gap-[12%]">
        {[0, 1].map((i) => (
          <span key={i} className="relative block w-[27%] aspect-square">
            <span
              className={`absolute inset-[12%] rounded-full transition-transform duration-150 ${mood === 'talking' ? 'talk' : ''}`}
              style={{
                transform: `scaleY(${eyeScale})`,
                background: 'radial-gradient(circle, rgb(28 20 31 / 0.35) 0.9px, transparent 1.3px) 0 0 / 4px 4px, radial-gradient(circle at 45% 40%, #fff4d6 0%, #ffc861 45%, #e89a3a 100%)',
                boxShadow: '0 0 14px 3px rgba(255,200,97,0.65), 0 0 46px 10px rgba(255,200,97,0.22)',
              }}
            />
          </span>
        ))}
      </div>

      {/* The little triangle under the eyes */}
      <span
        className="absolute left-1/2 bottom-[13%] -translate-x-1/2 w-[11%] aspect-[1.15] bg-brick"
        style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', boxShadow: '0 0 0 2px #efe6dc' }}
      />
    </div>
  )
}
