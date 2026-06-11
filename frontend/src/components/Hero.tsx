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
    let W = window.innerWidth, H = window.innerHeight, t = 0, raf = null
    let lastTime = 0
    const FPS = 30, INTERVAL = 1000 / FPS

    function resize() {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    // ── Mouse parallax tracking ───────────────────────────────
    let mouseX = W / 2, mouseY = H / 2
    const onMouse = (e) => { mouseX = e.clientX; mouseY = e.clientY }
    window.addEventListener('mousemove', onMouse)

    // ── Rising ember particles ────────────────────────────────
    interface Particle { x:number; y:number; vy:number; vx:number; size:number; isBlue:boolean; alpha:number; phase:number }
    const particles: Particle[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vy: -(0.18 + Math.random() * 0.38),
      vx: (Math.random() - 0.5) * 0.14,
      size: 0.5 + Math.random() * 1.3,
      isBlue: Math.random() < 0.32,
      alpha: 0.25 + Math.random() * 0.42,
      phase: Math.random() * Math.PI * 2,
    }))

    function draw(ts) {
      if (ts - lastTime < INTERVAL) { raf = requestAnimationFrame(draw); return }
      lastTime = ts
      t = ts / 1000

      // 1. BASE
      ctx.fillStyle = '#040002'
      ctx.fillRect(0, 0, W, H)

      // 2. MOUSE PARALLAX OFFSET
      const mOffX = (mouseX - W / 2) * 0.025
      const mOffY = (mouseY - H / 2) * 0.018

      // 3. THREE MASSIVE ATMOSPHERIC HALOS
      const HALOS = [
        { x: W/2 + mOffX*0.8,    y: H*0.70 + mOffY*0.5,  r: Math.min(W,H)*0.88, cr:180, cg:22,  cb:14,  a:0.40, ph:0.0, spd:0.055 },
        { x: W*0.10 + mOffX*1.4, y: H*0.36 + mOffY*0.8,  r: Math.min(W,H)*0.60, cr:10,  cg:30,  cb:168, a:0.28, ph:2.1, spd:0.042 },
        { x: W*0.90 + mOffX*1.4, y: H*0.36 + mOffY*0.8,  r: Math.min(W,H)*0.60, cr:10,  cg:30,  cb:168, a:0.26, ph:4.8, spd:0.038 },
      ]
      for (const h of HALOS) {
        const pulse = 0.93 + 0.07 * Math.sin(t * h.spd + h.ph)
        const cx = h.x + Math.sin(t * h.spd * 0.7 + h.ph) * W * 0.016
        const cy = h.y + Math.cos(t * h.spd * 0.5 + h.ph + 1.3) * H * 0.011
        const rr = h.r * pulse
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr)
        g.addColorStop(0,    `rgba(${h.cr},${h.cg},${h.cb},${h.a})`)
        g.addColorStop(0.38, `rgba(${h.cr},${h.cg},${h.cb},${(h.a*0.42).toFixed(3)})`)
        g.addColorStop(0.72, `rgba(${h.cr},${h.cg},${h.cb},${(h.a*0.10).toFixed(3)})`)
        g.addColorStop(1,    `rgba(${h.cr},${h.cg},${h.cb},0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
      }

      // 4. PERSPECTIVE GRID — this is the centrepiece
      const vpX = W / 2 + mOffX * 0.12
      const vpY = H * 0.72
      const gridPhase = (t * 0.13) % 1

      ctx.save()

      // Horizontal lines: perspective-spaced, continuously scrolling toward viewer
      const N_H = 22
      for (let i = 0; i < N_H; i++) {
        const raw = ((i / N_H) + gridPhase) % 1
        const gp  = Math.pow(raw, 0.62)            // perspective foreshortening
        const y   = vpY + (H + 80 - vpY) * gp
        if (y > H + 2 || y < vpY - 2) continue
        const alpha = gp * 0.15 * (0.78 + 0.22 * Math.sin(t * 0.20 + i * 0.4))
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(W, y)
        ctx.strokeStyle = `rgba(192,57,43,${alpha.toFixed(4)})`
        ctx.lineWidth = 0.3 + gp * 1.6
        ctx.stroke()
      }

      // Vertical lines radiating from VP
      const N_V = 38
      for (let i = 0; i <= N_V; i++) {
        const xBottom = (i / N_V) * W * 1.65 - W * 0.325
        const centerFrac = 1 - Math.abs(i / N_V - 0.5) * 2
        const alpha = centerFrac * 0.088 * (0.72 + 0.28 * Math.sin(t * 0.16 + i * 0.25))
        if (alpha < 0.004) continue
        ctx.beginPath()
        ctx.moveTo(vpX, vpY)
        ctx.lineTo(xBottom, H + 40)
        ctx.strokeStyle = `rgba(192,57,43,${alpha.toFixed(4)})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      ctx.restore()

      // 5. RISING PARTICLES WITH TRAILS
      for (const p of particles) {
        p.y += p.vy
        p.x += p.vx + Math.sin(t * 0.28 + p.phase) * 0.09
        if (p.y < -12) { p.y = H + 12; p.x = Math.random() * W; p.phase = Math.random() * Math.PI * 2 }

        const edgeFade = Math.min(1, (H - p.y) / (H * 0.22), Math.max(0, p.y / (H * 0.08)))
        const a = p.alpha * edgeFade * (0.68 + 0.32 * Math.sin(t * 0.48 + p.phase))
        if (a < 0.018) continue

        const cr = p.isBlue ? '56,160,242' : '231,76,60'
        for (let k = 1; k <= 3; k++) {
          ctx.beginPath()
          ctx.arc(p.x, p.y + k * 2.8, p.size * 0.65, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${cr},${(a * 0.26 / k).toFixed(3)})`
          ctx.fill()
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${cr},${a.toFixed(3)})`
        ctx.fill()
      }

      // 6. REACTOR CORE — pulsing bright point above VP
      const corePulse = 0.5 + 0.5 * Math.sin(t * 1.85)
      const coreA = 0.52 + 0.38 * corePulse
      const coreY = vpY - H * 0.04
      const coreG = ctx.createRadialGradient(vpX, coreY, 0, vpX, coreY, 130)
      coreG.addColorStop(0,    `rgba(255,110,85,${coreA.toFixed(3)})`)
      coreG.addColorStop(0.18, `rgba(220,58,38,${(coreA*0.52).toFixed(3)})`)
      coreG.addColorStop(0.5,  `rgba(192,40,24,${(coreA*0.16).toFixed(3)})`)
      coreG.addColorStop(1,    'rgba(192,40,24,0)')
      ctx.fillStyle = coreG
      ctx.fillRect(vpX - 140, coreY - 140, 280, 280)
      // Tiny bright centre dot
      ctx.beginPath()
      ctx.arc(vpX, coreY, 2.8, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,190,170,${(0.75 + 0.25 * corePulse).toFixed(3)})`
      ctx.fill()

      // 7. VIGNETTE — protect text legibility
      const vT = ctx.createLinearGradient(0, 0, 0, H * 0.34)
      vT.addColorStop(0, 'rgba(4,0,2,0.94)'); vT.addColorStop(1, 'rgba(4,0,2,0)')
      ctx.fillStyle = vT; ctx.fillRect(0, 0, W, H * 0.34)

      const vB = ctx.createLinearGradient(0, H, 0, H * 0.65)
      vB.addColorStop(0, 'rgba(4,0,2,0.90)'); vB.addColorStop(1, 'rgba(4,0,2,0)')
      ctx.fillStyle = vB; ctx.fillRect(0, H * 0.65, W, H * 0.35)

      const vL = ctx.createLinearGradient(0, 0, W * 0.16, 0)
      vL.addColorStop(0, 'rgba(4,0,2,0.85)'); vL.addColorStop(1, 'rgba(4,0,2,0)')
      ctx.fillStyle = vL; ctx.fillRect(0, 0, W * 0.16, H)

      const vR = ctx.createLinearGradient(W, 0, W * 0.84, 0)
      vR.addColorStop(0, 'rgba(4,0,2,0.85)'); vR.addColorStop(1, 'rgba(4,0,2,0)')
      ctx.fillStyle = vR; ctx.fillRect(W * 0.84, 0, W * 0.16, H)

      raf = requestAnimationFrame(draw)
    }
    window.addEventListener('resize',resize)
    resize()
    raf = requestAnimationFrame(draw)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize',resize)
      window.removeEventListener('mousemove', onMouse)
    }
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
