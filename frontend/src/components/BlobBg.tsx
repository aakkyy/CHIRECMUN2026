/**
 * BlobBg — section background animations
 *
 *  nebula  (About)     → soft drifting gradient orbs
 *  red     (Countdown) → cinematic radial pulse rings + orbiting particles
 *  cta     (CTA)       → aurora sine-wave bands
 *  contact (Contact)   → constellation node network
 *
 * Performance notes:
 *  - NebulaBg: blur capped at 60px, no willChange (blur already composites)
 *  - ConstellationBg: 55 nodes (vs 80), flat color lines (no per-line gradient)
 *  - AuroraBg: 6px step (vs 4px), gradient objects reused across frame
 *  - RadialBg (canvas): pulse rings + orbiting dots, zero DOM elements
 */

import { useAnimationFrame, motion } from 'framer-motion'
import { useEffect, useRef, memo, type CSSProperties } from 'react'

const BG   = '#020108'
const RED  = { r: 192, g: 57,  b: 43  }
const REDB = { r: 231, g: 76,  b: 60  }
const BLUE = { r: 86,  g: 204, b: 242 }
const PURP = { r: 120, g: 55,  b: 210 }

function rgba({ r, g, b }: { r: number; g: number; b: number }, a: number) {
  return `rgba(${r},${g},${b},${a})`
}

// ── shared canvas hook ────────────────────────────────────────
// Pauses drawing automatically when the canvas is off-screen or
// the browser tab is hidden — the single biggest perf win.
function useCanvasLoop(
  draw: (ctx: CanvasRenderingContext2D, W: number, H: number, t: number) => void,
) {
  const ref       = useRef<HTMLCanvasElement>(null)
  const t         = useRef(0)
  const visible   = useRef(false)

  useEffect(() => {
    const c = ref.current; if (!c) return

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      c.width  = c.offsetWidth  * dpr
      c.height = c.offsetHeight * dpr
      const ctx = c.getContext('2d')
      if (ctx) ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    // Pause when scrolled out of view
    const obs = new IntersectionObserver(
      ([e]) => { visible.current = e.isIntersecting },
      { threshold: 0 },
    )
    obs.observe(c)

    // Pause when tab is hidden
    const onVis = () => { if (document.hidden) visible.current = false }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      window.removeEventListener('resize', resize)
      obs.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  useAnimationFrame((_, dt) => {
    if (!visible.current) return                      // skip entirely when off-screen
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    if (!c.width || !c.height) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const W = c.width / dpr
    const H = c.height / dpr
    t.current += Math.min(dt, 50) * 0.001
    draw(ctx, W, H, t.current)
  })

  return ref
}

// ─────────────────────────────────────────────────────────────
// SOFT GRADIENT MESH — About
// Four large slow-drifting gradient orbs. No willChange —
// blur already forces GPU compositing on its own layer.
// ─────────────────────────────────────────────────────────────
function NebulaBg() {
  const orbs = [
    {
      style: { left: '-8%', top: '-20%', width: '55%', height: '55%' },
      color: `radial-gradient(circle at 40% 40%, ${rgba(RED, 0.20)} 0%, transparent 68%)`,
      blur: 60,
      animate: {
        x: [0, 55, 80, 30, 0], y: [0, 40, 90, 50, 0],
        borderRadius: ['60% 40% 55% 45%/50% 60% 40% 50%', '40% 60% 45% 55%/60% 40% 55% 45%', '55% 45% 60% 40%/45% 55% 50% 50%', '60% 40% 55% 45%/50% 60% 40% 50%'],
      },
      duration: 28, delay: 0,
    },
    {
      style: { left: '50%', top: '-5%', width: '52%', height: '52%' },
      color: `radial-gradient(circle at 55% 55%, ${rgba(BLUE, 0.14)} 0%, transparent 65%)`,
      blur: 65,
      animate: {
        x: [0, -60, -30, -70, 0], y: [0, 50, 100, 30, 0],
        borderRadius: ['45% 55% 50% 50%/55% 45% 60% 40%', '60% 40% 55% 45%/40% 60% 45% 55%', '50% 50% 40% 60%/60% 40% 50% 50%', '45% 55% 50% 50%/55% 45% 60% 40%'],
      },
      duration: 32, delay: 5,
    },
    {
      style: { left: '20%', top: '45%', width: '44%', height: '44%' },
      color: `radial-gradient(circle at 45% 50%, ${rgba(PURP, 0.11)} 0%, transparent 65%)`,
      blur: 55,
      animate: {
        x: [0, 50, 10, 60, 0], y: [0, -40, -80, -20, 0],
        scale: [1, 1.06, 0.97, 1.04, 1],
      },
      duration: 24, delay: 10,
    },
    {
      style: { left: '60%', top: '50%', width: '40%', height: '40%' },
      color: `radial-gradient(circle at 50% 40%, ${rgba(RED, 0.13)} 0%, transparent 65%)`,
      blur: 55,
      animate: {
        x: [0, -45, -10, -55, 0], y: [0, -35, -65, -15, 0],
      },
      duration: 26, delay: 3,
    },
  ]

  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute', ...o.style,
            background: o.color,
            filter: `blur(${o.blur}px)`,
          }}
          animate={o.animate}
          transition={{ duration: o.duration, delay: o.delay, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ASTEROID BELT — Countdown
// Belt-space coords: each rock has a fixed `perp` and an `along`
// that advances then wraps — perfectly continuous, zero teleport.
// ─────────────────────────────────────────────────────────────

const BELT_ANG = -Math.PI * 0.14
const BELT_COS = Math.cos(BELT_ANG)
const BELT_SIN = Math.sin(BELT_ANG)
const PERP_COS = Math.cos(BELT_ANG + Math.PI / 2)
const PERP_SIN = Math.sin(BELT_ANG + Math.PI / 2)

const ROCK_COLORS = [
  [175, 52, 35], [155, 40, 26], [195, 68, 44],
  [58, 98, 188], [46, 82, 162], [72, 115, 205],
  [112, 108, 104], [88, 84, 80], [132, 128, 122],
]

interface Rock {
  along:  number   // px from canvas centre along belt axis — advances each frame
  perp:   number   // px perpendicular — FIXED per rock lifetime
  speed:  number   // px/s
  r:      number
  rot:    number
  rotSpd: number
  col:    number[]
  alpha:  number
  verts:  Array<[number, number]>
}

function makeRock(halfLen: number, beltW: number, randomAlong = true): Rock {
  const r     = 2.5 + Math.random() * 13
  const speed = 22 + Math.random() * 30
  const nPts  = 6 + Math.floor(Math.random() * 5)
  const verts: Array<[number, number]> = Array.from({ length: nPts }, (_, i) => {
    const ang = (i / nPts) * Math.PI * 2 + (Math.random() - 0.5) * 0.65
    const rad = r * (0.55 + Math.random() * 0.55)
    return [Math.cos(ang) * rad, Math.sin(ang) * rad]
  })
  return {
    along:  randomAlong ? (Math.random() * 2 - 1) * halfLen : -halfLen * 1.06,
    perp:   (Math.random() - 0.5) * beltW,
    speed, r,
    rot:    Math.random() * Math.PI * 2,
    rotSpd: (Math.random() - 0.5) * 0.014,
    col:    ROCK_COLORS[Math.floor(Math.random() * ROCK_COLORS.length)],
    alpha:  0.45 + Math.random() * 0.45,
    verts,
  }
}

interface BGStar { x: number; y: number; r: number; base: number; phase: number }

const AsteroidBeltBg = memo(function AsteroidBeltBg() {
  const rocks   = useRef<Rock[]>([])
  const bgStars = useRef<BGStar[]>([])
  const prevW   = useRef(0)
  const prevH   = useRef(0)

  function init(W: number, H: number) {
    const halfLen = Math.hypot(W, H)
    const beltW   = Math.min(W, H) * 0.55
    rocks.current   = Array.from({ length: 60 }, () => makeRock(halfLen, beltW, true))
    bgStars.current = Array.from({ length: 110 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 0.2 + Math.random() * 0.8,
      base: 0.1 + Math.random() * 0.55,
      phase: Math.random() * Math.PI * 2,
    }))
  }

  const ref = useCanvasLoop((ctx, W, H, t) => {
    if (W !== prevW.current || H !== prevH.current) {
      init(W, H); prevW.current = W; prevH.current = H
    }
    const dt      = 0.016
    const halfLen = Math.hypot(W, H)
    const beltW   = Math.min(W, H) * 0.55
    const cx = W / 2, cy = H / 2

    ctx.clearRect(0, 0, W, H)

    // ── Faint warm nebula wash ──
    const ng = ctx.createLinearGradient(0, H, W, 0)
    ng.addColorStop(0,   'rgba(80,18,8,0.16)')
    ng.addColorStop(0.5, 'rgba(100,22,10,0.07)')
    ng.addColorStop(1,   'rgba(60,14,6,0.03)')
    ctx.fillStyle = ng; ctx.fillRect(0, 0, W, H)

    // ── Background stars ──
    for (const s of bgStars.current) {
      const a = s.base * (0.5 + 0.5 * Math.sin(t * 0.8 + s.phase))
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,240,225,${a.toFixed(3)})`; ctx.fill()
    }

    // ── Asteroids ──
    for (const rock of rocks.current) {
      // Advance along belt
      rock.along += rock.speed * dt
      rock.rot   += rock.rotSpd

      // Seamless wrap: exit leading edge → re-enter trailing edge,
      // new random perp so the pattern never looks identical
      if (rock.along > halfLen * 1.06) {
        rock.along = -halfLen * 1.06
        rock.perp  = (Math.random() - 0.5) * beltW
      }

      // Belt-space → world
      const x = cx + BELT_COS * rock.along + PERP_COS * rock.perp
      const y = cy + BELT_SIN * rock.along + PERP_SIN * rock.perp

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rock.rot)

      ctx.beginPath()
      rock.verts.forEach(([px, py], i) => i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py))
      ctx.closePath()

      const [cr, cg, cb] = rock.col
      ctx.fillStyle   = `rgba(${cr},${cg},${cb},${rock.alpha})`
      ctx.strokeStyle = `rgba(${Math.max(0,cr-30)},${Math.max(0,cg-30)},${Math.max(0,cb-30)},${(rock.alpha*0.45).toFixed(3)})`
      ctx.lineWidth   = 0.6
      ctx.fill(); ctx.stroke()

      // Lit edge
      ctx.beginPath()
      ctx.moveTo(rock.verts[0][0], rock.verts[0][1])
      ctx.lineTo(rock.verts[1][0], rock.verts[1][1])
      ctx.strokeStyle = `rgba(255,238,210,${(rock.alpha * 0.22).toFixed(3)})`
      ctx.lineWidth   = 0.9; ctx.stroke()

      ctx.restore()
    }
  })

  return <canvas ref={ref} style={canvasStyle} aria-hidden="true" />
})

// ─────────────────────────────────────────────────────────────
// AURORA WAVES — CTA
// Stacked filled sine-wave bands. 6px step for perf.
// ─────────────────────────────────────────────────────────────
function AuroraBg() {
  const ref = useCanvasLoop((ctx, W, H, t) => {
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, W, H)

    const waves = [
      { yBase: 0.20, amp: 0.10, freq: 0.0020, speed: 0.22, col: RED,  alpha: 0.30, thickness: 0.22, phase: 0.0  },
      { yBase: 0.34, amp: 0.08, freq: 0.0028, speed: 0.30, col: BLUE, alpha: 0.22, thickness: 0.18, phase: 1.8  },
      { yBase: 0.48, amp: 0.12, freq: 0.0018, speed: 0.18, col: RED,  alpha: 0.26, thickness: 0.20, phase: 3.5  },
      { yBase: 0.62, amp: 0.09, freq: 0.0032, speed: 0.26, col: BLUE, alpha: 0.20, thickness: 0.16, phase: 2.1  },
      { yBase: 0.74, amp: 0.07, freq: 0.0024, speed: 0.34, col: PURP, alpha: 0.18, thickness: 0.14, phase: 0.9  },
      { yBase: 0.85, amp: 0.06, freq: 0.0038, speed: 0.20, col: RED,  alpha: 0.16, thickness: 0.12, phase: 4.2  },
    ]

    const STEP = 6  // was 4px — 33% fewer lineTo calls

    for (const w of waves) {
      const y0    = w.yBase * H
      const amp   = w.amp * H
      const thick = w.thickness * H
      const ph    = w.phase + t * w.speed

      ctx.beginPath()
      for (let x = 0; x <= W; x += STEP) {
        const y = y0 + amp * Math.sin(x * w.freq + ph)
                     + amp * 0.4 * Math.sin(x * w.freq * 2.3 + ph * 1.4 + 0.8)
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      for (let x = W; x >= 0; x -= STEP) {
        const y = y0 + thick + amp * 0.7 * Math.sin(x * w.freq + ph + 0.4)
                              + amp * 0.25 * Math.sin(x * w.freq * 2.1 + ph * 1.2)
        ctx.lineTo(x, y)
      }
      ctx.closePath()

      const grad = ctx.createLinearGradient(0, y0 - amp, 0, y0 + thick + amp)
      grad.addColorStop(0,   rgba(w.col, 0))
      grad.addColorStop(0.3, rgba(w.col, w.alpha * 0.5))
      grad.addColorStop(0.5, rgba(w.col, w.alpha))
      grad.addColorStop(0.7, rgba(w.col, w.alpha * 0.5))
      grad.addColorStop(1,   rgba(w.col, 0))
      ctx.fillStyle = grad
      ctx.fill()

      ctx.beginPath()
      for (let x = 0; x <= W; x += STEP) {
        const y = y0 + amp * Math.sin(x * w.freq + ph)
                     + amp * 0.4 * Math.sin(x * w.freq * 2.3 + ph * 1.4 + 0.8)
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = rgba(w.col, w.alpha * 1.8)
      ctx.lineWidth   = 1.5
      ctx.stroke()
    }
  })

  return <canvas ref={ref} style={canvasStyle} aria-hidden="true" />
}

// ─────────────────────────────────────────────────────────────
// CONSTELLATION — Contact
// 55 nodes (down from 80), flat-color lines (no per-line gradient),
// simple arc halos (no createRadialGradient per node).
// ─────────────────────────────────────────────────────────────
interface Node { x: number; y: number; vx: number; vy: number; r: number; col: { r: number; g: number; b: number } }

const ConstellationBg = memo(function ConstellationBg() {
  const nodes = useRef<Node[]>([])
  const prevW = useRef(0)
  const prevH = useRef(0)

  function initNodes(W: number, H: number) {
    const cols = [RED, RED, BLUE, BLUE, PURP]
    nodes.current = Array.from({ length: 45 }, () => ({
      x:   Math.random() * W,
      y:   Math.random() * H,
      vx:  (Math.random() - 0.5) * 0.28,
      vy:  (Math.random() - 0.5) * 0.18,
      r:   1.2 + Math.random() * 1.8,
      col: cols[Math.floor(Math.random() * cols.length)],
    }))
  }

  const ref = useCanvasLoop((ctx, W, H, t) => {
    if (W !== prevW.current || H !== prevH.current) { initNodes(W, H); prevW.current = W; prevH.current = H }

    ctx.fillStyle = BG
    ctx.fillRect(0, 0, W, H)

    const maxDist = Math.min(W, H) * 0.22
    const ns = nodes.current

    // Move nodes
    for (const n of ns) {
      n.x += n.vx; n.y += n.vy
      if (n.x < -10) n.x = W + 10
      if (n.x > W + 10) n.x = -10
      if (n.y < -10) n.y = H + 10
      if (n.y > H + 10) n.y = -10
    }

    // Draw connections — flat color, no gradient object per line
    for (let i = 0; i < ns.length; i++) {
      for (let j = i + 1; j < ns.length; j++) {
        const a = ns[i], b = ns[j]
        const dx = a.x - b.x, dy = a.y - b.y
        const dist2 = dx * dx + dy * dy
        if (dist2 > maxDist * maxDist) continue

        const alpha = (1 - Math.sqrt(dist2) / maxDist) * 0.30
        const pulse = 0.7 + 0.3 * Math.sin(t * 1.5 + i * 0.3 + j * 0.2)
        // Blend the two node colors manually
        const cr = (a.col.r + b.col.r) >> 1
        const cg = (a.col.g + b.col.g) >> 1
        const cb = (a.col.b + b.col.b) >> 1

        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${(alpha * pulse).toFixed(3)})`
        ctx.lineWidth = 0.8
        ctx.stroke()
      }
    }

    // Draw nodes — simple arc halo, no createRadialGradient
    for (const n of ns) {
      const pulse = 0.75 + 0.25 * Math.sin(t * 1.2 + n.x * 0.01)

      // Soft halo — just a large semi-transparent filled circle
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 4.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${n.col.r},${n.col.g},${n.col.b},${(0.12 * pulse).toFixed(3)})`
      ctx.fill()

      // Core dot
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${n.col.r},${n.col.g},${n.col.b},${(0.85 * pulse).toFixed(3)})`
      ctx.fill()
    }
  })

  return <canvas ref={ref} style={canvasStyle} aria-hidden="true" />
})

// ─────────────────────────────────────────────────────────────
const canvasStyle: CSSProperties = {
  position: 'absolute', inset: 0,
  width: '100%', height: '100%',
  pointerEvents: 'none', zIndex: 0,
}

// ─────────────────────────────────────────────────────────────
interface BlobBgProps { variant?: 'nebula' | 'red' | 'cta' | 'contact' }

export default function BlobBg({ variant = 'nebula' }: BlobBgProps) {
  if (variant === 'red')     return <AsteroidBeltBg />
  if (variant === 'cta')     return <AuroraBg />
  if (variant === 'contact') return <ConstellationBg />
  return <NebulaBg />
}
