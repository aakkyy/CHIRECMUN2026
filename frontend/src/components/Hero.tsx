import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Hero.module.css'
import logoImg from '../assets/logo.png'
import BlobButton from './BlobButton'
import CinematicAtmosphere from './CinematicAtmosphere'

const CHIREC_LETTERS = [
  { char: 'C', color: '#e74c3c', glow: 'rgba(231,76,60,0.95)' },
  { char: 'H', color: '#22c55e', glow: 'rgba(34,197,94,0.95)'  },
  { char: 'I', color: '#1d4ed8', glow: 'rgba(29,78,216,0.95)'  },
  { char: 'R', color: '#e74c3c', glow: 'rgba(231,76,60,0.95)'  },
  { char: 'E', color: '#22c55e', glow: 'rgba(34,197,94,0.95)'  },
  { char: 'C', color: '#1e3a8a', glow: 'rgba(30,58,138,0.95)'  },
]

const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0,  transition: { type: 'spring', stiffness: 80, damping: 20, delay } },
})

export default function Hero() {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const heroRef      = useRef<HTMLDivElement>(null)
  const chirecRowRef = useRef<HTMLDivElement>(null)
  const mouse        = useRef({ x: 0, y: 0 })

  const [clicked,   setClicked]   = useState<Record<number, boolean>>({})
  const [hoverLeft, setHoverLeft] = useState(false)
  const [ready,     setReady]     = useState(false)

  const toggleLetter = (i: number) => setClicked(prev => ({ ...prev, [i]: !prev[i] }))

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (chirecRowRef.current && !chirecRowRef.current.contains(e.target as Node)) setClicked({})
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  /* atmospheric canvas */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let W = 0, H = 0, t = 0, raf = 0, lastTime = 0
    const INTERVAL = 1000 / 30

    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }

    const onMouse = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMouse)

    const bgPts = Array.from({ length: 48 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      vy: -(0.18 + Math.random() * 0.36), vx: (Math.random() - 0.5) * 0.12,
      size: 0.5 + Math.random() * 1.2, isBlue: Math.random() < 0.30,
      alpha: 0.32 + Math.random() * 0.46, phase: Math.random() * Math.PI * 2,
    }))

    function draw(ts: number) {
      if (ts - lastTime < INTERVAL) { raf = requestAnimationFrame(draw); return }
      lastTime = ts; t = ts / 1000

      ctx.fillStyle = '#040002'; ctx.fillRect(0, 0, W, H)

      const mx = mouse.current.x || W / 2, my = mouse.current.y || H / 2
      const mOX = (mx - W / 2) * 0.022, mOY = (my - H / 2) * 0.015

      const HALOS = [
        { x: W*0.38+mOX*0.8,  y: H*0.68+mOY*0.5, r: Math.min(W,H)*0.95, cr:180,cg:22,cb:14,  a:0.62, ph:0.0, spd:0.055 },
        { x: W*0.08+mOX*1.3,  y: H*0.35+mOY*0.8, r: Math.min(W,H)*0.55, cr:10,cg:30,cb:168,  a:0.38, ph:2.1, spd:0.042 },
        { x: W*0.72+mOX*0.6,  y: H*0.28+mOY*0.4, r: Math.min(W,H)*0.50, cr:10,cg:30,cb:168,  a:0.34, ph:4.8, spd:0.038 },
      ]
      for (const h of HALOS) {
        const pulse = 0.93 + 0.07 * Math.sin(t * h.spd + h.ph)
        const cx2   = h.x + Math.sin(t*h.spd*0.7+h.ph)*W*0.014
        const cy2   = h.y + Math.cos(t*h.spd*0.5+h.ph+1.3)*H*0.010
        const g = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, h.r * pulse)
        g.addColorStop(0,    `rgba(${h.cr},${h.cg},${h.cb},${h.a})`)
        g.addColorStop(0.38, `rgba(${h.cr},${h.cg},${h.cb},${(h.a*0.40).toFixed(3)})`)
        g.addColorStop(0.72, `rgba(${h.cr},${h.cg},${h.cb},${(h.a*0.09).toFixed(3)})`)
        g.addColorStop(1,    `rgba(${h.cr},${h.cg},${h.cb},0)`)
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
      }

      /* perspective grid */
      const vpX = W*0.36 + mOX*0.10, vpY = H*0.68, gPh = (t * 0.13) % 1
      ctx.save()
      for (let i = 0; i < 20; i++) {
        const raw = ((i / 20) + gPh) % 1, gp = Math.pow(raw, 0.62)
        const y2 = vpY + (H + 80 - vpY) * gp
        if (y2 > H + 2 || y2 < vpY - 2) continue
        const alpha = gp * 0.20 * (0.78 + 0.22 * Math.sin(t*0.20+i*0.4))
        ctx.beginPath(); ctx.moveTo(0,y2); ctx.lineTo(W,y2)
        ctx.strokeStyle = `rgba(192,57,43,${alpha.toFixed(4)})`
        ctx.lineWidth = 0.3 + gp * 1.4; ctx.stroke()
      }
      for (let i = 0; i <= 32; i++) {
        const xB = (i/32)*W*1.5 - W*0.25
        const cF = 1 - Math.abs(i/32-0.5)*2
        const alpha = cF * 0.11 * (0.72 + 0.28 * Math.sin(t*0.16+i*0.25))
        if (alpha < 0.004) continue
        ctx.beginPath(); ctx.moveTo(vpX, vpY); ctx.lineTo(xB, H+40)
        ctx.strokeStyle = `rgba(192,57,43,${alpha.toFixed(4)})`
        ctx.lineWidth = 0.5; ctx.stroke()
      }
      ctx.restore()

      /* atmosphere particles */
      for (const p of bgPts) {
        p.y += p.vy; p.x += p.vx + Math.sin(t*0.28+p.phase)*0.08
        if (p.y < -12) { p.y = H+12; p.x = Math.random()*W; p.phase = Math.random()*Math.PI*2 }
        const eF = Math.min(1, (H-p.y)/(H*0.22), Math.max(0,p.y/(H*0.08)))
        const a  = p.alpha * eF * (0.68 + 0.32*Math.sin(t*0.48+p.phase))
        if (a < 0.018) continue
        const cr = p.isBlue ? '56,160,242' : '231,76,60'
        for (let k = 1; k <= 3; k++) {
          ctx.beginPath(); ctx.arc(p.x, p.y+k*2.6, p.size*0.62, 0, Math.PI*2)
          ctx.fillStyle = `rgba(${cr},${(a*0.24/k).toFixed(3)})`; ctx.fill()
        }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2)
        ctx.fillStyle = `rgba(${cr},${a.toFixed(3)})`; ctx.fill()
      }

      /* vignettes */
      const vT = ctx.createLinearGradient(0,0,0,H*0.30)
      vT.addColorStop(0,'rgba(4,0,2,0.88)'); vT.addColorStop(1,'rgba(4,0,2,0)')
      ctx.fillStyle = vT; ctx.fillRect(0,0,W,H*0.30)
      const vB = ctx.createLinearGradient(0,H,0,H*0.65)
      vB.addColorStop(0,'rgba(4,0,2,0.82)'); vB.addColorStop(1,'rgba(4,0,2,0)')
      ctx.fillStyle = vB; ctx.fillRect(0,H*0.65,W,H*0.35)
      const vL = ctx.createLinearGradient(0,0,W*0.08,0)
      vL.addColorStop(0,'rgba(4,0,2,0.90)'); vL.addColorStop(1,'rgba(4,0,2,0)')
      ctx.fillStyle = vL; ctx.fillRect(0,0,W*0.08,H)

      raf = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    resize()
    raf = requestAnimationFrame(draw)
    setTimeout(() => setReady(true), 120)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <section ref={heroRef} className={styles.hero} id="hero">
      <canvas ref={canvasRef} className={styles.canvas} />
      <CinematicAtmosphere />

      {/* ── LEFT PANEL — CHIREC ── */}
      <div
        className={styles.leftPanel}
        style={{ flex: hoverLeft ? 1.85 : 1.45 }}
        onMouseEnter={() => setHoverLeft(true)}
        onMouseLeave={() => setHoverLeft(false)}
      >
        {/* Red atmospheric glow behind the letters */}
        <div className={styles.leftGlow} />

        {/* CHIREC — interactive, right-aligned so it bleeds off the left edge */}
        <motion.div
          ref={chirecRowRef}
          className={styles.chirecRow}
          initial="hidden"
          animate={ready ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
        >
          {CHIREC_LETTERS.map((l, i) => (
            <motion.span
              key={i}
              className={styles.chirec}
              variants={{
                hidden:  { opacity: 0, x: 60, skewX: 10 },
                visible: { opacity: 1, x: 0,  skewX: 0, transition: { type: 'spring', stiffness: 200, damping: 22 } },
              }}
              style={{
                color:      clicked[i] ? l.color : 'rgba(244,244,239,0.95)',
                textShadow: clicked[i]
                  ? `0 0 100px ${l.glow}, 0 0 40px ${l.glow}`
                  : '0 0 60px rgba(192,57,43,0.22)',
                transition: 'color 0.24s ease, text-shadow 0.24s ease',
                cursor: 'pointer',
              }}
              whileHover={{
                color:      l.color,
                textShadow: `0 0 80px ${l.glow}, 0 0 28px ${l.glow}`,
                y: -10, scale: 1.06,
                transition: { type: 'spring', stiffness: 380, damping: 18 },
              }}
              whileTap={{ scale: 0.94 }}
              onClick={() => toggleLetter(i)}
            >
              {l.char}
            </motion.span>
          ))}
        </motion.div>

        {/* Hover hint */}
        <motion.div
          className={styles.leftHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: hoverLeft ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className={styles.hintLine} />
          <span className={styles.hintText}>hover to reveal</span>
        </motion.div>
      </div>

      {/* ── HAIRLINE DIVIDER ── */}
      <motion.div
        className={styles.hairline}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      />

      {/* ── RIGHT PANEL — editorial ── */}
      <div
        className={styles.rightPanel}
        style={{ flex: hoverLeft ? 0.65 : 1.0 }}
      >
        <motion.div
          className={styles.rightInner}
          initial="hidden"
          animate={ready ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } } }}
        >
          {/* Logo */}
          <motion.img
            src={logoImg}
            alt="CHIREC MUN"
            className={styles.logoImg}
            variants={fadeUp(0)}
          />

          {/* Edition badge */}
          <motion.span className={styles.badge} variants={fadeUp(0)}>
            <span className={styles.badgeDot} />
            Edition XIV
          </motion.span>

          {/* MUN + year */}
          <motion.div className={styles.munBlock} variants={fadeUp(0)}>
            <span className={styles.munWord}>MUN</span>
            <span className={styles.munYear}>2026</span>
          </motion.div>

          <motion.div className={styles.rHair} variants={fadeUp(0)} />

          {/* Meta */}
          <motion.div className={styles.metaBlock} variants={fadeUp(0)}>
            <span>Model United Nations</span>
            <span>Serilingampally, Hyderabad</span>
            <span>July 31 – August 2, 2026</span>
          </motion.div>

          <motion.div className={styles.rHair} variants={fadeUp(0)} />

          {/* Tagline */}
          <motion.span className={styles.slogan} variants={fadeUp(0)}>
            Represent · Reason · Resolve
          </motion.span>

          {/* CTAs */}
          <motion.div className={styles.actions} variants={fadeUp(0)}>
            <BlobButton href="#register" variant="red" className={styles.btnPrimary}>
              Register as Delegate
            </BlobButton>
            <BlobButton href="/committees" variant="blue" className={styles.btnGhost}>
              View Committees
            </BlobButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
