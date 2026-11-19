import { useEffect, useRef, type CSSProperties } from 'react'
import HeroIntro from './Hero'
import ScrambleText from './ScrambleText'

/* ------------------------------------------------------------------
   The footage: JUN977 turns its head from looking left (t = 0) to
   looking right (t = 1). The pointer steers it. During the journey,
   scroll takes over and the robot turns to read each caption.
   ------------------------------------------------------------------ */
const VIDEO = '/media/jun977.mp4'
const POSTER = '/media/jun977-poster.jpg'
const FPS = 24
const START = 0.4 // looking at the visitor, matches the poster
const EASE = 0.3 // share of the remaining distance per 60fps frame

/* The five static-hero gates. Must match the CSS intent exactly (10k rule). */
const GATES = [
  '(max-width: 720px)',
  '(orientation: portrait) and (max-width: 1024px)',
  '(orientation: portrait) and (pointer: coarse)',
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
  '(prefers-reduced-motion: reduce)',
]

type Band = { a: number; b: number; look: number | null; still: 'left' | 'right' }
/* Bands in hero progress (0..1). The hero is 520vh tall, so 420vh of scroll:
   each band holds roughly 90vh, with short eased ramps at its edges. */
const BANDS: Band[] = [
  { a: 0, b: 0.2, look: null, still: 'left' },
  { a: 0.24, b: 0.46, look: 0.93, still: 'right' },
  { a: 0.5, b: 0.72, look: 0.05, still: 'left' },
  { a: 0.76, b: 1, look: 0.42, still: 'right' },
]

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const smoothstep = (p: number, e0: number, e1: number) => {
  const t = clamp((p - e0) / (e1 - e0), 0, 1)
  return t * t * (3 - 2 * t)
}

const STILL_SRCSET = (side: 'left' | 'right') =>
  `/media/jun977-${side}-1200.webp 1200w, /media/jun977-${side}-2000.webp 2000w, /media/jun977-${side}-3200.webp 3200w`

export default function Journey() {
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const stillLeft = useRef<HTMLImageElement>(null)
  const stillRight = useRef<HTMLImageElement>(null)
  const dustRef = useRef<HTMLCanvasElement>(null)
  const journeyRef = useRef<HTMLElement>(null)
  const bandRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const stage = stageRef.current!
    const video = videoRef.current!
    const journey = journeyRef.current!
    const bands = bandRefs.current.filter(Boolean) as HTMLDivElement[]
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')

    /* ---------- still images (static mode, and the no-video fallback) ---------- */
    let stillSide: 'left' | 'right' | null = null
    const showStill = (side: 'left' | 'right' | null) => {
      if (side === stillSide) return
      stillSide = side
      stillLeft.current?.classList.toggle('is-on', side === 'left')
      stillRight.current?.classList.toggle('is-on', side === 'right')
    }

    /* ---------- video scrubber: eased, gated, frame-quantised ---------- */
    let ready = false
    let target = START
    let shown = START
    let lastFrame = -1
    let seeking = false
    let pendingFrame: number | null = null
    let seekRaf: number | null = null
    let lastTick = 0
    const frameCount = () => Math.max(1, Math.round(video.duration * FPS))

    const seekToFrame = (frame: number) => {
      if (seeking) {
        pendingFrame = frame
        return
      }
      seeking = true
      lastFrame = frame
      video.currentTime = Math.min(video.duration - 0.001, (frame + 0.5) / FPS)
    }
    const onSeeked = () => {
      seeking = false
      if (pendingFrame !== null && pendingFrame !== lastFrame) {
        const f = pendingFrame
        pendingFrame = null
        seekToFrame(f)
      } else pendingFrame = null
    }
    const tick = (now: number) => {
      const dt = Math.min(64, now - (lastTick || now))
      lastTick = now
      shown += (target - shown) * (1 - Math.pow(1 - EASE, dt / 16.667))
      if (Math.abs(target - shown) < 0.0008) shown = target
      const frame = Math.round(shown * (frameCount() - 1))
      if (frame !== lastFrame && frame !== pendingFrame) seekToFrame(frame)
      if (shown !== target) seekRaf = requestAnimationFrame(tick)
      else {
        seekRaf = null
        lastTick = 0
      }
    }
    const kickSeek = () => {
      if (ready && seekRaf === null) seekRaf = requestAnimationFrame(tick)
    }

    let objectUrl: string | null = null
    let loadStarted = false
    let cancelled = false
    const failVideo = () => {
      seeking = false
      pendingFrame = null
      video.style.display = 'none'
      showStill('left')
    }
    const loadVideoOnce = async () => {
      if (loadStarted) return
      loadStarted = true
      video.poster = POSTER // set here, inside the gated path, so phones never fetch it
      try {
        const res = await fetch(VIDEO)
        if (!res.ok) throw new Error(String(res.status))
        const blob = await res.blob()
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        video.src = objectUrl
      } catch {
        video.src = VIDEO
      }
      video.addEventListener(
        'loadeddata',
        () => {
          ready = true
          shown = target
          seekToFrame(Math.round(shown * (frameCount() - 1)))
          video.classList.add('is-ready')
        },
        { once: true },
      )
    }

    /* ---------- journey: bands, shift, look direction ---------- */
    const cache = bands.map(() => ({ op: -1, k: -1, on: false }))
    let shiftCache = -1
    let mouseT = START
    let lastLook = START
    let loadK = 0 // band 1 assembles on load, then hands over to scroll

    const heroProgress = () => {
      const r = journey.getBoundingClientRect()
      const range = r.height - window.innerHeight
      return range > 0 ? clamp(-r.top / range, 0, 1) : 0
    }

    const writeBands = (p: number) => {
      BANDS.forEach((band, i) => {
        const el = bands[i]
        if (!el) return
        const { a, b } = band
        const f = Math.min(0.02, (b - a) / 3)
        const first = i === 0
        const last = i === BANDS.length - 1
        const op = (first ? 1 : smoothstep(p, a, a + f)) * (last ? 1 : 1 - smoothstep(p, b - f, b))
        const ramp = Math.min(0.06, (b - a) * 0.4)
        let k = clamp((p - a) / ramp, 0, 1)
        if (first) k = Math.max(k, loadK)
        const c = cache[i]
        if (Math.abs(op - c.op) > 0.003) {
          c.op = op
          el.style.opacity = op.toFixed(3)
          el.style.visibility = op < 0.002 ? 'hidden' : 'visible'
          // The HUD belongs to the opening frame; it leaves with band 1.
          if (first) stage.style.setProperty('--hud', op.toFixed(3))
          // Each time a band comes on screen, its heading decodes again.
          if (op > 0.5 && !c.on) {
            c.on = true
            el.dispatchEvent(new Event('decode'))
          } else if (op < 0.05 && c.on) c.on = false
        }
        if (Math.abs(k - c.k) > 0.008 || (k === 1 && c.k !== 1)) {
          c.k = k
          el.style.setProperty('--k', k.toFixed(3))
        }
      })
    }

    const writeShift = (p: number) => {
      const s = smoothstep(p, 0.12, 0.26)
      if (Math.abs(s - shiftCache) > 0.002 || (s === 1 && shiftCache !== 1)) {
        shiftCache = s
        stage.style.setProperty('--shift', s.toFixed(4))
      }
    }

    const computeTarget = (p: number) => {
      const r = journey.getBoundingClientRect()
      const past = r.bottom < window.innerHeight * 0.6
      const w = past ? 0 : smoothstep(p, 0.12, 0.26)
      let sum = 0
      let acc = 0
      BANDS.forEach((band, i) => {
        if (band.look === null) return
        const op = Math.max(0, cache[i].op)
        sum += op
        acc += op * band.look
      })
      if (sum > 0.02) lastLook = acc / sum
      const steered = clamp(lastLook + (mouseT - 0.5) * 0.24, 0, 1)
      return mouseT + (steered - mouseT) * w
    }

    let frameRaf: number | null = null
    const frame = () => {
      frameRaf = null
      const p = heroProgress()
      writeBands(p)
      writeShift(p)
      target = computeTarget(p)
      kickSeek()
    }
    const schedule = () => {
      if (frameRaf === null) frameRaf = requestAnimationFrame(frame)
    }

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return
      mouseT = clamp(e.clientX / window.innerWidth, 0, 1)
      schedule()
    }

    /* Band 1 assembles over ~0.9s after load, then scroll owns it. */
    let loadRaf: number | null = null
    const loadStart = performance.now()
    const loadRamp = (now: number) => {
      loadK = smoothstep(now - loadStart, 150, 1050)
      schedule()
      loadRaf = loadK < 1 ? requestAnimationFrame(loadRamp) : null
    }

    /* ---------- static mode: bands in flow, stills swap as each band shows ---------- */
    let io: IntersectionObserver | null = null
    const enableStatic = () => {
      journey.classList.add('is-static')
      stage.style.setProperty('--shift', '0')
      bands.forEach((el) => {
        el.style.opacity = ''
        el.style.visibility = ''
        el.style.removeProperty('--k')
      })
      cache.forEach((c) => {
        c.op = -1
        c.k = -1
      })
      showStill('left')
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              const i = bands.indexOf(en.target as HTMLDivElement)
              if (i >= 0) showStill(BANDS[i].still)
            }
          })
        },
        { threshold: 0.55 },
      )
      bands.forEach((el) => io!.observe(el))
    }
    const disableStatic = () => {
      journey.classList.remove('is-static')
      io?.disconnect()
      io = null
      if (video.style.display !== 'none') showStill(null)
    }

    let scrubOn: boolean | null = null
    const applyMode = () => {
      const isStatic = GATES.some((q) => window.matchMedia(q).matches)
      if (isStatic && scrubOn !== false) {
        scrubOn = false
        window.removeEventListener('scroll', schedule)
        window.removeEventListener('pointermove', onPointer)
        if (seekRaf !== null) cancelAnimationFrame(seekRaf)
        seekRaf = null
        video.classList.remove('is-ready')
        enableStatic()
      } else if (!isStatic && scrubOn !== true) {
        scrubOn = true
        disableStatic()
        loadVideoOnce()
        if (ready) video.classList.add('is-ready')
        window.addEventListener('scroll', schedule, { passive: true })
        window.addEventListener('pointermove', onPointer, { passive: true })
        if (loadRaf === null && loadK < 1) loadRaf = requestAnimationFrame(loadRamp)
        schedule()
      }
    }
    const mqls = GATES.map((q) => window.matchMedia(q))
    mqls.forEach((m) => m.addEventListener('change', applyMode))
    window.addEventListener('resize', schedule)

    video.addEventListener('seeked', onSeeked)
    video.addEventListener('error', failVideo)
    applyMode()

    /* ---------- embers: whisper-level dust in the footage's light ---------- */
    const canvas = dustRef.current!
    const ctx = canvas.getContext('2d')!
    let dustRaf: number | null = null
    let dustVisible = true
    type Mote = { x: number; y: number; r: number; vx: number; vy: number; a: number; ph: number; hot: boolean }
    let motes: Mote[] = []
    const sizeCanvas = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.round(Math.min(90, (window.innerWidth * window.innerHeight) / 22000))
      motes = Array.from({ length: n }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 0.6 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.08 - Math.random() * 0.25,
        a: 0.15 + Math.random() * 0.5,
        ph: Math.random() * Math.PI * 2,
        hot: Math.random() < 0.22,
      }))
    }
    let lastDust = 0
    const dust = (now: number) => {
      const dt = Math.min(50, now - (lastDust || now)) / 16.667
      lastDust = now
      const W = window.innerWidth
      const H = window.innerHeight
      ctx.clearRect(0, 0, W, H)
      const drift = (mouseT - 0.5) * 0.35
      for (const m of motes) {
        m.x += (m.vx + drift * m.r * 0.3) * dt
        m.y += m.vy * dt
        m.ph += 0.02 * dt
        if (m.y < -10) {
          m.y = H + 10
          m.x = Math.random() * W
        }
        if (m.x < -10) m.x = W + 10
        if (m.x > W + 10) m.x = -10
        const flick = 0.6 + 0.4 * Math.sin(m.ph)
        ctx.globalAlpha = m.a * flick
        ctx.fillStyle = m.hot ? '#ffc861' : '#efe6dc'
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      dustRaf = dustVisible && !document.hidden && !reduce.matches ? requestAnimationFrame(dust) : null
      if (dustRaf === null) lastDust = 0
    }
    const startDust = () => {
      if (dustRaf === null && dustVisible && !document.hidden && !reduce.matches) dustRaf = requestAnimationFrame(dust)
    }
    sizeCanvas()
    window.addEventListener('resize', sizeCanvas)

    // The stage is only seen during the journey and behind the pitch section.
    const seen = new Set<Element>()
    const stageIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)))
      dustVisible = seen.size > 0
      startDust()
    })
    stageIo.observe(journey)
    const pitch = document.getElementById('pitch')
    if (pitch) stageIo.observe(pitch)

    const onVis = () => {
      document.body.classList.toggle('paused', document.hidden)
      startDust()
    }
    document.addEventListener('visibilitychange', onVis)
    reduce.addEventListener('change', startDust)

    return () => {
      cancelled = true
      mqls.forEach((m) => m.removeEventListener('change', applyMode))
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('resize', sizeCanvas)
      document.removeEventListener('visibilitychange', onVis)
      reduce.removeEventListener('change', startDust)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('error', failVideo)
      io?.disconnect()
      stageIo.disconnect()
      ;[seekRaf, frameRaf, loadRaf, dustRaf].forEach((id) => id !== null && cancelAnimationFrame(id))
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [])

  const bandRef = (i: number) => (el: HTMLDivElement | null) => {
    bandRefs.current[i] = el
  }

  const pad = 'px-5 sm:px-8 md:px-10'
  const side: CSSProperties = { width: 'min(25vw, 26rem)', top: '50%', translate: '0 -50%' }

  return (
    <>
      {/* The stage: fixed footage, stills, embers. Decorative only. */}
      <div ref={stageRef} className="stage" aria-hidden="true">
        <img
          ref={stillLeft}
          className="stage-media stage-still"
          src="/media/jun977-left-2000.webp"
          srcSet={STILL_SRCSET('left')}
          sizes="(min-width: 768px) min(1920px, 104vw), 210vw"
          alt=""
          decoding="async"
        />
        <img
          ref={stillRight}
          className="stage-media stage-still"
          src="/media/jun977-right-2000.webp"
          srcSet={STILL_SRCSET('right')}
          sizes="(min-width: 768px) min(1920px, 104vw), 210vw"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <video
          ref={videoRef}
          className="stage-media stage-video"
          muted
          playsInline
          preload="none"
          tabIndex={-1}
          disablePictureInPicture
        />
        {/* HUD rings around the head, in the footage's own 1920x1080 coordinates.
            Stats sit right of the head, clear of the antennae and the body. */}
        <svg className="stage-media stage-hud" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <circle className="ring" cx="990" cy="430" r="300" />
          <circle className="ring" cx="990" cy="430" r="400" />
          <circle className="ring ring--dash" cx="990" cy="430" r="560" />
          <path className="ring ring--hot" d="M 1361 280 A 400 400 0 0 1 1287 698" />
          {[
            { x: 1378, y: 333, stat: '2019', label: 'on duty since' },
            { x: 1384, y: 499, stat: '64', label: 'amber LEDs per eye' },
            { x: 1322, y: 654, stat: '<1 min', label: 'to read your pitch' },
          ].map((s, i) => (
            <g key={s.stat}>
              <circle className={i === 1 ? 'node node--hot' : 'node'} cx={s.x} cy={s.y} r="4.5" />
              <text className="stat" x={s.x + 18} y={s.y + 4}>
                {s.stat}
              </text>
              <text className="stat-label" x={s.x + 18} y={s.y + 26}>
                {s.label}
              </text>
            </g>
          ))}
        </svg>
        <div className="stage-veil" />
        <canvas ref={dustRef} className="stage-dust" />
      </div>

      <section ref={journeyRef} id="top" className="journey" aria-label="Meet JUN977">
        <div className="journey-pin">
          {/* Band 1: the greeting. Left side, the robot follows your mouse. */}
          <div
            ref={bandRef(0)}
            className={`band band-1 ${pad} flex flex-col justify-end pb-12 md:pb-[9vh]`}
            style={{ inset: 0 }}
          >
            <HeroIntro />
          </div>

          {/* Band 2: right of the robot; it turns to read this. */}
          <div ref={bandRef(1)} className="band band-2" style={{ ...side, right: '3vw' }}>
            <ScrambleText as="h2" text="Meet JUN977" className="display block" style={{ fontSize: 'clamp(30px, 3.2vw, 60px)' }} />
            <p className="mt-6 text-[15px] md:text-[16px] leading-[1.65] text-bone/85 max-w-[38ch]">
              Our front desk. Built in 2019 from a broken intercom, two bike lights and eleven years of briefs. It reads
              every pitch before we do.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 text-[12px] text-bone/60">
              <span className="size-1.5 rounded-full bg-glow" style={{ animation: 'ember 2.4s ease-in-out infinite', animationDelay: '-1s' }} />
              On duty, eyes at 40 lux
            </p>
          </div>

          {/* Band 3: left of the robot; it turns back. */}
          <div ref={bandRef(2)} className="band band-3" style={{ ...side, left: '3vw' }}>
            <ScrambleText as="h2" text="Built from parts. Runs on taste." className="display block" style={{ fontSize: 'clamp(24px, 2.4vw, 46px)' }} />
            <p className="mt-6 text-[15px] md:text-[16px] leading-[1.65] text-bone/85 max-w-[38ch]">
              Every project starts in the scrapyard: the old name, the half-built app, the idea you shelved. We keep what
              works and weld the rest.
            </p>
          </div>

          {/* Band 4: the settle. The robot looks back at you. */}
          <div ref={bandRef(3)} className="band band-4 text-center" style={{ left: 0, right: 0, bottom: '7vh' }}>
            <ScrambleText as="h2" text="Good things, made from junk." className="display block px-5" style={{ fontSize: 'clamp(24px, 2.8vw, 54px)' }} />
            <p className="mt-4 text-[14px] md:text-[15px] text-bone/80">
              A studio for brands, products and the odd machine. Rotterdam and Lisbon.
            </p>
            <a href="#about" className="mt-6 inline-flex flex-col items-center gap-1 text-[12px] text-bone/60 hover:text-rust transition-colors">
              Keep scrolling
              <svg width="14" height="20" viewBox="0 0 14 20" fill="none" aria-hidden="true" style={{ animation: 'ember 1.8s ease-in-out infinite' }}>
                <path d="M7 1v17M1 12l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
