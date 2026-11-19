import { useState } from 'react'
import ScrambleText from './ScrambleText'

const ROLES = [
  {
    title: 'Senior Product Designer',
    where: 'Rotterdam',
    type: 'Full time',
    body: 'You have shipped apps people use every day and can explain every decision in them. You will lead product work for two clients at a time, with an engineer beside you from day one.',
  },
  {
    title: 'Creative Technologist',
    where: 'Lisbon, or remote in Europe',
    type: 'Full time',
    body: 'Half designer, half engineer, fully curious. You will build prototypes for clients and spend Fridays in Labs, including keeping JUN977 polite.',
  },
  {
    title: 'Studio Producer',
    where: 'Rotterdam',
    type: 'Four days a week',
    body: 'You keep nine projects on time without anyone feeling chased. Budgets, calendars, and the occasional difficult phone call.',
  },
]

export default function Openings() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="openings" aria-labelledby="openings-title" className="relative bg-bone text-plum-950 px-5 sm:px-8 md:px-10 py-24 sm:py-32" style={{ zIndex: 1 }}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-3 hazard" />
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div>
          <ScrambleText as="h2" id="openings-title" text="Openings" className="display block display--ink" style={{ fontSize: 'clamp(36px, 4vw, 76px)' }} />
          <p className="mt-6 max-w-[34ch] text-[15px] sm:text-[16px] leading-[1.7] text-plum-800">
            Three seats open for spring 2027. Four-day weeks after your first year, and nobody answers email after six.
          </p>
        </div>

        <ul className="border-t-2 border-plum-950">
          {ROLES.map((r, i) => {
            const isOpen = open === i
            return (
              <li key={r.title} className="border-b border-plum-950/15">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`role-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-baseline justify-between gap-6 py-6 text-left group cursor-pointer"
                  >
                    <span
                      className="font-heading font-normal tracking-[-0.03em] text-plum-950 group-hover:text-brick transition-colors"
                      style={{ fontSize: 'clamp(20px, 2vw, 32px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
                    >
                      {r.title}
                    </span>
                    <span className="flex items-baseline gap-5 shrink-0">
                      <span className="hidden sm:inline font-mono text-[12.5px] text-plum-800">{r.where}</span>
                      <span
                        aria-hidden="true"
                        className={`inline-grid place-items-center size-9 rounded-full border-2 border-plum-950 text-[22px] leading-none transition-[transform,background-color,color] duration-300 ease-out-soft ${
                          isOpen ? 'rotate-45 bg-plum-950 text-bone' : 'group-hover:bg-rust'
                        }`}
                      >
                        +
                      </span>
                    </span>
                  </button>
                </h3>
                <div
                  id={`role-${i}`}
                  className="grid transition-[grid-template-rows] duration-500 ease-out-soft"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  inert={!isOpen}
                >
                  <div className="overflow-hidden">
                    <div className="pb-8 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
                      <div>
                        <p className="font-mono text-[12.5px] text-plum-800">
                          {r.where}, {r.type.toLowerCase()}
                        </p>
                        <p className="mt-3 max-w-[52ch] text-[15px] sm:text-[16px] leading-[1.7] text-plum-950/85">{r.body}</p>
                      </div>
                      <a
                        href={`mailto:jobs@junk.studio?subject=${encodeURIComponent(r.title)}`}
                        className="justify-self-start inline-flex items-center rounded-[4px] bg-plum-950 text-bone px-5 py-2.5 text-[15px] font-semibold hover:bg-rust hover:text-plum-950 transition-colors duration-200"
                      >
                        Apply with your work
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
