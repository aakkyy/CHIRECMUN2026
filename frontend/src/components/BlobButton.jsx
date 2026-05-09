import { useRef, useState } from 'react'
import styles from './BlobButton.module.css'

const blobs = {
  red: {
    hover: 'rgba(255,140,80,0.95) 0%, rgba(220,70,40,0.75) 22%, transparent 58%',
    idle:  'rgba(255,100,55,0.55) 0%, rgba(200,50,25,0.32) 28%, transparent 58%',
  },
  blue: {
    hover: 'rgba(110,190,255,0.95) 0%, rgba(55,130,240,0.75) 22%, transparent 58%',
    idle:  'rgba(85,160,245,0.55) 0%, rgba(40,110,210,0.32) 28%, transparent 58%',
  },
}

export default function BlobButton({ children, href, onClick, className = '', variant = 'red' }) {
  const ref      = useRef(null)
  const [pos, setPos]       = useState({ x: 18, y: 50 })
  const [hovered, setHov]   = useState(false)

  const onMove = (e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  const b = blobs[variant] || blobs.red
  const x = hovered ? pos.x : 18
  const y = hovered ? pos.y : 50

  const blobStyle = {
    position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
    background: `radial-gradient(circle at ${x}% ${y}%, ${hovered ? b.hover : b.idle})`,
    transition: hovered ? 'background 0.07s linear' : 'background 0.55s ease',
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
