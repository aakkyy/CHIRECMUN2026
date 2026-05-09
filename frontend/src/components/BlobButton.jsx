import { useRef, useState } from 'react'
import styles from './BlobButton.module.css'

/*
 * Two-layer blob matching the reference architecture:
 *   Layer 1 — outerGlow: position absolute, inset:-10px, blur:16px → bleeds past button edge
 *   Layer 2 — innerGlow: clipped inside button via overflow:hidden → sharp hot core
 *
 * circle closest-side at X% 50%:
 *   radius = half the button height (closest side from center)
 *   diameter = button height exactly — always a perfect circle
 *   Y locked at 50%, only X tracks cursor
 *
 * Inverted: red button → blue blob | blue button → orange/red blob
 */

function makeGradient(variant, x, intense) {
  if (variant === 'red') {
    // red button → blue energy
    return intense
      ? `radial-gradient(circle closest-side at ${x}% 50%,
          rgba(255,255,255,1)      0%,
          rgba(215,238,255,0.99)   6%,
          rgba(100,175,255,0.96)  18%,
          rgba(45,118,255,0.72)   38%,
          rgba(12,55,230,0.32)    62%,
          transparent            100%)`
      : `radial-gradient(circle closest-side at ${x}% 50%,
          rgba(255,255,255,0.96)   0%,
          rgba(185,220,255,0.88)  12%,
          rgba(80,155,255,0.58)   32%,
          rgba(22,72,235,0.22)    60%,
          transparent            100%)`
  }
  // blue/transparent button → orange/red energy
  return intense
    ? `radial-gradient(circle closest-side at ${x}% 50%,
        rgba(255,255,255,1)      0%,
        rgba(255,234,190,0.99)   6%,
        rgba(255,148,42,0.96)   18%,
        rgba(255,65,8,0.72)     38%,
        rgba(208,14,0,0.32)     62%,
        transparent            100%)`
    : `radial-gradient(circle closest-side at ${x}% 50%,
        rgba(255,255,255,0.96)   0%,
        rgba(255,205,125,0.88)  12%,
        rgba(255,92,22,0.58)    32%,
        rgba(198,16,0,0.22)     60%,
        transparent            100%)`
}

export default function BlobButton({ children, href, onClick, className = '', variant = 'red' }) {
  const innerRef = useRef(null)
  const [posX, setPosX]   = useState(22)
  const [hovered, setHov] = useState(false)

  const onMove = (e) => {
    if (!innerRef.current) return
    const r = innerRef.current.getBoundingClientRect()
    setPosX(((e.clientX - r.left) / r.width) * 100)
  }

  const x = hovered ? posX : 22

  const outerGlowStyle = {
    background: makeGradient(variant, x, hovered),
    transition: hovered ? 'background 0.06s linear' : 'background 0.65s ease',
  }

  const innerGlowStyle = {
    background: makeGradient(variant, x, hovered),
    transition: hovered ? 'background 0.06s linear' : 'background 0.65s ease',
    filter: hovered
      ? 'blur(1px) brightness(1.3) saturate(1.5)'
      : 'blur(0.5px) brightness(1.08)',
  }

  const eventProps = {
    onMouseMove: onMove,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    onClick,
  }

  const innerContent = (
    <>
      <span
        style={innerGlowStyle}
        className={`${styles.innerGlow} ${hovered ? styles.innerGlowActive : ''}`}
        aria-hidden="true"
      />
      <span className={styles.content}>{children}</span>
    </>
  )

  return (
    <div className={styles.outer}>
      {/* Outer blurred glow — bleeds 10px past button edge on all sides */}
      <span
        style={outerGlowStyle}
        className={`${styles.outerGlow} ${hovered ? styles.outerGlowActive : ''}`}
        aria-hidden="true"
      />

      {/* Actual button / link — overflow:hidden clips inner glow */}
      {href ? (
        <a ref={innerRef} href={href} className={`${styles.inner} ${className}`} {...eventProps}>
          {innerContent}
        </a>
      ) : (
        <button ref={innerRef} className={`${styles.inner} ${className}`} {...eventProps}>
          {innerContent}
        </button>
      )}
    </div>
  )
}
