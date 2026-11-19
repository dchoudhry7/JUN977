import { useState } from 'react'
import ScrambleText from './ScrambleText'

/* The questions we hear at every door */
const FAQ = [
  {
    q: 'What does it cost?',
    a: 'Home pickups of phones, laptops, cables and other small electronics are free. TVs and monitors over 32 inches are ₹299, because two people carry them. Businesses get a quote within a day.',
  },
  {
    q: 'Is my data safe?',
    a: 'Every phone and drive is wiped to a certified standard before anything else happens, and you get a certificate by email. If you would rather, we shred the drive and send you a photo of the pieces.',
  },
  {
    q: 'Where do you pick up?',
    a: 'Wherever you are. JUN977 asks for your city and PIN code when you book, and we confirm a slot within a day. In smaller towns we group pickups, so a slot can be up to a week out.',
  },
  {
    q: 'Do you take broken things?',
    a: 'Yes, broken is most of what we take. Cracked, dead, water damaged or missing parts: if it has a plug or a battery, we take it.',
  },
  {
    q: 'Can my business use JUNK?',
    a: 'Yes. Offices, schools and shops book a one-off clear-out or a monthly pickup, with a report of where every kilo went.',
  },
]

export default function Openings() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative bg-bone text-plum-950 px-5 sm:px-8 md:px-10 py-24 sm:py-32" style={{ zIndex: 1 }}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-3 hazard" />
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div>
          <ScrambleText as="h2" id="faq-title" text="Questions" className="display block display--ink" style={{ fontSize: 'clamp(36px, 4vw, 76px)' }} />
          <p className="mt-6 max-w-[34ch] text-[15px] sm:text-[16px] leading-[1.7] text-plum-800">
            The ones we hear at every door. Anything else, ask JUN977 or email us.
          </p>
        </div>

        <ul className="border-t-2 border-plum-950">
          {FAQ.map((f, i) => {
            const isOpen = open === i
            return (
              <li key={f.q} className="border-b border-plum-950/15">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-baseline justify-between gap-6 py-6 text-left group cursor-pointer"
                  >
                    <span
                      className="font-heading font-normal tracking-[-0.03em] text-plum-950 group-hover:text-brick transition-colors"
                      style={{ fontSize: 'clamp(20px, 2vw, 32px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
                    >
                      {f.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`shrink-0 inline-grid place-items-center size-9 rounded-full border-2 border-plum-950 text-[22px] leading-none transition-[transform,background-color,color] duration-300 ease-out-soft ${
                        isOpen ? 'rotate-45 bg-plum-950 text-bone' : 'group-hover:bg-rust'
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-${i}`}
                  className="grid transition-[grid-template-rows] duration-500 ease-out-soft"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  inert={!isOpen}
                >
                  <div className="overflow-hidden">
                    <p className="pb-8 max-w-[56ch] text-[15px] sm:text-[16px] leading-[1.7] text-plum-950/85">{f.a}</p>
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
