import { useRef, useState } from 'react'
import { useScrollVar } from '../hooks/useScrollVar'
import ScrambleText from './ScrambleText'

const STEPS = [
  { title: 'Scavenge', weeks: 'Weeks 1 to 2', body: 'Two weeks of questions. We talk to your customers, your staff and your competitors’ customers, and list everything you already own that still works.' },
  { title: 'Sort', weeks: 'Weeks 3 to 5', body: 'Three directions, each shown as real things: a homepage, a box, a sign on a door. You pick one. Nobody pitches a mood board.' },
  { title: 'Weld', weeks: 'Weeks 6 to 14', body: 'Designers and engineers at one table. What we show you on Friday is something you can click, hold or print on Monday.' },
  { title: 'Keep it running', weeks: 'Six months after launch', body: 'Launch is when the real feedback arrives, so the same team stays on for half a year to fix, tune and answer the phone.' },
]

export default function Process() {
  const listRef = useRef<HTMLOListElement>(null)
  const [lit, setLit] = useState(0)
  // The weld seam draws down the steps as you scroll; each step lights as the torch passes it.
  useScrollVar(listRef, '--seam', {
    start: 0.7,
    end: 0.7,
    onChange: (p) => {
      const n = Math.min(STEPS.length, Math.floor(p * STEPS.length + 0.35))
      setLit((prev) => (prev === n ? prev : n))
    },
  })

  return (
    <section id="process" aria-labelledby="process-title" className="relative bg-plum-950 text-bone px-5 sm:px-8 md:px-10 py-24 sm:py-32 overflow-hidden">
      <div className="grid gap-12 md:grid-cols-[1fr_1.35fr] md:gap-20">
        <div className="md:sticky md:top-28 self-start">
          <ScrambleText as="h2" id="process-title" text="How we operate" className="display block" style={{ fontSize: 'clamp(34px, 3.8vw, 72px)' }} />
          <p className="mt-6 max-w-[36ch] text-[15px] sm:text-[16px] leading-[1.7] text-bone/70">
            Four steps, the same every time. Most projects take 10 to 16 weeks, and you will always know which week you
            are in.
          </p>
        </div>

        <ol ref={listRef} className="relative pl-12 sm:pl-16">
          {/* The seam: a cold groove, a hot bead that grows with scroll, and the torch at its tip */}
          <span aria-hidden="true" className="absolute left-[14px] sm:left-[20px] top-2 bottom-2 w-[3px] rounded-full bg-bone/10" />
          <span
            aria-hidden="true"
            className="absolute left-[14px] sm:left-[20px] top-2 w-[3px] rounded-full origin-top"
            style={{
              height: 'calc(100% - 1rem)',
              transform: 'scaleY(var(--seam, 0))',
              background: 'linear-gradient(to bottom, #6e3a22, #b8561f 70%, #ffc861)',
              boxShadow: '0 0 12px rgba(232,118,42,0.55)',
            }}
          />
          <span
            aria-hidden="true"
            className="absolute left-[15.5px] sm:left-[21.5px] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff4d6]"
            style={{
              top: 'calc(0.5rem + (100% - 1rem) * var(--seam, 0))',
              boxShadow: '0 0 10px 4px rgba(255,200,97,0.9), 0 0 36px 12px rgba(232,118,42,0.45)',
              animation: 'ember 0.18s steps(2) infinite',
            }}
          />

          {STEPS.map((s, i) => {
            const on = i < lit
            return (
              <li key={s.title} className="relative border-b border-bone/12 py-8 sm:py-10 first:pt-0">
                <span
                  aria-hidden="true"
                  className={`absolute -left-12 sm:-left-16 top-8 sm:top-10 font-mono text-[13px] transition-colors duration-500 ${i === 0 ? 'top-0 sm:top-0' : ''} ${on ? 'text-glow' : 'text-bone/30'}`}
                >
                  0{i + 1}
                </span>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3
                    className={`font-heading font-normal tracking-[-0.03em] transition-colors duration-500 ${on ? 'text-rust' : 'text-bone/40'}`}
                    style={{ fontSize: 'clamp(22px, 2.4vw, 38px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
                  >
                    {s.title}
                  </h3>
                  <span className="font-mono text-[12px] text-bone/55">{s.weeks}</span>
                </div>
                <p className={`mt-4 max-w-[48ch] text-[15px] sm:text-[16px] leading-[1.7] transition-colors duration-500 ${on ? 'text-bone/85' : 'text-bone/45'}`}>
                  {s.body}
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
