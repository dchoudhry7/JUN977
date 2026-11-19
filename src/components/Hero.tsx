import { useEffect, useState } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import { useCopy } from '../hooks/useCopy'
import { CheckIcon, CopyIcon } from './CopyIcon'
import ScrambleText from './ScrambleText'

export const EMAIL = 'hello@junk.studio'

const LEAD = 'Glad you stopped in. Good taste tends to find us.'
const QUESTION = 'Now, what are we building?'

const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

const LINKS = [
  { label: 'Come work here', id: 'openings' },
  { label: 'See how we operate', id: 'process' },
  { label: 'Send a brief hello', id: 'contact' },
]

/**
 * The opening frame belongs to JUN977, so the words stay small and low:
 * a typed hello, the question, one way in, and three quiet alternatives.
 */
export default function HeroIntro() {
  const { displayed, done } = useTypewriter(LEAD, 30, 500)
  const [showActions, setShowActions] = useState(false)
  const { copied, copy } = useCopy()

  useEffect(() => {
    const t = window.setTimeout(() => setShowActions(true), 400)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <div className="max-w-[30rem]">
      <h1 className="sr-only">
        JUNK, a creative studio. {LEAD} {QUESTION}
      </h1>

      {/* The hello, typed by JUN977 */}
      <p aria-hidden="true" className="text-[12px] sm:text-[13px] leading-[1.6] text-bone/65">
        <span className="inline-flex items-center gap-1.5 text-glow mr-2">
          <span className="size-1.5 rounded-full bg-glow shadow-[0_0_8px_rgba(255,200,97,0.9)]" />
          JUN977
        </span>
        {displayed}
        {!done && <span className="cursor-blink inline-block w-[0.55em] h-[1.05em] bg-rust align-middle ml-[2px]" />}
      </p>

      {/* The question decodes once the hello is typed */}
      <ScrambleText
        text={QUESTION}
        start={done}
        duration={1200}
        className="display block mt-3"
        style={{ fontSize: 'clamp(26px, 2.6vw, 44px)', fontWeight: 400 }}
      />

      <div
        className="mt-6"
        style={{
          opacity: showActions ? 1 : 0,
          transform: showActions ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <button
            type="button"
            onClick={() => goTo('pitch')}
            className="pill inline-flex items-center rounded-[4px] bg-rust px-4 py-2 text-[13px] font-medium text-plum-950 hover:bg-bone transition-colors duration-200 cursor-pointer"
          >
            Pitch us an idea
          </button>
          {LINKS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => goTo(l.id)}
              className="text-[12px] sm:text-[13px] text-bone/70 underline decoration-bone/25 underline-offset-4 hover:text-bone hover:decoration-rust transition-colors cursor-pointer"
            >
              {l.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => copy(EMAIL)}
          className="group mt-4 inline-flex items-center gap-2 text-[12px] text-bone/50 hover:text-bone transition-colors cursor-pointer"
          aria-label={`Copy email address ${EMAIL}`}
        >
          {EMAIL}
          <span className={`inline-flex items-center gap-1 ${copied ? 'text-glow' : 'group-hover:text-rust'}`}>
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? 'Copied' : 'Copy'}
          </span>
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? 'Email address copied' : ''}
        </span>
      </div>
    </div>
  )
}
