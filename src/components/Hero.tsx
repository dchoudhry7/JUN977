import { useEffect, useState } from 'react'
import ScrambleText from './ScrambleText'

export const EMAIL = 'hello@junk.eco'

const QUESTION = 'Old tech? We’ll come and get it.'
const LINE = 'Free e-waste pickup, wherever you are. Data wiped, nothing sent to landfill.'
/* A taste of the list further down; each chip jumps to it */
const TAKES = ['Phones', 'Laptops', 'Cables', 'Batteries', 'Consoles', 'TVs']

/**
 * The opening frame belongs to JUN977, so the words stay few:
 * what we do, one line on how, and one way in.
 */
export default function HeroIntro() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 350)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <div className="max-w-[36rem]">
      <h1 className="sr-only">JUNK e-waste pickup. {QUESTION} {LINE}</h1>

      <ScrambleText
        text={QUESTION}
        start={ready}
        duration={1200}
        className="display block"
        style={{ fontSize: 'clamp(28px, 3.1vw, 54px)', fontWeight: 400 }}
      />

      <p
        aria-hidden="true"
        className="mt-5 max-w-[44ch] text-[13px] sm:text-[15px] leading-[1.6] text-bone/70"
        style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.6s ease 0.4s' }}
      >
        {LINE}
      </p>

      <button
        type="button"
        onClick={() => document.getElementById('pitch')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
        className="pill mt-6 inline-flex items-center rounded-[4px] bg-rust px-4 py-2 text-[13px] font-medium text-plum-950 hover:bg-bone transition-colors duration-200 cursor-pointer"
        style={{
          opacity: ready ? 1 : 0,
          transform: ready ? 'none' : 'translateY(8px)',
          transition: 'opacity 0.5s ease 0.6s, transform 0.5s ease 0.6s, background-color 0.2s',
        }}
      >
        Book a pickup
      </button>

      {/* What we take, at a glance. Hidden on phones to keep the robot clear. */}
      <div
        className="mt-8 hidden sm:flex flex-wrap items-center gap-2"
        style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.6s ease 0.9s' }}
      >
        <span className="mr-1 text-[12.5px] text-bone/55">We take</span>
        {TAKES.map((t) => (
          <a
            key={t}
            href="#take"
            className="rounded-[4px] border border-bone/20 bg-plum-950/40 px-3 py-1 text-[12.5px] text-bone/85 hover:border-rust hover:text-rust transition-colors duration-200"
            style={{ textShadow: 'none' }}
          >
            {t}
          </a>
        ))}
      </div>
    </div>
  )
}
