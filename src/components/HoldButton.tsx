import { useEffect, useRef, useState, type CSSProperties } from 'react'

const HOLD_MS = 850

/**
 * Press and hold to weld. Progress builds while held, eases back if released
 * early, and fires `onDone` when the seam closes. Keyboard (Enter or Space) and
 * reduced motion skip the hold and fire at once.
 */
export default function HoldButton({ onDone, disabled, label = 'Hold to weld' }: { onDone: () => void; disabled?: boolean; label?: string }) {
  const [p, setP] = useState(0)
  const holding = useRef(false)
  const raf = useRef<number | null>(null)
  const last = useRef(0)
  const val = useRef(0)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  const loop = (now: number) => {
    const dt = Math.min(50, now - (last.current || now))
    last.current = now
    if (holding.current) val.current = Math.min(1, val.current + dt / HOLD_MS)
    else val.current = Math.max(0, val.current - dt / 400)
    setP(val.current)
    if (val.current >= 1) {
      holding.current = false
      raf.current = null
      last.current = 0
      doneRef.current()
      window.setTimeout(() => {
        val.current = 0
        setP(0)
      }, 250)
      return
    }
    if (holding.current || val.current > 0) raf.current = requestAnimationFrame(loop)
    else {
      raf.current = null
      last.current = 0
    }
  }

  const start = (e: React.PointerEvent) => {
    if (disabled || e.button !== 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone()
      return
    }
    try {
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    } catch {
      /* capture is a nicety; the hold still works without it */
    }
    holding.current = true
    if (raf.current === null) raf.current = requestAnimationFrame(loop)
  }
  const stop = () => {
    holding.current = false
  }

  useEffect(() => () => {
    if (raf.current !== null) cancelAnimationFrame(raf.current)
  }, [])

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={start}
      onPointerUp={stop}
      onPointerCancel={stop}
      onLostPointerCapture={stop}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onDone()
        }
      }}
      onContextMenu={(e) => e.preventDefault()}
      aria-label={`${label}. Or press Enter.`}
      className="relative shrink-0 overflow-hidden rounded-[4px] bg-plum-950 text-bone px-5 py-2.5 text-[15px] font-semibold select-none touch-none disabled:opacity-60 cursor-pointer"
      style={{ '--hold': p } as CSSProperties}
    >
      {/* the bead fills left to right, white-hot at its leading edge */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-full origin-left"
        style={{
          transform: 'scaleX(var(--hold))',
          background: 'linear-gradient(90deg, #b8561f 0%, #e8762a 80%, #ffc861 96%, #fff4d6 100%)',
        }}
      />
      <span className="relative" style={{ color: p > 0.45 ? 'var(--color-plum-950)' : undefined }}>
        {p > 0 ? (p >= 1 ? 'Welded' : 'Welding…') : label}
      </span>
    </button>
  )
}
