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

function NotebookArt() {
  const lines = Array.from({ length: 9 }, (_, i) => i)
  return (
    <svg viewBox="0 0 140 190" className="h-full w-auto" aria-hidden="true">
      <rect x="6" y="4" width="128" height="182" rx="6" fill="#1c141f" />
      <rect x="16" y="4" width="118" height="182" rx="4" fill="#efe6dc" />
      <g stroke="#d3c9ca" strokeWidth="1">
        {lines.map((i) => (
          <line key={`h${i}`} x1="16" x2="134" y1={24 + i * 18} y2={24 + i * 18} />
        ))}
        {lines.slice(0, 6).map((i) => (
          <line key={`v${i}`} y1="4" y2="186" x1={32 + i * 18} x2={32 + i * 18} />
        ))}
      </g>
      <rect x="112" y="4" width="7" height="182" fill="#2a1f2e" />
      <text x="28" y="172" fontSize="13" fill="#1c141f" fontFamily="var(--font-body)" fontWeight="700">
        JUNK®
      </text>
    </svg>
  )
}

function ToteArt() {
  return (
    <svg viewBox="0 0 160 200" className="h-full w-auto" aria-hidden="true">
      <path d="M52 70V46a28 28 0 0 1 56 0v24" fill="none" stroke="#2a1f2e" strokeWidth="7" />
      <path d="M22 68h116l-8 132H30z" fill="#efe6dc" />
      <path d="M22 68h116l-1 10H23z" fill="#d8cdc0" />
      <g clipPath="url(#tote-clip)">
        <path d="M40 176 70 146M58 182l36-36M78 186l38-38" stroke="#e2701f" strokeWidth="9" />
      </g>
      <defs>
        <clipPath id="tote-clip">
          <rect x="40" y="146" width="80" height="34" />
        </clipPath>
      </defs>
      <text x="80" y="128" fontSize="30" textAnchor="middle" fill="#1c141f" fontFamily="var(--font-heading)">
        JUNK
      </text>
    </svg>
  )
}

const ITEMS = [
  { name: 'JUN977 desk figure', detail: 'Painted resin, 14 cm, antennae bend', price: '€48', Art: FigureArt },
  { name: 'Grid notebook', detail: '120 pages, lay-flat binding', price: '€18', Art: NotebookArt },
  { name: 'Studio tote', detail: 'Heavy unbleached canvas', price: '€32', Art: ToteArt },
]

export default function Shop() {
  return (
    <section id="shop" aria-labelledby="shop-title" className="relative bg-rust text-plum-950 px-5 sm:px-8 md:px-10 py-24 sm:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <ScrambleText as="h2" id="shop-title" text="Shop" className="display block display--ink" style={{ fontSize: 'clamp(44px, 5.5vw, 104px)' }} />
          <p className="mt-5 max-w-[38ch] text-[15px] sm:text-[16px] leading-[1.7] text-plum-950/85">
            Things we made for ourselves and kept getting asked about. Small batches, posted from Rotterdam.
          </p>
        </div>
        <a
          href={`mailto:shop@junk.studio?subject=${encodeURIComponent('Order')}`}
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
