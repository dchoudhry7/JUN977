import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/* In the order the sections appear on the page */
export const NAV_LINKS = [
  { label: 'Studio', href: '#studio' },
  { label: 'Labs', href: '#labs' },
  { label: 'Openings', href: '#openings' },
  { label: 'Shop', href: '#shop' },
]

export function Logo() {
  return (
    <a href="#top" className="group flex items-center gap-2.5" aria-label="JUNK, back to top">
      <span className="display text-[22px] sm:text-[24px] leading-none">
        JUNK
        <sup className="ml-0.5 align-super text-[10px] font-medium tracking-normal" style={{ fontFamily: 'var(--font-body)' }}>
          ®
        </sup>
      </span>
      <span
        aria-hidden="true"
        className="spin-slow inline-block text-[22px] sm:text-[26px] text-rust select-none leading-none group-hover:text-glow transition-colors"
      >
        ✳︎
      </span>
    </a>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState(-1)
  const [pill, setPill] = useState({ left: 0, width: 0 })
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [hover, setHover] = useState(-1)

  useEffect(() => {
    // Stay clear over the journey; take a backing once the page proper begins.
    const onScroll = () => {
      const hero = document.getElementById('top')
      const end = hero ? hero.offsetTop + hero.offsetHeight - 90 : window.innerHeight - 90
      setScrolled(window.scrollY > end)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Which section is on screen: the one crossing the middle of the viewport.
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1))
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const i = ids.indexOf(e.target.id)
          if (e.isIntersecting) setActive(i)
          else setActive((cur) => (cur === i ? -1 : cur))
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // The orange plate slides to whichever link is hovered, else the active one.
  const target = hover >= 0 ? hover : active
  useLayoutEffect(() => {
    const el = target >= 0 ? linkRefs.current[target] : null
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth })
  }, [target])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <nav
        aria-label="Main"
        className={`fixed top-0 left-0 w-full z-10 px-5 sm:px-8 py-4 sm:py-5 flex justify-between md:grid md:grid-cols-[1fr_auto_1fr] items-center transition-[background-color,backdrop-filter] duration-500 ${
          scrolled && !open ? 'bg-plum-950/70 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="justify-self-start">
          <Logo />
        </div>

        {/* Centre: a single plate of links, with an orange slider marking where you are */}
        <div
          className="hidden md:flex relative items-center rounded-[6px] border border-bone/12 bg-plum-950/55 backdrop-blur-md p-1"
          onMouseLeave={() => setHover(-1)}
        >
          <span
            aria-hidden="true"
            className="absolute top-1 bottom-1 rounded-[4px] bg-rust transition-[left,width,opacity] duration-300 ease-out-soft"
            style={{ left: pill.left, width: pill.width, opacity: target >= 0 ? 1 : 0 }}
          />
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              ref={(el) => {
                linkRefs.current[i] = el
              }}
              href={link.href}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(-1)}
              aria-current={active === i ? 'location' : undefined}
              className={`relative rounded-[4px] px-4 lg:px-5 py-2 text-[13px] lg:text-[14px] font-medium transition-colors duration-200 ${
                target === i ? 'text-plum-950' : 'text-bone/80 hover:text-bone'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="justify-self-end flex items-center">
          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-2 rounded-[4px] border border-rust px-4 py-2.5 text-[13px] lg:text-[14px] font-semibold text-bone hover:bg-rust hover:text-plum-950 transition-colors duration-200"
          >
            <span aria-hidden="true" className="size-1.5 rounded-full bg-glow shadow-[0_0_8px_rgba(255,200,97,0.9)]" />
            Get in touch
          </a>

          <button
            type="button"
            className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`block w-6 h-[2px] bg-bone transition-all duration-300 ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-6 h-[2px] bg-bone transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-[2px] bg-bone transition-all duration-300 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className="md:hidden fixed inset-0 bg-plum-950/95 backdrop-blur-sm flex flex-col justify-center items-start px-8 gap-7 transition-opacity duration-300"
        style={{ zIndex: 9, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
        aria-hidden={!open}
        inert={!open}
      >
        {NAV_LINKS.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setOpen(false)}
            className={`display text-[40px] leading-none ${active === i ? 'display--orange' : ''}`}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={() => setOpen(false)}
          className="mt-4 inline-flex items-center rounded-[4px] bg-rust px-5 py-3 text-[15px] font-semibold text-plum-950"
        >
          Get in touch
        </a>
      </div>
    </>
  )
}
