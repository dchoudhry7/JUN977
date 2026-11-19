import { useEffect, useRef } from 'react'
import HeroIntro from './Hero'

/* ------------------------------------------------------------------
   The footage: JUN977 turns its head from looking left (t = 0) to
   looking right (t = 1). The pointer's horizontal position steers it;
   on touch screens, dragging a finger across the page does the same.
   ------------------------------------------------------------------ */
const VIDEO = '/media/jun977.mp4'
const POSTER = '/media/jun977-poster.jpg'
const FPS = 24
const START = 0.4 // looking at the visitor, matches the poster
const EASE = 0.3 // share of the remaining distance per 60fps frame

/* Static hero (stills, no video): only for reduced motion or data saver */
const GATES = ['(prefers-reduced-motion: reduce)']
const saveData = () => Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)

/* Specs around the head, in the footage's 1920x1080 coordinates */
const STATS = [
  { x: 1378, y: 333, stat: '2026', label: 'year built' },
  { x: 1384, y: 499, stat: '64', label: 'LEDs in each eye' },
  { x: 1322, y: 654, stat: '<1 min', label: 'to read your pitch' },
]

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

const STILL_SRCSET = (side: 'left' | 'right') =>
  `/media/jun977-${side}-1200.webp 1200w, /media/jun977-${side}-2000.webp 2000w, /media/jun977-${side}-3200.webp 3200w`
const STILL_SIZES = '(min-width: 768px) min(1440px, 88vw), 210vw'

export default function Journey() {
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const stillLeft = useRef<HTMLImageElement>(null)
  const stillRight = useRef<HTMLImageElement>(null)
  const dustRef = useRef<HTMLCanvasElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const video = videoRef.current!
    const hero = heroRef.current!
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
      video.poster = POSTER // set here, inside the gated path, so static mode never fetches it
      video.classList.add('is-ready') // the poster shows while the footage downloads
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
      const onData = () => {
        if (ready) return
        ready = true
        shown = target
        seekToFrame(Math.round(shown * (frameCount() - 1)))
      }
      video.addEventListener('loadeddata', onData, { once: true })
      video.addEventListener('canplay', onData, { once: true })
      // iOS Safari will not decode a frame until the video has played once
      video.addEventListener(
        'loadedmetadata',
        () => {
          if (video.readyState < 2) video.play().then(() => video.pause()).catch(() => {})
        },
        { once: true },
      )
      video.load()
    }

    /* ---------- pointer: left edge looks left, right edge looks right ---------- */
    let mouseT = START
    const steer = (x: number) => {
      mouseT = clamp(x / window.innerWidth, 0, 1)
      target = mouseT
      kickSeek()
    }
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') steer(e.clientX)
    }
    // Touch: passive listeners, so the page still scrolls while the finger steers
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) steer(t.clientX)
    }

    /* ---------- static mode (phones, portrait tablets, reduced motion) ---------- */
    let scrubOn: boolean | null = null
    const applyMode = () => {
      const isStatic = saveData() || GATES.some((q) => window.matchMedia(q).matches)
      if (isStatic && scrubOn !== false) {
        scrubOn = false
        window.removeEventListener('pointermove', onPointer)
        window.removeEventListener('touchstart', onTouch)
        window.removeEventListener('touchmove', onTouch)
        if (seekRaf !== null) cancelAnimationFrame(seekRaf)
        seekRaf = null
        video.classList.remove('is-ready')
        hero.classList.add('is-static')
        showStill('left')
      } else if (!isStatic && scrubOn !== true) {
        scrubOn = true
        hero.classList.remove('is-static')
        if (video.style.display !== 'none') showStill(null)
        loadVideoOnce()
        if (ready) video.classList.add('is-ready')
        window.addEventListener('pointermove', onPointer, { passive: true })
        window.addEventListener('touchstart', onTouch, { passive: true })
        window.addEventListener('touchmove', onTouch, { passive: true })
      }
    }
    const mqls = GATES.map((q) => window.matchMedia(q))
    mqls.forEach((m) => m.addEventListener('change', applyMode))

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

    // The stage is only seen behind the hero.
    const seen = new Set<Element>()
    const stageIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)))
      dustVisible = seen.size > 0
      startDust()
    })
    stageIo.observe(hero)

    const onVis = () => {
      document.body.classList.toggle('paused', document.hidden)
      startDust()
    }
    document.addEventListener('visibilitychange', onVis)
    reduce.addEventListener('change', startDust)

    return () => {
      cancelled = true
      mqls.forEach((m) => m.removeEventListener('change', applyMode))
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('resize', sizeCanvas)
      document.removeEventListener('visibilitychange', onVis)
      reduce.removeEventListener('change', startDust)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('error', failVideo)
      stageIo.disconnect()
      ;[seekRaf, dustRaf].forEach((id) => id !== null && cancelAnimationFrame(id))
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [])

  return (
    <>
      {/* The stage: fixed footage, stills, embers. Decorative only. */}
      <div ref={stageRef} className="stage" aria-hidden="true">
        <img
          ref={stillLeft}
          className="stage-media stage-still"
          src="/media/jun977-left-2000.webp"
          srcSet={STILL_SRCSET('left')}
          sizes={STILL_SIZES}
          alt=""
          decoding="async"
        />
        <img
          ref={stillRight}
          className="stage-media stage-still"
          src="/media/jun977-right-2000.webp"
          srcSet={STILL_SRCSET('right')}
          sizes={STILL_SIZES}
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
        {/* HUD rings around the head, locked to the footage's own coordinates.
            Stats sit right of the head, clear of the antennae and the body. */}
        <svg className="stage-media stage-hud" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <circle className="ring" cx="990" cy="430" r="300" />
          <circle className="ring" cx="990" cy="430" r="400" />
          <circle className="ring ring--dash" cx="990" cy="430" r="560" />
          <path className="ring ring--hot" d="M 1361 280 A 400 400 0 0 1 1287 698" />
          {STATS.map((s, i) => (
            <g key={s.stat}>
              <circle className={i === 1 ? 'node node--hot' : 'node'} cx={s.x} cy={s.y} r="6" />
              <text className="stat" x={s.x + 22} y={s.y + 6}>
                {s.stat}
              </text>
              <text className="stat-label" x={s.x + 24} y={s.y + 38}>
                {s.label}
              </text>
            </g>
          ))}
        </svg>
        <div className="stage-veil" />
        <canvas ref={dustRef} className="stage-dust" />
      </div>

      {/* One screen: the question on the left, JUN977 following the pointer or finger */}
      <section ref={heroRef} id="top" className="hero" aria-label="Meet JUN977">
        <div className="hero-intro px-5 sm:px-8 md:px-10 pb-12 md:pb-0">
          <HeroIntro />
        </div>
      </section>
    </>
  )
}
