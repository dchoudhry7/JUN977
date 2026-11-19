import { useEffect, useRef, useState } from 'react'
import RobotHead from './RobotHead'
import HoldButton from './HoldButton'
import ScrambleText from './ScrambleText'
import { useTypewriter } from '../hooks/useTypewriter'
import { useInView } from '../hooks/useInView'
import { EMAIL } from './Hero'

type Route = { test: RegExp; team: string; reply: string }

/* JUN977 reads the list and says what happens to it. First match wins. */
const ROUTES: Route[] = [
  {
    test: /\b(batter(y|ies)|power ?banks?|cells?)\b/i,
    team: 'Batteries',
    reply: 'Batteries. Tape the ends and put them in a bag. Pickup is free, and they go straight to a certified recycler.',
  },
  {
    test: /\b(tv|tvs|television|monitors?|screens?|display)\b/i,
    team: 'Large items',
    reply: 'A screen. Two of us will come and carry it down. Big screens are €15, paid at the door. Everything else on your list is free.',
  },
  {
    test: /\b(phones?|iphone|android|laptops?|macbook|computers?|pc|desktop|tablets?|ipad|hard ?drives?|drives?|ssd)\b/i,
    team: 'Data devices',
    reply: 'Devices with data. We wipe them before anything else and email you a certificate. Pickup is free.',
  },
  {
    test: /\b(cables?|chargers?|adapters?|wires?|plugs?)\b/i,
    team: 'Small items',
    reply: 'The cable drawer. Bag it all up, tangles included. Pickup is free, and the copper gets a second life.',
  },
]

function routeIdea(idea: string) {
  const match = ROUTES.find((r) => r.test.test(idea))
  if (match) return { team: match.team, text: match.reply }
  return {
    team: 'General',
    text: 'Got it. If it has a plug or a battery, we take it, and most pickups are free. Send this and we will confirm a slot within a day.',
  }
}

const OPENER = 'Tell me what you want picked up. A short list is plenty. Then hold the button to book.'
const SUGGESTIONS = ['Two old laptops and a printer', 'A box of cables and chargers', 'An old 50 inch TV']

type Phase = 'ask' | 'thinking' | 'reply'

const caret = 'cursor-blink inline-block w-[2px] h-[1.05em] bg-glow align-middle ml-[2px]'

export default function Pitch() {
  const { ref: sectionRef, inView } = useInView<HTMLDivElement>(0.35)
  const [idea, setIdea] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [phase, setPhase] = useState<Phase>('ask')
  const [route, setRoute] = useState<{ team: string; text: string } | null>(null)
  const [nudge, setNudge] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const opener = useTypewriter(OPENER, 26, 300, inView)
  const answer = useTypewriter(route?.text ?? '', 22, 0, phase === 'reply')

  useEffect(() => {
    if (phase !== 'thinking') return
    const t = window.setTimeout(() => setPhase('reply'), 900)
    return () => window.clearTimeout(t)
  }, [phase])

  const submit = (text: string) => {
    const clean = text.trim()
    if (!clean) {
      setNudge(true)
      window.setTimeout(() => setNudge(false), 1600)
      inputRef.current?.focus()
      return
    }
    setSubmitted(clean)
    setRoute(routeIdea(clean))
    setPhase('thinking')
    setIdea('')
  }

  const reset = () => {
    setPhase('ask')
    setSubmitted('')
    setRoute(null)
    window.setTimeout(() => inputRef.current?.focus(), 50)
  }

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent('Pickup request')}&body=${encodeURIComponent(
    `What to pick up: ${submitted}\n\nAddress and postcode:\nBest day and time:\n\n(Sorted by JUN977: ${route?.team ?? ''})`,
  )}`

  const mood =
    phase === 'thinking'
      ? 'thinking'
      : (phase === 'reply' && !answer.done) || (phase === 'ask' && inView && !opener.done)
        ? 'talking'
        : 'idle'

  return (
    <div ref={sectionRef} id="pitch" aria-labelledby="pitch-title" role="region" className="relative w-full max-w-[580px] scroll-mt-28">
        <ScrambleText as="h3" id="pitch-title" text="Book a pickup" className="display block mb-6" style={{ fontSize: 'clamp(26px, 2.4vw, 42px)' }} />

        {/* The booking console: rust casing, plum screen, input on the ledge */}
        <div className="relative rounded-[24px] bg-rust p-3 sm:p-4 shadow-[0_50px_90px_-40px_rgba(0,0,0,0.8)]">
          <span aria-hidden="true" className="absolute top-0 right-8 h-3 w-24 hazard rounded-b-sm" />
          <div className="relative rounded-[14px] bg-plum-950 overflow-hidden">
            <div className="flex items-center gap-4 px-5 pt-5">
              <RobotHead mood={mood} className="w-[84px] aspect-[1.2] shrink-0" />
              <div className="leading-tight">
                <div className="font-heading font-normal tracking-[-0.03em] text-[19px] text-rust">JUN977</div>
                <div className="flex items-center gap-2 mt-1 font-mono text-[11.5px] text-bone/60">
                  <span className="size-1.5 rounded-full bg-glow shadow-[0_0_6px_rgba(255,200,97,0.9)]" />
                  {phase === 'thinking' ? 'Checking your list' : 'Online, books pickups'}
                </div>
              </div>
            </div>

            <div className="min-h-[210px] px-5 pt-5 pb-6 text-[15px] sm:text-[16px] leading-[1.45] text-glow" style={{ textShadow: '0 0 14px rgba(255,200,97,0.3)' }}>
              <p className="sr-only" aria-live="polite">
                {phase === 'reply' ? `JUN977 says: ${route?.text}` : nudge ? 'Type what you have first.' : ''}
              </p>
              {phase === 'ask' ? (
                <p aria-hidden="true">
                  {nudge ? 'Nothing to book yet. Type what you have first.' : opener.displayed}
                  {!opener.done && inView && !nudge && <span className={caret} />}
                </p>
              ) : (
                <div aria-hidden="true">
                  <p className="text-bone/55 text-[15px] sm:text-[16px]">You: {submitted}</p>
                  <p className="mt-4">
                    {phase === 'thinking' ? (
                      <span className={caret} />
                    ) : (
                      <>
                        {answer.displayed}
                        {!answer.done && <span className={caret} />}
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {phase === 'reply' && answer.done ? (
            <div className="flex flex-wrap gap-2 pt-3 sm:pt-4">
              <a href={mailto} className="inline-flex items-center rounded-[4px] bg-plum-950 text-bone px-5 py-2.5 text-[15px] font-semibold hover:bg-black transition-colors duration-200">
                Email to book this pickup
              </a>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center rounded-[4px] bg-bone text-plum-950 px-5 py-2.5 text-[15px] font-semibold hover:bg-white transition-colors duration-200 cursor-pointer"
              >
                Start over
              </button>
            </div>
          ) : (
            <form
              className="flex gap-2 pt-3 sm:pt-4"
              onSubmit={(e) => {
                e.preventDefault()
                submit(idea)
              }}
            >
              <label htmlFor="pitch-input" className="sr-only">
                What you want picked up
              </label>
              <input
                ref={inputRef}
                id="pitch-input"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                disabled={phase !== 'ask'}
                placeholder="Two old phones and a laptop"
                autoComplete="off"
                className="min-w-0 flex-1 rounded-[4px] bg-bone px-5 py-2.5 text-[16px] text-plum-950 placeholder:text-plum-950/45 outline-none focus-visible:ring-2 focus-visible:ring-plum-950 disabled:opacity-60"
              />
              <HoldButton disabled={phase !== 'ask'} onDone={() => submit(idea)} />
            </form>
          )}
        </div>

        {phase === 'ask' && (
          <div className="mt-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => submit(s)}
                className="rounded-[4px] border border-bone/20 bg-plum-950/70 px-4 py-1.5 text-[14px] text-bone hover:bg-bone hover:text-plum-950 transition-colors duration-200 cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        )}
    </div>
  )
}
