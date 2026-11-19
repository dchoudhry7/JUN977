import Pitch from './Pitch'
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
  return (
    <section id="labs" aria-labelledby="labs-title" className="relative bg-plum-900 overflow-hidden">
      {/* Labs on the left, the pitch console on the right: one screen, plain plum */}
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-12 items-start px-5 sm:px-8 md:px-10 pt-24 sm:pt-32 pb-16">
        <div>
          <ScrambleText as="h2" id="labs-title" text="Labs" className="display block" style={{ fontSize: 'clamp(44px, 5.5vw, 104px)' }} />
          <p className="mt-5 max-w-[40ch] text-[15px] sm:text-[16px] leading-[1.7] text-bone/75">
            One day a week, we build things nobody asked for. The best one now runs the front desk, and it is ready for
            your idea.
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
          </div>
        </div>

        <div className="lg:pt-6 flex lg:justify-end">
          <Pitch />
        </div>
      </div>

      <div className="px-5 sm:px-8 md:px-10 pb-24 sm:pb-32 pt-8">
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
