import { useEffect, useRef, useState } from 'react'
import RobotHead from './RobotHead'
import HoldButton from './HoldButton'
import ScrambleText from './ScrambleText'
import { useTypewriter } from '../hooks/useTypewriter'
import { useInView } from '../hooks/useInView'
import { EMAIL } from './Hero'

type Route = { test: RegExp; team: string; reply: string }

const ROUTES: Route[] = [
  {
    test: /\b(hire|hiring|job|jobs|work here|career|intern|apply|portfolio)\b/i,
    team: 'Openings',
    reply: 'Looking for a seat at the bench, then. The current openings are just below. If none fit, send your work anyway. We read all of it.',
  },
  // Brand words win over product words: "a rebrand for my shop" is a brand job.
  {
    test: /\b(brand|rebrand|branding|logo|identity|name|naming|packaging|label|signage|wayfinding)\b/i,
    team: 'Brand team',
    reply: 'A brand, good. That goes straight to the brand team. Expect a reply within two working days, and maybe a question about your competitors.',
  },
  {
    test: /\b(app|website|site|web|product|software|platform|dashboard|saas|tool|store|shop)\b/i,
    team: 'Product team',
    reply: 'Something people will click on. That goes to the product team. They usually reply within two working days with a few honest questions.',
  },
  {
    test: /\b(object|lamp|chair|speaker|hardware|device|furniture|physical|print|book|poster|robot)\b/i,
    team: 'Labs',
    reply: 'Something you can hold. Labs will want this one. Give them a week, they like to sketch before they answer.',
  },
]

function routeIdea(idea: string) {
  const match = ROUTES.find((r) => r.test.test(idea))
  if (match) return { team: match.team, text: match.reply }
  return {
    team: 'Founders',
    text: 'Interesting. That one does not fit a box, so it goes to the founders directly. They answer the odd ones themselves, usually within the week.',
  }
}

const OPENER = 'Tell me what you want to make. A sentence is plenty. Then hold the button to weld it.'
const SUGGESTIONS = ['A rebrand for my bakery', 'An app for booking studios', 'A speaker that looks like a lamp']

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

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent('A pitch for JUNK')}&body=${encodeURIComponent(
    `${submitted}\n\n(Sorted by JUN977 to: ${route?.team ?? ''})`,
  )}`

  const mood =
    phase === 'thinking'
      ? 'thinking'
      : (phase === 'reply' && !answer.done) || (phase === 'ask' && inView && !opener.done)
        ? 'talking'
        : 'idle'

  return (
    <div ref={sectionRef} id="pitch" aria-labelledby="pitch-title" role="region" className="relative w-full max-w-[580px] scroll-mt-28">
        <ScrambleText as="h3" id="pitch-title" text="Pitch us an idea" className="display block mb-6" style={{ fontSize: 'clamp(26px, 2.4vw, 42px)' }} />

        {/* The console: rust casing, plum screen, input on the ledge */}
        <div className="relative rounded-[24px] bg-rust p-3 sm:p-4 shadow-[0_50px_90px_-40px_rgba(0,0,0,0.8)]">
          <span aria-hidden="true" className="absolute top-0 right-8 h-3 w-24 hazard rounded-b-sm" />
          <div className="relative rounded-[14px] bg-plum-950 overflow-hidden">
            <div className="flex items-center gap-4 px-5 pt-5">
              <RobotHead mood={mood} className="w-[84px] aspect-[1.2] shrink-0" />
              <div className="leading-tight">
                <div className="font-heading font-normal tracking-[-0.03em] text-[19px] text-rust">JUN977</div>
                <div className="flex items-center gap-2 mt-1 font-mono text-[11.5px] text-bone/60">
                  <span className="size-1.5 rounded-full bg-glow shadow-[0_0_6px_rgba(255,200,97,0.9)]" />
                  {phase === 'thinking' ? 'Reading your idea' : 'Online, reads every pitch'}
                </div>
              </div>
            </div>

            <div className="min-h-[210px] px-5 pt-5 pb-6 text-[15px] sm:text-[16px] leading-[1.45] text-glow" style={{ textShadow: '0 0 14px rgba(255,200,97,0.3)' }}>
              <p className="sr-only" aria-live="polite">
                {phase === 'reply' ? `JUN977 says: ${route?.text}` : nudge ? 'Type an idea first.' : ''}
              </p>
              {phase === 'ask' ? (
                <p aria-hidden="true">
                  {nudge ? 'Nothing to weld yet. Type an idea first.' : opener.displayed}
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
                Email this to the {route?.team}
              </a>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center rounded-[4px] bg-bone text-plum-950 px-5 py-2.5 text-[15px] font-semibold hover:bg-white transition-colors duration-200 cursor-pointer"
              >
                Pitch something else
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
                Your idea
              </label>
              <input
                ref={inputRef}
                id="pitch-input"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                disabled={phase !== 'ask'}
                placeholder="A rebrand for my bakery"
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
