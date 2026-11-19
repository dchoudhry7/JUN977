import { useRef, type CSSProperties } from 'react'
import { useScrollVar } from '../hooks/useScrollVar'
import ScrambleText from './ScrambleText'

const SPEC = [
  ['Unit', 'JUN977'],
  ['On duty since', 'June 2026'],
  ['Made from', '1 intercom, 2 bike lights, 1 mattress spring'],
  ['Eyes', '2 × 64 amber LEDs'],
  ['Reads', 'every pitch, in under a minute'],
  ['Weak spot', 'Monday mornings'],
]

const SIDE_PROJECTS = [
  { name: 'Kerning by Ear', status: 'Prototype', body: 'A type plugin that spaces letters to a rhythm you hum into the microphone. Mostly a joke. Partly not.' },
  { name: 'Quiet Hours', status: 'Shelved, for now', body: 'A desk lamp that dims as your calendar fills up, so the room tells you when to stop saying yes.' },
  { name: 'Spare Parts Library', status: 'Open to clients', body: 'Every rejected logo, typeface and layout from eleven years of projects, sorted and free to borrow.' },
]

export default function Labs() {
  const figRef = useRef<HTMLDivElement>(null)
  useScrollVar(figRef, '--lp', { start: 1, end: 0 })

  return (
    <section id="labs" aria-labelledby="labs-title" className="relative bg-plum-900 overflow-hidden">
      <div className="relative grid lg:grid-cols-[1fr_1.1fr] items-center">
        <div className="relative z-[1] px-5 sm:px-8 md:px-10 pt-24 sm:pt-32 lg:py-32">
          <ScrambleText as="h2" id="labs-title" text="Labs" className="display block" style={{ fontSize: 'clamp(44px, 5.5vw, 104px)' }} />
          <p className="mt-5 max-w-[40ch] text-[15px] sm:text-[16px] leading-[1.7] text-bone/75">
            One day a week, we build things nobody asked for. The best one now runs the front desk.
          </p>

          {/* The spec plate: riveted, stencilled, a little scratched */}
          <div className="relative mt-10 max-w-[30rem] rounded-[8px] border border-bone/15 bg-plum-950/70 p-5 sm:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((c) => (
              <span key={c} aria-hidden="true" className={`absolute ${c} size-1.5 rounded-full bg-bone/25`} />
            ))}
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-heading font-normal tracking-[-0.03em] text-[28px] leading-none text-rust">JUN977</h3>
              <span className="sticker text-[13px]">In daily use</span>
            </div>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-[12.5px] leading-snug">
              {SPEC.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-bone/50">{k}</dt>
                  <dd className="text-bone/90">{v}</dd>
                </div>
              ))}
            </dl>
            <a
              href="#pitch"
              className="mt-6 inline-flex items-center rounded-[4px] bg-rust text-plum-950 px-5 py-2.5 text-[15px] font-semibold hover:bg-glow transition-colors duration-200"
            >
              Talk to JUN977
            </a>
          </div>
        </div>

        {/* No frame: the photo melts into the page from a soft oval, like the hero's stage */}
        <div ref={figRef} className="labs-figure relative h-[70vh] min-h-[420px] lg:h-[100vh]">
          <img
            src="/media/jun977-left-2000.webp"
            srcSet="/media/jun977-left-1200.webp 1200w, /media/jun977-left-2000.webp 2000w, /media/jun977-left-3200.webp 3200w"
            sizes="(min-width: 1024px) 55vw, 100vw"
            alt="JUN977, an orange scrap-metal robot with a steel box head and glowing amber eyes, looking left"
            loading="lazy"
            className="absolute inset-x-0 -top-[6%] h-[112%] w-full object-cover object-[50%_25%]"
            style={{ transform: 'translate3d(0, calc((var(--lp, 0.5) - 0.5) * -8%), 0)' } as CSSProperties}
          />
        </div>
      </div>

      <div className="px-5 sm:px-8 md:px-10 pb-24 sm:pb-32 pt-6">
        <ul className="grid gap-x-10 md:grid-cols-3 border-t-2 border-rust">
          {SIDE_PROJECTS.map((p) => (
            <li key={p.name} className="group py-7 border-b border-bone/12 md:border-b-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-heading font-normal tracking-[-0.03em] text-[24px] sm:text-[28px] leading-none text-bone group-hover:text-rust transition-colors">
                  {p.name}
                </h3>
                <span className="font-mono text-[12px] text-bone/55">{p.status}</span>
              </div>
              <p className="mt-3 max-w-[40ch] text-[16px] leading-[1.7] text-bone/70">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
