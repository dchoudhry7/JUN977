import { useEffect, useState } from 'react'
import ScrambleText from './ScrambleText'

export const EMAIL = 'hello@junk.studio'

const QUESTION = 'Now, what are we building?'

/**
 * The opening frame belongs to JUN977, so the words stay few:
 * one question and one way in. Everything else lives further down.
 */
export default function HeroIntro() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 350)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <div className="max-w-[30rem]">
      <h1 className="sr-only">JUNK, a creative studio. {QUESTION}</h1>

      <ScrambleText
        text={QUESTION}
        start={ready}
        duration={1200}
        className="display block"
        style={{ fontSize: 'clamp(26px, 2.6vw, 44px)', fontWeight: 400 }}
      />

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
        Pitch us an idea
      </button>
    </div>
  )
}
