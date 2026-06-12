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
    let scanlines: HTMLCanvasElement | null = null
    let dpr = 1

    // Aurora band height — curtains hang from top, fade out before reaching center text
    const AURORA_FRAC = 0.48   // fraction of hero height where aurora fully dissolves

    const init = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      canvas.width  = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Scan lines only as tall as the aurora band — fine 0.5px light verticals
      const auroraH = Math.round(H * AURORA_FRAC)
      scanlines = document.createElement('canvas')
      scanlines.width  = Math.round(W * dpr)
      scanlines.height = Math.round(auroraH * dpr)
      const sctx = scanlines.getContext('2d')!
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      sctx.fillStyle = 'rgba(200,215,255,0.042)'
      const spacing = 4.5
      for (let x = 0; x < W; x += spacing) {
        sctx.fillRect(x, 0, 0.5, auroraH)
      }
    }
    init()
    const onResize = () => init()
    window.addEventListener('resize', onResize)

    const drawFrame = (now: number) => {
      canvasRafId = requestAnimationFrame(drawFrame)
      if (now - lastDraw < 1000 / 24) return
      lastDraw = now
      tick += 0.016

      ctx.clearRect(0, 0, W, H)

      const auroraH = H * AURORA_FRAC

      // ── Linear continuous drift — modulo wrap, no reversal ──────────────
      // All blobs drift rightward at different speeds + starting phases.
      // WRAP > W so blobs re-enter from the left seamlessly.
      const WRAP = W * 2.0

      const p = (speed: number, phase: number) =>
        (tick * W * speed + W * phase) % WRAP - W * 0.5

      // 7 curtain blobs — varying color, speed, Y anchor, radius, opacity
      const blobs = [
        // color r,g,b    cx                   cy        r-mult  peak   breathFreq  breathPhase
        { c:'22,28,108',  cx: p(0.055, 0.00),  cy:0.08,  rm:1.50, pk:0.54, bf:0.22, bp:0.0  },
        { c:'18,22,90',   cx: p(0.082, 0.55),  cy:0.12,  rm:1.20, pk:0.44, bf:0.19, bp:1.4  },
        { c:'28,18,115',  cx: p(0.041, 1.10),  cy:0.06,  rm:1.35, pk:0.50, bf:0.25, bp:2.8  },
        { c:'145,36,28',  cx: p(0.036, 0.30),  cy:0.04,  rm:1.65, pk:0.60, bf:0.20, bp:4.2  },
        { c:'120,28,22',  cx: p(0.061, 1.50),  cy:0.09,  rm:1.40, pk:0.52, bf:0.17, bp:0.7  },
        { c:'80,20,60',   cx: p(0.048, 0.80),  cy:0.03,  rm:1.25, pk:0.38, bf:0.23, bp:3.5  },
        { c:'140,32,26',  cx: p(0.028, 1.80),  cy:0.07,  rm:1.55, pk:0.48, bf:0.21, bp:5.1  },
      ] as const

      for (const b of blobs) {
        const op = b.pk + (b.pk * 0.22) * Math.sin(tick * b.bf + b.bp)
        const cy = H * b.cy
        const r  = auroraH * b.rm
        const g  = ctx.createRadialGradient(b.cx, cy, 0, b.cx, cy, r)
        g.addColorStop(0,    `rgba(${b.c},${op.toFixed(3)})`)
        g.addColorStop(0.50, `rgba(${b.c},${(op * 0.38).toFixed(3)})`)
        g.addColorStop(1,    `rgba(${b.c},0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, auroraH)
      }

      // Scan lines — only over the aurora band
      if (scanlines) ctx.drawImage(scanlines, 0, 0, W, H * AURORA_FRAC)

      // Dissolve aurora into black — gradient from transparent → #040002 over bottom 25% of band
      {
        const fadeStart = auroraH * 0.62
        const fadeGrad = ctx.createLinearGradient(0, fadeStart, 0, auroraH * 1.05)
        fadeGrad.addColorStop(0, 'rgba(4,0,2,0)')
        fadeGrad.addColorStop(1, 'rgba(4,0,2,1)')
        ctx.fillStyle = fadeGrad
        ctx.fillRect(0, fadeStart, W, H - fadeStart)
      }
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
