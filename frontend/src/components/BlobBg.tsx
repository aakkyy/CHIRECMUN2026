/**
 * BlobBg — cinematic canvas animations per section
 *
 *  nebula  (About)     → flow field: particles follow a smooth vector field, leaving luminous trails
 *  red     (Countdown) → galaxy spiral: two rotating arms of glowing particles
 *  cta     (CTA)       → aurora waves: stacked filled sine waves morphing in real time
 *  contact (Contact)   → constellation: soft floating nodes connected by pulsing lines
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
function lerpColor(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
  t: number,
) {
  return { r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t }
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
      c.width  = c.offsetWidth
      c.height = c.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useAnimationFrame((_, dt) => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    if (!c.width || !c.height) return
    t.current += Math.min(dt, 50) * 0.001
    draw(ctx, c.width, c.height, t.current)
  })

  return ref
}

// ─────────────────────────────────────────────────────────────
// SOFT GRADIENT MESH — About
// Four large slow-drifting gradient orbs with morphing shapes.
// Very subtle — designed to not compete with the text and cards.
// Pure Framer Motion divs, no canvas.
// ─────────────────────────────────────────────────────────────
function NebulaBg() {
  const orbs = [
    {
      style: { left: '-8%', top: '-20%', width: '55%', height: '55%' },
      color: `radial-gradient(circle at 40% 40%, ${rgba(RED, 0.22)} 0%, transparent 68%)`,
      blur: 90,
      animate: {
        x: [0, 55, 80, 30, 0], y: [0, 40, 90, 50, 0],
        borderRadius: ['60% 40% 55% 45%/50% 60% 40% 50%', '40% 60% 45% 55%/60% 40% 55% 45%', '55% 45% 60% 40%/45% 55% 50% 50%', '60% 40% 55% 45%/50% 60% 40% 50%'],
      },
      duration: 28, delay: 0,
    },
    {
      style: { left: '50%', top: '-5%', width: '52%', height: '52%' },
      color: `radial-gradient(circle at 55% 55%, ${rgba(BLUE, 0.16)} 0%, transparent 65%)`,
      blur: 100,
      animate: {
        x: [0, -60, -30, -70, 0], y: [0, 50, 100, 30, 0],
        borderRadius: ['45% 55% 50% 50%/55% 45% 60% 40%', '60% 40% 55% 45%/40% 60% 45% 55%', '50% 50% 40% 60%/60% 40% 50% 50%', '45% 55% 50% 50%/55% 45% 60% 40%'],
      },
      duration: 32, delay: 5,
    },
    {
      style: { left: '20%', top: '45%', width: '44%', height: '44%' },
      color: `radial-gradient(circle at 45% 50%, ${rgba(PURP, 0.13)} 0%, transparent 65%)`,
      blur: 85,
      animate: {
        x: [0, 50, 10, 60, 0], y: [0, -40, -80, -20, 0],
        scale: [1, 1.06, 0.97, 1.04, 1],
      },
      duration: 24, delay: 10,
    },
    {
      style: { left: '60%', top: '50%', width: '40%', height: '40%' },
      color: `radial-gradient(circle at 50% 40%, ${rgba(RED, 0.15)} 0%, transparent 65%)`,
      blur: 80,
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
            willChange: 'transform',
          }}
          animate={o.animate}
          transition={{ duration: o.duration, delay: o.delay, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// RADIAL DEPTH — Countdown
// Concentric slow-breathing rings + a deep ambient glow.
// Designed to frame the timer, not fight it. Very restrained.
// Pure Framer Motion — no canvas, no particles.
// ─────────────────────────────────────────────────────────────
function RadialBg() {
  // Ambient glow layers behind everything
  const glows = [
    { size: '110%', color: rgba(RED, 0.12), blur: 80, duration: 8,  scale: [1, 1.08, 1]   },
    { size: '70%',  color: rgba(RED, 0.16), blur: 60, duration: 11, scale: [1, 1.12, 1]   },
    { size: '38%',  color: rgba(REDB, 0.14), blur: 45, duration: 7, scale: [1, 1.18, 1]   },
  ]

  // Concentric rings that breathe in and out
  const rings = [
    { size: '88%',  border: rgba(RED, 0.10), duration: 14, delay: 0,   scale: [1, 1.04, 1] },
    { size: '65%',  border: rgba(RED, 0.14), duration: 10, delay: 1.5, scale: [1, 1.06, 1] },
    { size: '44%',  border: rgba(RED, 0.18), duration: 8,  delay: 0.8, scale: [1, 1.08, 1] },
    { size: '26%',  border: rgba(REDB, 0.22), duration: 6, delay: 2,   scale: [1, 1.10, 1] },
    { size: '12%',  border: rgba(REDB, 0.30), duration: 5, delay: 0.4, scale: [1, 1.14, 1] },
  ]

  const centreStyle: CSSProperties = {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
  }

  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>

      {/* Ambient depth glows */}
      {glows.map((g, i) => (
        <motion.div
          key={`g${i}`}
          style={{
            ...centreStyle,
            width: g.size, height: g.size,
            background: `radial-gradient(circle, ${g.color} 0%, transparent 70%)`,
            filter: `blur(${g.blur}px)`,
          }}
          animate={{ scale: g.scale, opacity: [0.7, 1, 0.7] }}
          transition={{ duration: g.duration, repeat: Infinity, ease: 'easeInOut', delay: i * 2 }}
        />
      ))}

      {/* Concentric rings */}
      {rings.map((r, i) => (
        <motion.div
          key={`r${i}`}
          style={{
            ...centreStyle,
            width: r.size, height: r.size,
            border: `1px solid ${r.border}`,
            boxShadow: `0 0 12px 2px ${r.border}, inset 0 0 12px 2px ${r.border}`,
          }}
          animate={{ scale: r.scale, opacity: [0.5, 1, 0.5] }}
          transition={{ duration: r.duration, delay: r.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Corner accent blobs — very soft */}
      {[
        { left: '0%',  top: '0%',  color: rgba(RED, 0.10) },
        { left: '65%', top: '0%',  color: rgba(RED, 0.08) },
        { left: '0%',  top: '55%', color: rgba(RED, 0.08) },
        { left: '65%', top: '55%', color: rgba(RED, 0.10) },
      ].map((a, i) => (
        <motion.div
          key={`a${i}`}
          style={{
            position: 'absolute', ...a,
            width: '35%', height: '45%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${a.color} 0%, transparent 70%)`,
            filter: 'blur(55px)',
          }}
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 7 + i * 1.5, repeat: Infinity, ease: 'easeInOut', delay: i }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// AURORA WAVES — CTA
// Stacked filled sine-wave bands that morph over time.
// Each band is a filled path so it looks volumetric, not just a line.
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

    for (const w of waves) {
      const y0 = w.yBase * H
      const amp = w.amp * H
      const thick = w.thickness * H
      const ph = w.phase + t * w.speed

      // Build top edge of band
      ctx.beginPath()
      for (let x = 0; x <= W; x += 4) {
        const y = y0 + amp * Math.sin(x * w.freq + ph)
                     + amp * 0.4 * Math.sin(x * w.freq * 2.3 + ph * 1.4 + 0.8)
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      // Close path with band thickness (bottom edge = slightly offset wave)
      for (let x = W; x >= 0; x -= 4) {
        const y = y0 + thick + amp * 0.7 * Math.sin(x * w.freq + ph + 0.4)
                              + amp * 0.25 * Math.sin(x * w.freq * 2.1 + ph * 1.2)
        ctx.lineTo(x, y)
      }
      ctx.closePath()

      // Vertical gradient fill: bright centre of band → transparent edges
      const grad = ctx.createLinearGradient(0, y0 - amp, 0, y0 + thick + amp)
      grad.addColorStop(0,   rgba(w.col, 0))
      grad.addColorStop(0.3, rgba(w.col, w.alpha * 0.5))
      grad.addColorStop(0.5, rgba(w.col, w.alpha))
      grad.addColorStop(0.7, rgba(w.col, w.alpha * 0.5))
      grad.addColorStop(1,   rgba(w.col, 0))
      ctx.fillStyle = grad
      ctx.fill()

      // Bright glowing top edge line
      ctx.beginPath()
      for (let x = 0; x <= W; x += 4) {
        const y = y0 + amp * Math.sin(x * w.freq + ph)
                     + amp * 0.4 * Math.sin(x * w.freq * 2.3 + ph * 1.4 + 0.8)
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = rgba(w.col, w.alpha * 1.8)
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
  })

  return <canvas ref={ref} style={canvasStyle} aria-hidden="true" />
}

// ─────────────────────────────────────────────────────────────
// CONSTELLATION — Contact
// Floating nodes connected by glowing lines when close.
// Very calm, elegant, professional.
// ─────────────────────────────────────────────────────────────
interface Node { x: number; y: number; vx: number; vy: number; r: number; col: { r: number; g: number; b: number } }

function ConstellationBg() {
  const nodes = useRef<Node[]>([])

  function initNodes(W: number, H: number) {
    const cols = [RED, RED, BLUE, BLUE, PURP]
    nodes.current = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.18,
      r: 1.2 + Math.random() * 1.8,
      col: cols[Math.floor(Math.random() * cols.length)],
    }))
  }

  let prevW = 0, prevH = 0
  const ref = useCanvasLoop((ctx, W, H, t) => {
    if (W !== prevW || H !== prevH) { initNodes(W, H); prevW = W; prevH = H }

    ctx.fillStyle = BG
    ctx.fillRect(0, 0, W, H)

    const maxDist = Math.min(W, H) * 0.22

    // Move nodes
    for (const n of nodes.current) {
      n.x += n.vx; n.y += n.vy
      if (n.x < 0 || n.x > W) n.vx *= -1
      if (n.y < 0 || n.y > H) n.vy *= -1
    }

    // Draw connections
    for (let i = 0; i < nodes.current.length; i++) {
      for (let j = i + 1; j < nodes.current.length; j++) {
        const a = nodes.current[i], b = nodes.current[j]
        const dx = a.x - b.x, dy = a.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > maxDist) continue

        const alpha = (1 - dist / maxDist) * 0.35
        const pulse = 0.7 + 0.3 * Math.sin(t * 1.5 + i * 0.3 + j * 0.2)

        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
        grad.addColorStop(0, rgba(a.col, alpha * pulse))
        grad.addColorStop(1, rgba(b.col, alpha * pulse))

        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 0.8
        ctx.stroke()
      }
    }

    // Draw nodes + soft glow
    for (const n of nodes.current) {
      const pulse = 0.75 + 0.25 * Math.sin(t * 1.2 + n.x * 0.01)

      // Outer halo
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5)
      g.addColorStop(0, rgba(n.col, 0.20 * pulse))
      g.addColorStop(1, rgba(n.col, 0))
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2); ctx.fill()

      // Core dot
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
      ctx.fillStyle = rgba(n.col, 0.85 * pulse)
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
  if (variant === 'red')     return <RadialBg />
  if (variant === 'cta')     return <AuroraBg />
  if (variant === 'contact') return <ConstellationBg />
  return <NebulaBg />
}
