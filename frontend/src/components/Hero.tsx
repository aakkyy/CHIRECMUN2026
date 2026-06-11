import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import styles from './Hero.module.css'
import logoImg from '../assets/logo.png'
import BlobButton from './BlobButton'
import CinematicAtmosphere from './CinematicAtmosphere'

const CHIREC_LETTERS = [
  { char: 'C', color: '#e74c3c', glow: 'rgba(231,76,60,0.85)'   },  // red
  { char: 'H', color: '#22c55e', glow: 'rgba(34,197,94,0.85)'   },  // green
  { char: 'I', color: '#1d4ed8', glow: 'rgba(29,78,216,0.85)'   },  // dark blue
  { char: 'R', color: '#e74c3c', glow: 'rgba(231,76,60,0.85)'   },  // red
  { char: 'E', color: '#22c55e', glow: 'rgba(34,197,94,0.85)'   },  // green
  { char: 'C', color: '#1e3a8a', glow: 'rgba(30,58,138,0.85)'   },  // dark blue
]

/* letters crash into position — heavy spring, slight overshoot */
const letterVariant = {
  hidden:  { opacity: 0, y: -140, scale: 1.35, rotate: -8 },
  visible: {
    opacity: 1, y: 0, scale: 1, rotate: 0,
    transition: { type: 'spring', stiffness: 240, damping: 17, mass: 1.1 },
  },
}

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 88, damping: 22 } },
}

export default function Hero() {
  const canvasRef = useRef(null)
  const heroRef   = useRef(null)
  const [clicked, setClicked] = useState({})
  const chirecRowRef = useRef(null)
  const toggleLetter = (i) => setClicked(prev => ({ ...prev, [i]: !prev[i] }))

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (chirecRowRef.current && !chirecRowRef.current.contains(e.target)) {
        setClicked({})
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const contentY   = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])
  const contentOp  = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const hintOp     = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H, t = 0, raf = null
    let lastTime = 0
    const FPS = 30, INTERVAL = 1000 / FPS

    function resize() {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    // ── High-Voltage Chromatic Field ──────────────────────────
    // 4 mega halos drifting in slow lissajous orbits
    const HALOS = [
      { xf: 0.00, yf: 0.00, col: 'rgba(175,25,15,',  a: 0.22, phx: 0.0, phy: 1.2 },  // top-left crimson
      { xf: 1.00, yf: 0.00, col: 'rgba(12,38,172,',  a: 0.18, phx: 3.1, phy: 4.3 },  // top-right blue
      { xf: 0.00, yf: 1.00, col: 'rgba(8,28,140,',   a: 0.16, phx: 1.9, phy: 0.6 },  // bottom-left blue
      { xf: 1.00, yf: 1.00, col: 'rgba(160,20,12,',  a: 0.20, phx: 5.0, phy: 2.7 },  // bottom-right crimson
    ]

    // 3 horizontal chromatic bands — crimson / blue / crimson
    const BANDS = [
      { yf: 0.30, col: 'rgba(192,57,43,',  ph: 0.0, spd: 0.05 },
      { yf: 0.55, col: 'rgba(12,38,172,',  ph: 2.1, spd: 0.04 },
      { yf: 0.72, col: 'rgba(192,57,43,',  ph: 4.2, spd: 0.06 },
    ]

    function drawGridSet(angle, offset, count, spacing, alpha) {
      ctx.save()
      ctx.translate(W / 2, H / 2)
      ctx.rotate(angle)
      ctx.setLineDash([])
      ctx.lineWidth = 0.5
      const span = Math.sqrt(W * W + H * H)
      const total = count * spacing
      for (let i = 0; i < count; i++) {
        let x = ((i * spacing + offset) % total + total) % total - total / 2
        ctx.beginPath()
        ctx.moveTo(x, -span / 2)
        ctx.lineTo(x,  span / 2)
        ctx.strokeStyle = `rgba(255,255,255,${(alpha).toFixed(4)})`
        ctx.stroke()
      }
      ctx.restore()
    }

    function draw(ts) {
      if (ts - lastTime < INTERVAL) { raf = requestAnimationFrame(draw); return }
      lastTime = ts
      t = ts / 1000

      // 1. Base fill
      ctx.fillStyle = '#040002'
      ctx.fillRect(0, 0, W, H)

      // 2. Slow-drifting mega color halos (lissajous, ~20s period)
      const haloR = 0.7 * Math.min(W, H)
      const amp = 0.04 * W
      for (const hl of HALOS) {
        const cx = hl.xf * W + Math.sin(t * (Math.PI * 2 / 20) + hl.phx) * amp
        const cy = hl.yf * H + Math.cos(t * (Math.PI * 2 / 23) + hl.phy) * amp
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloR)
        g.addColorStop(0,    hl.col + hl.a + ')')
        g.addColorStop(0.45, hl.col + (hl.a * 0.4).toFixed(3) + ')')
        g.addColorStop(1,    hl.col + '0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
      }

      // 3. Diagonal interference grid — two crossing line sets (~55°), moiré drift
      const spacing = W / 12
      drawGridSet( 55 * Math.PI / 180,  t * 4, 12, spacing, 0.035)
      drawGridSet(-55 * Math.PI / 180, -t * 3, 12, spacing, 0.028)

      // 4. Horizontal chromatic bands — fake blur via layered strokes
      const bandH = H * 0.006
      for (const b of BANDS) {
        const y = b.yf * H + Math.sin(t * b.spd * Math.PI * 2 + b.ph) * H * 0.02
        // 5 layers: widest/faintest → thinnest/brightest
        const layers = [
          { h: bandH * 9, a: 0.04 },
          { h: bandH * 6, a: 0.06 },
          { h: bandH * 4, a: 0.08 },
          { h: bandH * 2, a: 0.10 },
          { h: bandH * 1, a: 0.12 },
        ]
        for (const L of layers) {
          ctx.fillStyle = b.col + L.a + ')'
          ctx.fillRect(0, y - L.h / 2, W, L.h)
        }
      }

      // 5. Central light well — breathing brighter center
      const breathe = 0.18 * (0.82 + 0.18 * Math.sin(t * 0.35))
      const well = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.min(W, H) * 0.55)
      well.addColorStop(0, `rgba(90,10,6,${breathe.toFixed(3)})`)
      well.addColorStop(1, 'rgba(90,10,6,0)')
      ctx.fillStyle = well
      ctx.fillRect(0, 0, W, H)

      // 6. Edge vignette — darken all 4 edges
      const vTop = ctx.createLinearGradient(0, 0, 0, H * 0.28)
      vTop.addColorStop(0, 'rgba(4,0,2,0.75)'); vTop.addColorStop(1, 'rgba(4,0,2,0)')
      ctx.fillStyle = vTop; ctx.fillRect(0, 0, W, H * 0.28)
      const vBot = ctx.createLinearGradient(0, H, 0, H * 0.72)
      vBot.addColorStop(0, 'rgba(4,0,2,0.75)'); vBot.addColorStop(1, 'rgba(4,0,2,0)')
      ctx.fillStyle = vBot; ctx.fillRect(0, H * 0.72, W, H * 0.28)
      const vL = ctx.createLinearGradient(0, 0, W * 0.22, 0)
      vL.addColorStop(0, 'rgba(4,0,2,0.75)'); vL.addColorStop(1, 'rgba(4,0,2,0)')
      ctx.fillStyle = vL; ctx.fillRect(0, 0, W * 0.22, H)
      const vR = ctx.createLinearGradient(W, 0, W * 0.78, 0)
      vR.addColorStop(0, 'rgba(4,0,2,0.75)'); vR.addColorStop(1, 'rgba(4,0,2,0)')
      ctx.fillStyle = vR; ctx.fillRect(W * 0.78, 0, W * 0.22, H)

      // 7. Fine grain — regenerated each frame for film-grain shimmer
      ctx.save()
      for (let i = 0; i < 300; i++) {
        const gx = Math.random() * W
        const gy = Math.random() * H
        const ga = 0.015 + Math.random() * 0.025
        ctx.beginPath()
        ctx.arc(gx, gy, 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${ga.toFixed(4)})`
        ctx.fill()
      }
      ctx.restore()

      raf = requestAnimationFrame(draw)
    }
    window.addEventListener('resize',resize)
    resize()
    raf = requestAnimationFrame(draw)
    return () => { if (raf) cancelAnimationFrame(raf); window.removeEventListener('resize',resize) }
  }, [])

  return (
    <section ref={heroRef} className={styles.hero} id="hero">
      <canvas ref={canvasRef} className={styles.canvas} />
      <CinematicAtmosphere />
      <div className={styles.vignette} />

      <motion.div
        className={styles.content}
        style={{ y: contentY, opacity: contentOp }}
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } } }}
      >
        {/* Logo — opacity only so CSS float is unaffected */}
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.7 }, visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 80, damping: 18 } } }}>
          <div className={styles.logoWrap}>
            <img src={logoImg} alt="CHIREC MUN Logo" className={styles.logoImg} />
          </div>
        </motion.div>

        <motion.span className={styles.badge} variants={fadeUp}>
          <span className={styles.badgeDot} aria-hidden="true" />
          Edition XIV
        </motion.span>

        {/* CHIREC — letter by letter */}
        <h1 className={styles.title}>
          <motion.div
            ref={chirecRowRef}
            className={styles.chirecRow}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          >
            {CHIREC_LETTERS.map((l, i) => (
              <motion.span
                key={i}
                className={styles.chirec}
                variants={letterVariant}
                style={{
                  cursor: 'pointer',
                  color: clicked[i] ? l.color : '#f4f4ef',
                  textShadow: clicked[i]
                    ? `0 0 65px ${l.glow}, 0 0 28px ${l.glow}`
                    : 'none',
                  transition: 'color 0.3s ease, text-shadow 0.3s ease',
                }}
                whileHover={{
                  opacity: 1,
                  color: l.color,
                  textShadow: `0 0 50px ${l.glow}, 0 0 20px ${l.glow}`,
                  y: -10,
                  scale: 1.12,
                  transition: { type: 'spring', stiffness: 400, damping: 18 },
                }}
                whileTap={{ opacity: 1, scale: 0.94 }}
                onClick={() => toggleLetter(i)}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              >{l.char}</motion.span>
            ))}
          </motion.div>

          <motion.span className={styles.mun} variants={fadeUp}>
            Model United Nations
          </motion.span>

          <motion.span className={styles.year} variants={fadeUp}>
            2026
          </motion.span>
        </h1>

        <motion.p className={styles.slogan} variants={fadeUp}>
          Represent. Reason. Resolve.
        </motion.p>

        <motion.p className={styles.location} variants={fadeUp}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          CHIREC International School, Serilingampalle · July 31 – Aug 2, 2026
        </motion.p>

        <motion.div className={styles.actions} variants={fadeUp}>
          <BlobButton href="#register" className={styles.btnPrimary} variant="red">
            Register as Delegate
          </BlobButton>
          <BlobButton href="#countdown" className={styles.btnGhost} variant="blue">
            View Countdown
          </BlobButton>
        </motion.div>
      </motion.div>

      <motion.div className={styles.scrollHint} style={{ opacity: hintOp }}>
        <span className={styles.scrollLabel}>Scroll</span>
        <div className={styles.scrollTrack}>
          <div className={styles.scrollGlider} />
        </div>
      </motion.div>
    </section>
  )
}
