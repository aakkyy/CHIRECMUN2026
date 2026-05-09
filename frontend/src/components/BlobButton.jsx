import { useRef, useState } from 'react'
import styles from './BlobButton.module.css'

/* Inverted colors: red button → blue blob, blue/transparent button → red blob */
const blobs = {
  red: {
    hover: 'rgba(100,170,255,1) 0%, rgba(40,120,255,0.92) 16%, rgba(10,70,230,0.62) 44%, rgba(5,30,160,0.18) 68%, transparent 85%',
    idle:  'rgba(50,120,255,0.72) 0%, rgba(25,85,230,0.42) 30%, transparent 60%',
  },
  blue: {
    hover: 'rgba(255,100,40,1) 0%, rgba(240,55,10,0.92) 16%, rgba(200,20,0,0.62) 44%, rgba(140,10,0,0.18) 68%, transparent 85%',
    idle:  'rgba(230,65,20,0.72) 0%, rgba(190,30,5,0.42) 30%, transparent 60%',
  },
}

export default function BlobButton({ children, href, onClick, className = '', variant = 'red' }) {
  const ref = useRef(null)
  const [pos, setPos]     = useState({ x: 18, y: 50 })
  const [hovered, setHov] = useState(false)

  const onMove = (e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    setPos({
      x: ((e.clientX - r.left) / r.width)  * 100,
      y: ((e.clientY - r.top)  / r.height) * 100,
    })
  }

  const b = blobs[variant] || blobs.red
  const x = hovered ? pos.x : 18
  const y = hovered ? pos.y : 50

  /*
   * ellipse 72% 100%:
   *   X semi-axis = 72% of button width  → focused energy blob, not wall-to-wall
   *   Y semi-axis = 100% of button height → blob ALWAYS exactly as tall as the button
   * Centered at y=50% so it covers top-to-bottom perfectly.
   */
  const blobStyle = {
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    pointerEvents: 'none',
    background: `radial-gradient(ellipse 72% 100% at ${x}% ${y}%, ${hovered ? b.hover : b.idle})`,
    transition: hovered ? 'background 0.06s linear' : 'background 0.55s ease',
    filter: hovered
      ? 'brightness(1.18) saturate(1.4)'
      : 'brightness(1.0) saturate(1.0)',
  }

  const inner = (
    <>
      <span style={blobStyle} aria-hidden="true" />
      <span className={styles.content}>{children}</span>
    </>
  )

  const shared = {
    ref,
    className: `${styles.wrap} ${className}`,
    onMouseMove: onMove,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    onClick,
  }

  return href
    ? <a href={href} {...shared}>{inner}</a>
    : <button {...shared}>{inner}</button>
}
