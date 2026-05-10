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
import { useEffect, useRef, type CSSProperties } from 'react'

const BG   = '#020108'
const RED  = { r: 192, g: 57,  b: 43  }
const REDB = { r: 231, g: 76,  b: 60  }
const BLUE = { r: 86,  g: 204, b: 242 }
const PURP = { r: 120, g: 55,  b: 210 }

function rgba({ r, g, b }: { r: number; g: number; b: number }, a: number) {
  return `rgba(${r},${g},${b},${a})`
}

// ── shared canvas hook ────────────────────────────────────────
function useCanvasLoop(
  draw: (ctx: CanvasRenderingContext2D, W: number, H: number, t: number) => void,
) {
  const ref = useRef<HTMLCanvasElement>(null)
  const t   = useRef(0)

  useEffect(() => {
    function resize() {
      const c = ref.current; if (!c) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      c.width  = c.offsetWidth  * dpr
      c.height = c.offsetHeight * dpr
      const ctx = c.getContext('2d')
      if (ctx) ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useAnimationFrame((_, dt) => {
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
// WARM SPACE — Countdown
// Deep space star field with warm drifting nebula glow.
// Subtle, covers the full section, space-themed, warm palette.
// ─────────────────────────────────────────────────────────────
interface Star { x: number; y: number; r: number; base: number; phase: number; warm: boolean }

function WarmSpaceBg() {
  const stars = useRef<Star[]>([])
  let prevW = 0, prevH = 0

  function initStars(W: number, H: number) {
    stars.current = Array.from({ length: 200 }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     0.25 + Math.random() * 0.9,
      base:  0.12 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      warm:  Math.random() > 0.6,
    }))
  }

  const ref = useCanvasLoop((ctx, W, H, t) => {
    if (W !== prevW || H !== prevH) { initStars(W, H); prevW = W; prevH = H }

    ctx.clearRect(0, 0, W, H)

    // ── Nebula layer 1: large warm centred glow ──
    const cx = W * 0.5, cy = H * 0.5
    const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.65)
    g1.addColorStop(0,    'rgba(175,48,28,0.18)')
    g1.addColorStop(0.45, 'rgba(140,32,18,0.07)')
    g1.addColorStop(1,    'rgba(90,14,6,0)')
    ctx.fillStyle = g1
    ctx.fillRect(0, 0, W, H)

    // ── Nebula layer 2: drifting amber left ──
    const ax = W * 0.22 + Math.sin(t * 0.07) * W * 0.07
    const ay = H * 0.48 + Math.cos(t * 0.05) * H * 0.09
    const g2 = ctx.createRadialGradient(ax, ay, 0, ax, ay, W * 0.38)
    g2.addColorStop(0,   'rgba(200,75,22,0.10)')
    g2.addColorStop(0.5, 'rgba(160,45,12,0.04)')
    g2.addColorStop(1,   'rgba(120,25,8,0)')
    ctx.fillStyle = g2
    ctx.fillRect(0, 0, W, H)

    // ── Nebula layer 3: drifting right ──
    const bx = W * 0.78 + Math.cos(t * 0.06) * W * 0.06
    const by = H * 0.52 + Math.sin(t * 0.08) * H * 0.08
    const g3 = ctx.createRadialGradient(bx, by, 0, bx, by, W * 0.32)
    g3.addColorStop(0,   'rgba(155,38,20,0.09)')
    g3.addColorStop(1,   'rgba(100,18,8,0)')
    ctx.fillStyle = g3
    ctx.fillRect(0, 0, W, H)

    // ── Stars ──
    for (const s of stars.current) {
      const twinkle = 0.55 + 0.45 * Math.sin(t * 0.9 + s.phase)
      const alpha   = s.base * twinkle
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = s.warm
        ? `rgba(255,215,170,${alpha.toFixed(3)})`
        : `rgba(255,245,235,${alpha.toFixed(3)})`
      ctx.fill()
    }
  })

  return <canvas ref={ref} style={canvasStyle} aria-hidden="true" />
}

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

function ConstellationBg() {
  const nodes = useRef<Node[]>([])

  function initNodes(W: number, H: number) {
    const cols = [RED, RED, BLUE, BLUE, PURP]
    nodes.current = Array.from({ length: 55 }, () => ({
      x:   Math.random() * W,
      y:   Math.random() * H,
      vx:  (Math.random() - 0.5) * 0.28,
      vy:  (Math.random() - 0.5) * 0.18,
      r:   1.2 + Math.random() * 1.8,
      col: cols[Math.floor(Math.random() * cols.length)],
    }))
  }

  let prevW = 0, prevH = 0

  const ref = useCanvasLoop((ctx, W, H, t) => {
    if (W !== prevW || H !== prevH) { initNodes(W, H); prevW = W; prevH = H }

    ctx.fillStyle = BG
    ctx.fillRect(0, 0, W, H)

    const maxDist = Math.min(W, H) * 0.22
    const ns = nodes.current

    // Move nodes
    for (const n of ns) {
      n.x += n.vx; n.y += n.vy
      if (n.x < 0 || n.x > W) n.vx *= -1
      if (n.y < 0 || n.y > H) n.vy *= -1
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
}

// ─────────────────────────────────────────────────────────────
const canvasStyle: CSSProperties = {
  position: 'absolute', inset: 0,
  width: '100%', height: '100%',
  pointerEvents: 'none', zIndex: 0,
}

// ─────────────────────────────────────────────────────────────
interface BlobBgProps { variant?: 'nebula' | 'red' | 'cta' | 'contact' }

export default function BlobBg({ variant = 'nebula' }: BlobBgProps) {
  if (variant === 'red')     return <WarmSpaceBg />
  if (variant === 'cta')     return <AuroraBg />
  if (variant === 'contact') return <ConstellationBg />
  return <NebulaBg />
}
