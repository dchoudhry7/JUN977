import { useEffect, useRef, useState } from 'react'
import ScrambleText from './ScrambleText'

/* What we pick up: examples, what happens to it, and what it costs */
type Project = { name: string; scope: string; sector: string; year: string; line: string; code: string }

const PROJECTS: Project[] = [
  { name: 'Phones and tablets', scope: 'Any brand, cracked is fine', sector: 'Wiped, then refurbished', year: 'Free', code: 'PH', line: 'Cracked screens welcome. We wipe it before anything else.' },
  { name: 'Laptops and computers', scope: 'Desktops, towers, Macs', sector: 'Wiped, then refurbished', year: 'Free', code: 'PC', line: 'Drives wiped to a certified standard, or shredded if you ask.' },
  { name: 'Cables and chargers', scope: 'The whole drawer, tangled', sector: 'Copper recovered', year: 'Free', code: 'CB', line: 'Bring the knot. Untangling it is our job.' },
  { name: 'Audio and gaming', scope: 'Speakers, consoles, headphones', sector: 'Repaired or parted', year: 'Free', code: 'AV', line: 'Consoles that still boot go to the refurbished shelf.' },
  { name: 'Batteries and power banks', scope: 'Terminals taped, in a bag', sector: 'Certified recycler', year: 'Free', code: 'BT', line: 'Tape the ends, bag them up, and leave the rest to us.' },
  { name: 'TVs and monitors', scope: 'Up to 65 inches', sector: 'Panels recycled', year: '€15', code: 'TV', line: 'Two of us carry it down. You hold the door.' },
]

export default function Work() {
  const [active, setActive] = useState<number | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, vx: 0 })
  const raf = useRef<number | null>(null)

  // The plate trails the cursor and tilts with its speed, like it's hanging from a hook.
  useEffect(() => {
    if (active === null) return
    const tick = () => {
      const p = pos.current
      const nx = p.x + (p.tx - p.x) * 0.22
      p.vx = nx - p.x
      p.x = nx
      p.y += (p.ty - p.y) * 0.22
      const tilt = Math.max(-14, Math.min(14, p.vx * 0.9))
      if (previewRef.current) {
        previewRef.current.style.transform = `translate3d(${p.x + 28}px, ${p.y - 120}px, 0) rotate(${tilt}deg)`
      }
      raf.current = Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y) > 0.3 ? requestAnimationFrame(tick) : null
    }
    const onMove = (e: PointerEvent) => {
      pos.current.tx = e.clientX
      pos.current.ty = e.clientY
      if (raf.current === null) raf.current = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf.current !== null) cancelAnimationFrame(raf.current)
      raf.current = null
    }
  }, [active])

  const enter = (i: number, e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    if (active === null) {
      pos.current = { x: e.clientX, y: e.clientY, tx: e.clientX, ty: e.clientY, vx: 0 }
      if (previewRef.current) previewRef.current.style.transform = `translate3d(${e.clientX + 28}px, ${e.clientY - 120}px, 0)`
    }
    setActive(i)
  }

  const current = active !== null ? PROJECTS[active] : null

  return (
    <section id="take" aria-labelledby="take-title" className="relative bg-plum-900 px-5 sm:px-8 md:px-10 pb-24 sm:pb-32">
      <div className="flex flex-wrap items-end justify-between gap-4 border-t-2 border-rust pt-6">
        <ScrambleText as="h2" id="take-title" text="What we take" className="display block" style={{ fontSize: 'clamp(34px, 4vw, 76px)' }} />
        <p className="font-mono text-[13px] text-bone/60">If it has a plug or a battery, we take it</p>
      </div>

      <ul className="mt-8 sm:mt-12" onPointerLeave={() => setActive(null)}>
        {PROJECTS.map((p, i) => (
          <li key={p.name}>
            <a
              href="#pitch"
              onPointerEnter={(e) => enter(i, e)}
              className={`group relative grid grid-cols-[1fr_auto] md:grid-cols-[2.2fr_1.6fr_1fr_auto] items-baseline gap-x-6 gap-y-1 border-b border-bone/15 py-5 sm:py-6 transition-opacity duration-300 ${
                active !== null && active !== i ? 'md:opacity-30' : 'opacity-100'
              }`}
            >
              {/* a rust sweep that wipes under the row on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-left scale-x-0 bg-rust transition-transform duration-500 ease-out-soft group-hover:scale-x-100"
              />
              <span
                className="text-bone transition-transform duration-500 ease-out-soft md:group-hover:translate-x-4"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px, 2.2vw, 34px)', letterSpacing: '-0.035em', lineHeight: 1.15, fontWeight: 400 }}
              >
                {p.name}
              </span>
              <span className="text-[15px] text-bone/85 order-last col-span-2 md:order-none md:col-span-1">{p.scope}</span>
              <span className="hidden md:block text-[15px] text-bone/55">{p.sector}</span>
              <span className="font-mono text-[13px] text-bone/55 tabular-nums">{p.year}</span>
            </a>
          </li>
        ))}
      </ul>

      {/* Floating plate: riveted steel, hazard edge, a code sticker */}
      <div ref={previewRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 hidden md:block" style={{ zIndex: 20 }}>
        <div
          className="relative w-[320px] h-[210px] rounded-[10px] text-plum-950 p-5 flex flex-col justify-between overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] transition-[opacity,scale] duration-300 ease-out-soft"
          style={{
            opacity: current ? 1 : 0,
            scale: current ? '1' : '0.9',
            background: 'linear-gradient(160deg, #a8a4ab 0%, #85818b 60%, #6e6a74 100%)',
          }}
        >
          {['top-2 left-2', 'top-2 right-12', 'bottom-2 left-2', 'bottom-2 right-12'].map((c) => (
            <span key={c} className={`absolute ${c} size-2 rounded-full bg-plum-950/50`} />
          ))}
          <span className="absolute top-0 right-0 h-full w-9 hazard" />
          <span className="relative font-heading font-normal tracking-[-0.03em] text-[26px] leading-[0.95] pr-10">{current?.name}</span>
          <span className="relative text-[14px] leading-snug max-w-[26ch] font-medium">{current?.line}</span>
          <span className="sticker absolute bottom-4 right-12 text-[15px]">{current?.code}</span>
        </div>
      </div>
    </section>
  )
}
