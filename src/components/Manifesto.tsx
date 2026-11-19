import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useScrollVar } from '../hooks/useScrollVar'
import { useInView } from '../hooks/useInView'
import Reveal from './Reveal'

const STATEMENT =
  'Good work is mostly salvage. We keep the parts that work, throw out what is truly broken, and weld the rest into something people remember.'

const FACTS = [
  { value: 26, label: 'people in Rotterdam and Lisbon' },
  { value: 1, label: 'robot, answering the door' },
  { value: 9, label: 'clients at a time, never more' },
]

function Counter({ to, run }: { to: number; run: boolean }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(to)
      return
    }
    const start = performance.now()
    let raf = 0
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 1400)
      const e = 1 - Math.pow(1 - t, 4)
      setN(Math.round(to * e))
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [run, to])
  return <>{n}</>
}

export default function Manifesto() {
  const textRef = useRef<HTMLParagraphElement>(null)
  useScrollVar(textRef, '--p', { start: 0.9, end: 0.55 })
  const { ref: factsRef, inView } = useInView<HTMLDListElement>(0.4)
  const words = STATEMENT.split(' ')

  return (
    <section id="about" aria-label="About JUNK" className="relative bg-plum-900">
      <div className="px-5 sm:px-8 md:px-10 pt-24 sm:pt-32 pb-20 sm:pb-28">
        {/* Words light up one by one as you scroll through the statement */}
        <p
          ref={textRef}
          className="max-w-[30ch] text-bone"
          style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 2.6vw, 44px)', lineHeight: 1.25, letterSpacing: '-0.035em', fontWeight: 400 } as CSSProperties}
        >
          {words.map((w, i) => (
            <span
              key={i}
              className="inline"
              style={{ opacity: `clamp(0.14, calc(var(--p, 0) * ${words.length + 4} - ${i}), 1)` } as CSSProperties}
            >
              {w}{' '}
            </span>
          ))}
        </p>

        <div className="mt-16 sm:mt-24 grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16 items-end">
          <Reveal>
            <p className="max-w-[44ch] text-[15px] sm:text-[16px] leading-[1.7] text-bone/75">
              JUNK is an independent studio for brands, products and the odd machine. We start with what you already
              have, the name, the habits, the half-finished ideas, and keep one small team with you from the first
              question to the week after launch.
            </p>
          </Reveal>

          <dl ref={factsRef} className="grid grid-cols-3 border-t-2 border-rust">
            {FACTS.map((f) => (
              <div key={f.label} className="pt-4 pr-4">
                <dt className="sr-only">{f.label}</dt>
                <dd className="display tabular-nums" style={{ fontSize: 'clamp(44px, 5vw, 84px)', lineHeight: 0.95, fontWeight: 300 }}>
                  <Counter to={f.value} run={inView} />
                </dd>
                <dd aria-hidden="true" className="mt-2 text-[13px] sm:text-[15px] leading-snug text-bone/65 max-w-[16ch]">
                  {f.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
