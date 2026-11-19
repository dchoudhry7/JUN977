import type { CSSProperties } from 'react'
import { useCopy } from '../hooks/useCopy'
import { CheckIcon, CopyIcon } from './CopyIcon'
import { EMAIL } from './Hero'
import { NAV_LINKS } from './Navbar'
import ScrambleText from './ScrambleText'

const STUDIOS = [
  { city: 'Pickups', hours: 'Mon to Sat, 8 am to 8 pm' },
  { city: 'Where', hours: 'Any city, any PIN code' },
]

export default function Footer() {
  const { copied, copy } = useCopy()

  const mark: CSSProperties = { fontSize: 'clamp(96px, 24vw, 460px)', lineHeight: 0.8, letterSpacing: '-0.07em', fontWeight: 300 }

  return (
    <footer id="contact" className="relative bg-plum-950 text-bone overflow-hidden" style={{ zIndex: 1 }}>
      <div aria-hidden="true" className="hazard h-3 sm:h-4" />
      <div className="px-5 sm:px-8 md:px-10 pt-24 sm:pt-32 pb-8">
        <ScrambleText as="h2" text="Got a drawer full?" className="display block max-w-[14em]" style={{ fontSize: 'clamp(32px, 3.8vw, 68px)' }} />
        <p className="mt-6 max-w-[40ch] text-[15px] sm:text-[16px] leading-[1.7] text-bone/65">
          Book with JUN977 above, or email us your list. A person reads this inbox and confirms a slot within one working day.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${EMAIL}`}
            className="underline underline-offset-4 decoration-1 hover:text-rust transition-colors"
            style={{ fontSize: 'clamp(18px, 2.2vw, 30px)', fontWeight: 400, letterSpacing: '-0.02em' }}
          >
            {EMAIL}
          </a>
          <button
            type="button"
            onClick={() => copy(EMAIL)}
            className="inline-flex items-center gap-2 rounded-[4px] border border-bone/35 px-4 py-1.5 text-[14px] hover:bg-bone hover:text-plum-950 transition-colors duration-200 cursor-pointer"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="mt-20 sm:mt-28 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-bone/15 pt-8 text-[15px]">
          {STUDIOS.map((s) => (
            <div key={s.city}>
              <p className="text-[15px] leading-none text-bone">{s.city}</p>
              <p className="mt-2 font-mono text-[12.5px] text-bone/55">{s.hours}</p>
            </div>
          ))}
          <nav aria-label="Footer">
            <ul className="space-y-1">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-bone/80 hover:text-rust transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="space-y-1">
            {['Instagram', 'LinkedIn', 'Are.na'].map((s) => (
              <li key={s}>
                <a href="#" className="text-bone/80 hover:text-rust transition-colors">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* The wordmark, large and quiet. Each letter warms to orange under the pointer. */}
        <div aria-hidden="true" className="mt-16 sm:mt-24 flex items-end justify-between select-none">
          <span className="display wordmark" style={mark}>
            {'JUNK'.split('').map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </span>
          <span className="spin-slow inline-block text-rust mb-[2vw]" style={{ fontSize: 'clamp(28px, 5vw, 90px)' }}>
            ✳︎
          </span>
        </div>

        <div className="mt-8 flex flex-wrap justify-between gap-4 font-mono text-[12px] text-bone/45">
          <span>© 2026 JUNK Recycling Pvt. Ltd.</span>
          <span>JUN977 turns when you do.</span>
        </div>
      </div>
    </footer>
  )
}
