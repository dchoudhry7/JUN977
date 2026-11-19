import ScrambleText from './ScrambleText'

function FigureArt() {
  return (
    <svg viewBox="0 0 160 210" className="h-full w-auto" aria-hidden="true">
      {/* antennae */}
      <g stroke="#1c141f" strokeWidth="4" strokeLinecap="round">
        <path d="M48 52 40 14M72 46V8M104 46l12-34" />
      </g>
      <circle cx="40" cy="12" r="5" fill="#1c141f" />
      <circle cx="116" cy="10" r="5" fill="#1c141f" />
      {/* body */}
      <path d="M32 210c0-50 8-78 48-78s48 28 48 78z" fill="#f08a3c" stroke="#1c141f" strokeWidth="3" />
      <rect x="18" y="146" width="24" height="30" rx="10" fill="#b23a2c" stroke="#1c141f" strokeWidth="2.5" />
      <rect x="118" y="146" width="24" height="30" rx="10" fill="#b23a2c" stroke="#1c141f" strokeWidth="2.5" />
      <rect x="92" y="160" width="22" height="20" rx="2" fill="#f3ede4" />
      {/* neck spring */}
      <g fill="#1c141f">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x="66" y={112 + i * 6} width="28" height="4" rx="2" />
        ))}
      </g>
      {/* head */}
      <rect x="30" y="44" width="100" height="72" rx="8" fill="#8d8a92" stroke="#1c141f" strokeWidth="3" />
      <path d="M96 52h22l-4 9H92z" fill="#e8762a" />
      <circle cx="62" cy="78" r="13" fill="#1c141f" />
      <circle cx="98" cy="78" r="13" fill="#1c141f" />
      <circle cx="62" cy="78" r="10" fill="#ffc861" />
      <circle cx="98" cy="78" r="10" fill="#ffc861" />
      <path d="M74 98h12l-6 9z" fill="#b23a2c" stroke="#1c141f" strokeWidth="2.5" />
    </svg>
  )
}

function PhoneArt() {
  return (
    <svg viewBox="0 0 110 200" className="h-full w-auto" aria-hidden="true">
      <rect x="6" y="4" width="98" height="192" rx="16" fill="#1c141f" />
      <rect x="13" y="16" width="84" height="164" rx="8" fill="#3a2c40" />
      <rect x="40" y="9" width="30" height="4" rx="2" fill="#5d4b60" />
      {/* the robot's eyes on the lock screen */}
      <circle cx="40" cy="86" r="10" fill="#ffc861" />
      <circle cx="70" cy="86" r="10" fill="#ffc861" />
      <rect x="28" y="140" width="54" height="6" rx="3" fill="#8a7290" />
      <rect x="36" y="152" width="38" height="5" rx="2.5" fill="#5d4b60" />
    </svg>
  )
}

function LaptopArt() {
  return (
    <svg viewBox="0 0 220 150" className="h-full w-auto" aria-hidden="true">
      <rect x="30" y="6" width="160" height="110" rx="8" fill="#1c141f" />
      <rect x="38" y="14" width="144" height="94" rx="3" fill="#3a2c40" />
      <path d="M58 40h40M58 52h70M58 64h54M58 76h62" stroke="#8a7290" strokeWidth="5" strokeLinecap="round" />
      <path d="M150 34l14 8-14 8z" fill="#ffc861" />
      <path d="M6 120h208l-10 22H16z" fill="#8d8a92" stroke="#1c141f" strokeWidth="3" />
      <rect x="92" y="122" width="36" height="5" rx="2.5" fill="#1c141f" />
    </svg>
  )
}

/* Everything here came in through a pickup */
const ITEMS = [
  { name: 'Refurbished phone', detail: '128 GB, new battery, one-year warranty', price: '€149', Art: PhoneArt },
  { name: 'Refurbished laptop', detail: '14 inch, 16 GB, new battery, one-year warranty', price: '€329', Art: LaptopArt },
  { name: 'JUN977 desk figure', detail: 'Cast from recycled aluminium, 14 cm', price: '€48', Art: FigureArt },
]

export default function Shop() {
  return (
    <section id="shop" aria-labelledby="shop-title" className="relative bg-rust text-plum-950 px-5 sm:px-8 md:px-10 py-24 sm:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <ScrambleText as="h2" id="shop-title" text="Refurbished" className="display block display--ink" style={{ fontSize: 'clamp(38px, 4.6vw, 88px)' }} />
          <p className="mt-5 max-w-[38ch] text-[15px] sm:text-[16px] leading-[1.7] text-plum-950/85">
            Tested, cleaned and fitted with a new battery. Every one came in through a pickup, and each has a one-year warranty.
          </p>
        </div>
        <a
          href={`mailto:shop@junk.eco?subject=${encodeURIComponent('Order')}`}
          className="font-heading font-normal tracking-[-0.03em] text-[22px] text-plum-950 underline underline-offset-4 hover:text-bone transition-colors"
        >
          Order by email
        </a>
      </div>

      {/* A shelf: objects stand on one shared edge, prices stuck on like the robot's patch */}
      <ul className="mt-16 grid gap-y-14 sm:grid-cols-3 sm:gap-x-8">
        {ITEMS.map(({ name, detail, price, Art }) => (
          <li key={name} className="group">
            <div className="relative flex h-[200px] sm:h-[230px] items-end justify-center border-b-[3px] border-plum-950">
              <div className="h-[88%] origin-bottom transition-transform duration-500 ease-snap group-hover:-translate-y-2 group-hover:-rotate-3">
                <Art />
              </div>
              <span className="sticker absolute top-2 right-2 text-[19px]">{price}</span>
            </div>
            <h3 className="mt-4 font-heading font-normal tracking-[-0.03em] text-[22px] sm:text-[26px] leading-none text-plum-950">{name}</h3>
            <p className="mt-2 text-[14px] text-plum-950/75">{detail}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
