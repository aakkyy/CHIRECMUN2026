import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './Hero.module.css'
import logoImg from '../assets/logo.png'
import BlobButton from './BlobButton'

const CHIREC_LETTERS = [
  { char: 'C', color: '#e74c3c', glow: 'rgba(231,76,60,0.95)' },
  { char: 'H', color: '#22c55e', glow: 'rgba(34,197,94,0.95)'  },
  { char: 'I', color: '#1d4ed8', glow: 'rgba(29,78,216,0.95)'  },
  { char: 'R', color: '#e74c3c', glow: 'rgba(231,76,60,0.95)'  },
  { char: 'E', color: '#22c55e', glow: 'rgba(34,197,94,0.95)'  },
  { char: 'C', color: '#1e3a8a', glow: 'rgba(30,58,138,0.95)'  },
]

// 36 diplomatic terms across 3 rings
const RING_1_TERMS = ['Veto', 'Détente', 'Bloc', 'Quorum', 'Crisis']
const RING_2_TERMS = [
  'Resolution', 'Consensus', 'Caucus', 'Amendment',
  'Protocol', 'Communiqué', 'Agenda', 'Motion',
  'Sovereignty', 'Rapporteur', 'Delegate', 'Chair',
]
const RING_3_TERMS = [
  'Position Paper', 'Working Paper', 'Yield the Floor', 'Point of Order',
  'Draft Resolution', 'Speakers List', 'Operative Clause', 'Perambulatory',
  'Dais', 'Secretariat', 'Placard', 'Unmoderated',
  'Moderated Caucus', 'General Assembly', 'Security Council',
  'Abstention', 'Right of Reply', 'Diplomatic Immunity',
]

interface OrbitRingProps {
  terms: string[]
  radius: number
  duration: number
  reverse?: boolean
  dim?: number   // 0–1, opacity of terms
}

function OrbitRing({ terms, radius, duration, reverse = false, dim = 0.22 }: OrbitRingProps) {
  const count = terms.length
  return (
    <>
      {terms.map((term, i) => {
        const angle = (i / count) * 360
        // Negative delay so it starts already in motion at the correct position
        const delay = -(angle / 360) * duration
        const armAnim  = `orbitCW ${duration}s linear ${delay}s infinite ${reverse ? 'reverse' : 'normal'}`
        const termAnim = `orbitCCW ${duration}s linear ${delay}s infinite ${reverse ? 'reverse' : 'normal'}`

        return (
          <div
            key={term + i}
            className={styles.orbitArm}
            style={{ animation: armAnim }}
          >
            <span
              className={styles.orbitTerm}
              style={{
                left: `${radius}px`,
                opacity: dim,
                animation: termAnim,
              }}
            >
              {term}
            </span>
          </div>
        )
      })}
    </>
  )
}

export default function Hero() {
  const chirecRef  = useRef<HTMLDivElement>(null)
  const orbitRef   = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const rafRef     = useRef<number>(0)
  const mouseTarget  = useRef({ x: 0, y: 0 })
  const mouseLerped  = useRef({ x: 0, y: 0 })
  const [clicked, setClicked] = useState<Record<number, boolean>>({})

  const toggleLetter = (i: number) => setClicked(p => ({ ...p, [i]: !p[i] }))

  // Outside click resets letter colors
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (chirecRef.current && !chirecRef.current.contains(e.target as Node)) {
        setClicked({})
      }
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // Gravity well mouse effect — smooth lerp, single rAF loop, single DOM write
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth  / 2
      const cy = window.innerHeight / 2
      mouseTarget.current = {
        x: (e.clientX - cx) / cx,
        y: (e.clientY - cy) / cy,
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const tick = () => {
      const lr = 0.048
      const ml = mouseLerped.current
      const mt = mouseTarget.current
      ml.x += (mt.x - ml.x) * lr
      ml.y += (mt.y - ml.y) * lr

      if (orbitRef.current) {
        const tx = ml.x * 32
        const ty = ml.y * 20
        orbitRef.current.style.transform = `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // ── Atmospheric canvas — halos, perspective grid, particles ──
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0, H = 0
    let canvasRafId = 0, lastDraw = 0, tick = 0
    // Offscreen canvas holds the static vertical scan-line texture — built once per resize
    let scanlines: HTMLCanvasElement | null = null

    const init = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight

      // Build vertical scan-line texture on an offscreen canvas
      // Dark 1px stripes every 4px — aurora color shows through the 3px gaps
      scanlines = document.createElement('canvas')
      scanlines.width  = W
      scanlines.height = H
      const sc = scanlines.getContext('2d')!
      sc.fillStyle = 'rgba(4,0,2,0.32)'   // dark stripe
      const spacing  = 4                   // 1px stripe, 3px gap
      for (let x = 0; x < W; x += spacing) {
        sc.fillRect(x, 0, 1, H)
      }
    }
    init()
    const onResize = () => init()
    window.addEventListener('resize', onResize)

    const drawFrame = (now: number) => {
      canvasRafId = requestAnimationFrame(drawFrame)
      if (now - lastDraw < 1000 / 24) return   // 24 fps cap
      lastDraw = now
      tick += 0.005

      ctx.clearRect(0, 0, W, H)

      // ── 1. Animated color blobs — soft breathing radial gradients ─────────
      // These are the large atmospheric pools of color (crimson + deep blue)
      // that breathe slowly. The scan lines laid on top create the "aurora" texture.

      // Blue blob — left edge (vivid indigo, large)
      let g = ctx.createRadialGradient(W * 0.04, H * 0.48, 0, W * 0.04, H * 0.48, W * 0.58)
      g.addColorStop(0,   `rgba(45,60,230,${+(0.92 + Math.sin(tick * 0.55)        * 0.06).toFixed(3)})`)
      g.addColorStop(0.5, `rgba(30,42,190,${+(0.55 + Math.sin(tick * 0.55)        * 0.06).toFixed(3)})`)
      g.addColorStop(1,   'rgba(30,42,190,0)')
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)

      // Crimson blob — center-right (dominant warm zone)
      g = ctx.createRadialGradient(W * 0.60, H * 0.50, 0, W * 0.60, H * 0.50, W * 0.60)
      g.addColorStop(0,   `rgba(210,48,36,${+(0.90 + Math.sin(tick * 0.42 + 1.2) * 0.07).toFixed(3)})`)
      g.addColorStop(0.5, `rgba(175,38,28,${+(0.55 + Math.sin(tick * 0.42 + 1.2) * 0.07).toFixed(3)})`)
      g.addColorStop(1,   'rgba(175,38,28,0)')
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)

      // Blue blob — right edge
      g = ctx.createRadialGradient(W * 0.97, H * 0.44, 0, W * 0.97, H * 0.44, W * 0.48)
      g.addColorStop(0,   `rgba(38,52,215,${+(0.85 + Math.sin(tick * 0.62 + 2.4) * 0.07).toFixed(3)})`)
      g.addColorStop(0.5, `rgba(26,38,180,${+(0.50 + Math.sin(tick * 0.62 + 2.4) * 0.07).toFixed(3)})`)
      g.addColorStop(1,   'rgba(26,38,180,0)')
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)

      // Secondary blue — upper-left corner accent
      g = ctx.createRadialGradient(W * 0.15, H * 0.18, 0, W * 0.15, H * 0.18, W * 0.32)
      g.addColorStop(0, `rgba(50,68,240,${+(0.60 + Math.sin(tick * 0.78 + 3.6)   * 0.08).toFixed(3)})`)
      g.addColorStop(1, 'rgba(50,68,240,0)')
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)

      // ── 2. Vertical scan-line texture (blit pre-built offscreen canvas) ───
      // Drawn OVER the blobs — their color shows through the gaps,
      // creating the "aurora light through a curtain" effect.
      if (scanlines) ctx.drawImage(scanlines, 0, 0)

      // ── 3. Radial vignette — darkens edges, focuses the eye on center ─────
      const vig = ctx.createRadialGradient(
        W * 0.5, H * 0.5, Math.min(W, H) * 0.20,
        W * 0.5, H * 0.5, Math.max(W, H) * 0.82
      )
      vig.addColorStop(0,    'rgba(4,0,2,0)')
      vig.addColorStop(0.65, 'rgba(4,0,2,0.22)')
      vig.addColorStop(1,    'rgba(4,0,2,0.72)')
      ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H)
    }

    canvasRafId = requestAnimationFrame(drawFrame)
    return () => {
      cancelAnimationFrame(canvasRafId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section className={styles.hero} id="hero">
      {/* ── ATMOSPHERIC CANVAS — halos + grid + particles ── */}
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.bgPulse} aria-hidden="true" />

      {/* ── ORBIT FIELD — pure CSS animations, GPU composited ── */}
      <div ref={orbitRef} className={styles.orbitField} aria-hidden="true">

        {/* Hub: zero-size anchor at center, all arms branch from here */}
        <div className={styles.orbitHub}>
          <OrbitRing terms={RING_1_TERMS} radius={280}  duration={24} dim={0.30} />
          <OrbitRing terms={RING_2_TERMS} radius={420}  duration={44} reverse dim={0.20} />
          <OrbitRing terms={RING_3_TERMS} radius={560}  duration={72} dim={0.13} />
        </div>
      </div>

      {/* ── CENTER CONTENT ── */}
      <div className={styles.center}>
        {/* Logo + edition pill */}
        <motion.div
          className={styles.topMeta}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 22, delay: 0.15 }}
        >
          <img src={logoImg} alt="CHIREC MUN logo" className={styles.logo} />
          <span className={styles.edition}>
            <span className={styles.editionDot} />
            Edition XIV
          </span>
        </motion.div>

        {/* CHIREC — interactive letters */}
        <motion.div
          ref={chirecRef}
          className={styles.chirecRow}
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.35 } } }}
        >
          {CHIREC_LETTERS.map((l, i) => (
            <motion.span
              key={i}
              className={styles.chirec}
              variants={{
                hidden:  { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 160, damping: 22 } },
              }}
              style={{
                color:      clicked[i] ? l.color : 'rgba(244,244,239,0.96)',
                textShadow: clicked[i]
                  ? `0 0 90px ${l.glow}, 0 0 34px ${l.glow}`
                  : '0 0 50px rgba(192,57,43,0.16)',
                transition: 'color 0.22s ease, text-shadow 0.22s ease',
              }}
              whileHover={{
                color:      l.color,
                textShadow: `0 0 75px ${l.glow}, 0 0 26px ${l.glow}`,
                y: -9, scale: 1.06,
                transition: { type: 'spring', stiffness: 360, damping: 20 },
              }}
              whileTap={{ scale: 0.93 }}
              onClick={() => toggleLetter(i)}
            >
              {l.char}
            </motion.span>
          ))}
        </motion.div>

        {/* Subtitle row */}
        <motion.p
          className={styles.munLabel}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 22, delay: 0.88 }}
        >
          Model United Nations · 2026
        </motion.p>

        {/* Tagline */}
        <motion.p
          className={styles.tagline}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.15 }}
        >
          Represent · Reason · Resolve
        </motion.p>

        {/* CTAs */}
        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 22, delay: 1.35 }}
        >
          <BlobButton href="#register" variant="red" className={styles.btnPrimary}>
            Register as Delegate
          </BlobButton>
          <BlobButton href="/committees" variant="blue" className={styles.btnGhost}>
            View Committees
          </BlobButton>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  )
}
