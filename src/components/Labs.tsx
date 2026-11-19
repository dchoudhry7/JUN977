import Pitch from './Pitch'
import ScrambleText from './ScrambleText'

const SPEC = [
  ['Unit', 'JUN977'],
  ['On duty since', 'June 2026'],
  ['Made from', '1 intercom, 2 bike lights, 1 router, 1 mattress spring'],
  ['Eyes', '2 × 64 amber LEDs from a broken TV'],
  ['Books', 'a pickup in under a minute'],
  ['Weak spot', 'Fax machines'],
]

/* Where everything we pick up ends up */
const SIDE_PROJECTS = [
  { name: 'Refurbished', status: 'Working devices', body: 'Phones and laptops that pass our tests get a new battery, a clean screen and a one-year warranty, then go on sale below.' },
  { name: 'Repair cafés', status: 'Spare parts', body: 'Screens, keyboards, fans and chargers go to local repair cafés for free, so other people can fix their own.' },
  { name: 'Recycled', status: 'Everything else', body: 'Metals, glass and plastics go to certified recyclers. We publish where every kilo ends up, every month.' },
]

export default function Labs() {
  return (
    <section id="book" aria-labelledby="book-title" className="relative bg-plum-900 overflow-hidden">
      {/* JUN977 on the left, the booking console on the right: one screen, plain plum */}
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-12 items-start px-5 sm:px-8 md:px-10 pt-24 sm:pt-32 pb-16">
        <div>
          <ScrambleText as="h2" id="book-title" text="Meet JUN977" className="display block" style={{ fontSize: 'clamp(32px, 3.4vw, 64px)' }} />
          <p className="mt-5 max-w-[40ch] text-[15px] sm:text-[16px] leading-[1.7] text-bone/75">
            Our robot is built entirely from things people gave us. Now it books every pickup: tell it what you have,
            and it tells you what happens next.
          </p>

          {/* The spec plate: riveted, stencilled, a little scratched */}
          <div className="relative mt-10 max-w-[30rem] rounded-[8px] border border-bone/15 bg-plum-950/70 p-5 sm:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((c) => (
              <span key={c} aria-hidden="true" className={`absolute ${c} size-1.5 rounded-full bg-bone/25`} />
            ))}
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-heading font-normal tracking-[-0.03em] text-[28px] leading-none text-rust">JUN977</h3>
              <span className="sticker text-[13px]">100% salvaged</span>
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

        <div className="flex lg:justify-end">
          <Pitch />
        </div>
      </div>

      <div className="px-5 sm:px-8 md:px-10 pb-24 sm:pb-32 pt-8">
        <h3 className="font-mono text-[13px] text-bone/60 mb-4">Where it all goes</h3>
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
